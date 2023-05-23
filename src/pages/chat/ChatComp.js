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

  useEffect(()=>{
    socket.on("getMessage",(data)=>{
      console.log('inside getmessage');
      console.log(data);
    })
  },[socket])


  useEffect(() => {
    socket.on("welcome", (mssg) => {
      console.log(mssg);
    });
  }, [socket]);

  useEffect(() => {
    socket.emit("addUser", room);
    socket.on("getUsers", (users) => {
      console.log(users);
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
    // try {
    //   socket.emit("file", file, { name: "rahul" }, (response) => {
    //     console.log(response.status);
    //     console.log("emmited");
    //   });
    // } catch (error) {
    //   console.log(error);
    // }
    const receiverId = curretChat.member.find((memeber) => memeber !== room);
    await socket.emit("sendMessage", {
      senderId: room,
      receiverId,
      text: currentMessage,
    });
    setCurrentMessage("");
  };

  const handleFile = (e) => {
    e.preventDefault();
    setfile(e.target.files[0]);
    console.log(e.target.files[0]);
  };
  return (
    <div>
      {conversation.map((c, index) => (
        <div
          onClick={() => {
            setCurrentChat(c);
          }}
        >
          <Conversation conversation={c} currentUser={room} key={index} />
        </div>
      ))}

      {curretChat ? (
        <div className="chat-window">
          <div className="chat-header">
            <p>Live Chat</p>
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
                onChange={handleFile}
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
