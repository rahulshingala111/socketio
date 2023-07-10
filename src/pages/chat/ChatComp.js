/* eslint-disable */
import { useEffect, useState } from "react";
import "./ChatCss.css";
import "../chat/Chat.css";
import ScrollToBottom from "react-scroll-to-bottom";
import axios from "axios";
import Conversation from "./Conversation";
import "./Download";
import Download from "./Download";
import OnlineUser from "./OnlineUser";
import { Grid } from "@mui/material";

//design
import List from "@mui/material/List";

function ChatComp({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [file, setfile] = useState();

  const [conversation, setConversation] = useState([]);

  const [curretChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState(null);

  const [onlineUser, setOnlineUser] = useState([]);

  const [newconversation, setewConversation] = useState([]);
  const [friendid, setFriendId] = useState("");
  //#region  --notification--
  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission();
    }
  }, []);

  const sendNotification = (e) => {
    e.preventDefault();
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("Hello!", {
        body: "This is a notification",
      });
    } else {
      console.log("permission not granted");
    }
  };
  //#endregion

  //#region --message recive--
  useEffect(() => {
    async function mess() {
      await socket.on("getMessage", (data) => {
        setMessages((prev) => [
          ...prev,
          { text: data.text, senderid: data.senderId },
        ]);
      });
      socket.on("test", (data) => {
        setMessages((prev) => [
          ...prev,
          {
            text: "file - ",
            senderid: data.sender,
            nameOFfile: data.nameOFfile,
          },
        ]);
      });
    }
    mess();
  }, [socket]);

  //#endregion

  //#region --active_user--
  useEffect(() => {
    socket.emit("addUser", room);
    socket.on("getUsers", (users) => {
      setOnlineUser(users);
    });
  }, [room]);
  //#endregion

  //#region --previos chat and diffrent user--
  useEffect(() => {
    const getconversation = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/conversation/" + room
        );
        setConversation(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getconversation();
  }, [room]);

  useEffect(() => {
    const getMessage = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/messages/" + curretChat?.id
        );
        setMessages(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getMessage();
  }, [curretChat]);
  //#endregion

  //#region --handle--
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (currentMessage === "") {
      return null;
    }
    await socket.emit("sendMessage", {
      senderId: room,
      text: currentMessage,
      conversationid: newconversation.id,
    });
    setCurrentMessage("");
    setMessages((prev) => [...prev, { text: currentMessage, senderid: room }]);
  };

  const handleSendFile = async (e) => {
    e.preventDefault();
    if (file === undefined) {
      return false;
    }
    const newDate = new Date();
    const noWDate = `${username}-${newDate.getDate()}-${
      newDate.getMonth() + 1
    }-${newDate.getFullYear()}-${newDate.getHours()}-${newDate.getMinutes()}-${newDate.getSeconds()}`;
    const metadata = {
      name: file.name,
      filetype: file.type,
      sentDate: noWDate,
      sender: room,
      senderId: room,
      receiverId: friendid,
    };
    try {
      socket.emit("file", file, metadata, (response) => {
        console.log(response.status);
      });
      setMessages((prev) => [
        ...prev,
        {
          text: "file - ",
          sender: room,
          nameOFfile: `${noWDate}-${file.name}`,
        },
      ]);
    } catch (error) {
      console.log(error);
    }
  };

  //#endregion

  //#region --ETC--
  function metadataData(data) {
    socket.emit("metadata", {
      senderId: room,
      receiverId: friendid,
      conversationid: data.id,
    });
  }

  const FriendIDNAME = (data) => {
    if (room === data.member1) {
      setFriendId(data.member2);
    } else {
      setFriendId(data.member1);
    }
  };
  //#endregion

  return (
    <div>
      <div>
        Online User:
        <List
          sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
        >
          {onlineUser.map((ou, index) => (
            <div key={index}>
              <OnlineUser ou={ou} currentUser={room} />
            </div>
          ))}
        </List>
      </div>
      <div>
        Your Chat
        <List
          sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
        >
          {conversation.map((c, index) => (
            <div
              key={index}
              onClick={() => {
                setCurrentChat(c);
                metadataData(c);
                FriendIDNAME(c);
                setewConversation(c);
              }}
            >
              <Conversation
                conversationid={newconversation}
                conversation={c}
                currentUser={room}
                key={index}
              />
            </div>
          ))}
        </List>
      </div>
      {curretChat ? (
        <div className="chat-window">
          <div className="chat-header">
            <p>Live Chat with {friendid}</p>
          </div>
          <div className="chat-body">
            <ScrollToBottom className="message-container">
              {messages.map((m, index) => (
                <div
                  key={index}
                  className="message"
                  id={m.senderid === room ? "other" : "you"}
                >
                  <Download text={m.text} nameOFfile={m.nameOFfile} />
                </div>
              ))}
            </ScrollToBottom>
          </div>
          <div className="chat-footer">
            <form>
              <input
                type="text"
                value={currentMessage}
                placeholder="Send Message...."
                onChange={(e) => {
                  e.preventDefault();
                  setCurrentMessage(e.target.value);
                }}
              />
              <button type="submit" onClick={handleSendMessage}>
                send
              </button>
              <input
                type="file"
                id="file"
                name="file"
                onChange={(e) => {
                  e.preventDefault();
                  setfile(e.target.files[0]);
                }}
              ></input>
              <button onClick={handleSendFile}>Send file</button>
              <button onClick={sendNotification}>Notification</button>
            </form>
          </div>
        </div>
      ) : (
        <span>click to user to open Conversation chat</span>
      )}
    </div>
  );
}
export default ChatComp;
