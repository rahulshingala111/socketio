import { useEffect, useState } from "react";
import "./ChatCss.css";
import ScrollToBottom from "react-scroll-to-bottom";
function ChatComp({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [file, setFile] = useState();

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (currentMessage !== "") {
      const messageData = {
        room,
        username,
        currentMessage,
        file,
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
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };
  const handleFile = async (e) => {
    e.preventDefault();
    const abc = await convertToBase64(e.target.files[0]);
    setFile(abc);
  };

  useEffect(() => {
    socket.on("recieve_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);

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
                      {messagecontent.file ? (
                        <a href="#" download={messagecontent.file}>
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
            id="myfile"
            name="file"
            onChange={handleFile}
          ></input>
        </form>
      </div>
    </div>
  );
}
export default ChatComp;
