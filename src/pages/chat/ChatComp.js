/* eslint-disable */
import { useEffect, useState } from "react";
import "./ChatCss.css";
import ScrollToBottom from "react-scroll-to-bottom";
import axios from "axios";
import Conversation from "./Conversation";
import "./Download";
import Download from "./Download";

function ChatComp({ socket, username, room }) {
  
  const [currentMessage, setCurrentMessage] = useState("");
  const [file, setfile] = useState();
  const [conversation, setConversation] = useState([]);

  const [curretChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState(null);

  //#region  --notification--
  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission();
    }
  }, []);

  const sendNotification = () => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("Hello!", {
        body: "This is a notification",
      });
    }
  };
  //#endregion

  //#region --message recive--
  useEffect(() => {
    console.log("welcome");
    async function mess() {
      await socket.on("getMessage", (data) => {
        setMessages((prev) => [
          ...prev,
          { text: data.text, sender: data.senderId },
        ]);
      });
      socket.on("test", (data) => {
        setMessages((prev) => [
          ...prev,
          { text: "file - ", sender: data.sender, nameOFfile: data.nameOFfile },
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
      // console.log(users);
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
          "http://localhost:5000/api/messages/" + curretChat?._id
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
    const receiverId = curretChat.member.find((memeber) => memeber !== room);
    await socket.emit("sendMessage", {
      senderId: room,
      receiverId,
      text: currentMessage,
    });
    setCurrentMessage("");
    setMessages((prev) => [...prev, { text: currentMessage, sender: room }]);
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
    const receiverId = curretChat.member.find((memeber) => memeber !== room);
    const metadata = {
      name: file.name,
      filetype: file.type,
      sentDate: noWDate,
      sender: room,
      senderId: room,
      receiverId,
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
    const receiverId = data.member.find((memeber) => memeber !== room);
    socket.emit("metadata", {
      senderId: room,
      receiverId: receiverId,
    });
  }
  //#endregion

  return (
    <div>
      {conversation.map((c, index) => (
        <div
          key={index}
          onClick={() => {
            setCurrentChat(c);
            metadataData(c);
          }}
        >
          <Conversation conversation={c} currentUser={room} key={index} />
        </div>
      ))}

      {curretChat ? (
        <div className="chat-window">
          <div className="chat-header">
            <p>Live Chat with {username}</p>
          </div>
          <div className="chat-body">
            <ScrollToBottom className="message-container">
              {messages.map((m, index) => (
                <div
                  key={index}
                  className="message"
                  id={m.sender === room ? "other" : "you"}
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
