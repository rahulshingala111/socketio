/* eslint-disable */
import { useEffect, useState } from "react";
import "./ChatCss.css";
import ScrollToBottom from "react-scroll-to-bottom";

function ChatComp({ socket, username, room }) {

  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  useEffect(() => {
    socket.on("recieve_message", (data) => {
      new setMessageList((list) => [...list, data]);
    });
  }, [socket]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (currentMessage !== "") {

      const messageData = {
        room,
        username,
        currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };
      
      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    } else {
      console.log("enter your message first..!!!");
    }
  };

  const handleFile = (e) => {
    e.preventDefault();
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>Live Chat</p>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messageList.map((messagecontent, index) => {
            return (
              <div
                key={index}
                className="message"
                id={username === messagecontent.username ? "other" : "you"}
              >
                <div>
                  <div className="message-content">
                    <p>
                      {messagecontent.currentMessage} &nbsp;
                      {messagecontent ? (
                        <a href="#" download="#">
                          attachment
                        </a>
                      ) : null}
                    </p>
                  </div>
                  <div className="message-meta">
                    <p id="time">{messagecontent.time}</p>
                    <p id="author">{messagecontent.username}</p>
                  </div>
                </div>
              </div>
            );
          })}
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
  );
}
export default ChatComp;
