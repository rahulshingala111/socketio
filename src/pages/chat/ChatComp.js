/* eslint-disable */
import { useEffect, useState } from "react";
import "./ChatCss.css";
import ScrollToBottom from "react-scroll-to-bottom";
function ChatComp({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [chunk, setChunk] = useState();
  const [downloadedFile, setDownloadedFile] = useState([]);
  let newfile = [];
  useEffect(() => {
    socket.on("recieve_message", (data) => {
      newfile.buffer = [];

      newfile.buffer.push(data.buffer);
      console.log(newfile.buffer);
      download(new Blob(newfile.buffer), "any");
      setDownloadedFile(newfile.buffer);
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
        buffer: chunk,
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
    console.log(e.target.files[0]);
    let newFile = e.target.files[0];
    let reader = new FileReader();
    reader.onload = (e) => {
      let buffer = new Uint8Array(reader.result);
      shareFile(
        {
          filename: newFile.name,
          total_buffer_size: buffer.length,
          buffer_size: 1024,
        },
        buffer
      );
    };
    reader.readAsArrayBuffer(newFile);
  };

  function shareFile(metadata, buffer) {
    let chunk = buffer.slice(0, metadata.buffer_size);
    setChunk(chunk);
  }

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
                      {messagecontent.buffer ? (
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
