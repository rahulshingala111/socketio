/* eslint-disable */
import { useEffect, useState } from "react";
import "./ChatCss.css";
import ScrollToBottom from "react-scroll-to-bottom";
import axios from "axios";
//import { writeFile } from "fs";
import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
} from "@chatscope/chat-ui-kit-react";
import Conversation from "./Conversation";

function ChatComp({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [file, setfile] = useState();
  const [conversation, setConversation] = useState([]);

  const [curretChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState(null);

  useEffect(() => {
    // console.log("welcome");
    // await socket.on("getMessage", (data) => {
    //   console.log(data.text);
    //   setMessages((prev) => [
    //     ...prev,
    //     { text: data.text, sender: data.senderId },
    //   ]);
    // });
    console.log("welcome");
    async function mess() {
      await socket.on("getMessage", (data) => {
        console.log(data.text);
        setMessages((prev) => [
          ...prev,
          { text: data.text, sender: data.senderId },
        ]);
      });
      socket.on("test", (data) => {
        console.log(data);
      });
    }
    mess();
  }, [socket]);

  useEffect(() => {
    socket.emit("addUser", room);
    socket.on("getUsers", (users) => {
      //console.log(users);
    });
  }, [room]);

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

  const handleSendMessage = async (e) => {
    e.preventDefault();
    // if (currentMessage === "") {
    //   return null;
    // }
    // const receiverId = curretChat.member.find((memeber) => memeber !== room);
    // await socket.emit("sendMessage", {
    //   senderId: room,
    //   receiverId,
    //   text: currentMessage,
    // });
    // setCurrentMessage("");
    // setMessages((prev) => [...prev, { text: currentMessage, sender: room }]);

    try {
      socket.emit("file", file, { name: "rahul" }, (response) => {
        console.log(response.status);
        console.log("emmited");
      });
    } catch (error) {
      console.log(error);
    }
  };

  function metadataData(data) {
    const receiverId = data.member.find((memeber) => memeber !== room);
    socket.emit("metadata", {
      senderId: room,
      receiverId: receiverId,
    });
  }

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
                  <div className="message-content">{m.text}</div>
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
                  console.log(e.target.files[0]);
                }}
              ></input>
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
