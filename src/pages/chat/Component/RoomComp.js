import ScrollToBottom from "react-scroll-to-bottom";
import { useState, useEffect } from "react";
import Download from "../Download";

function RoomComp({ socket, room, user }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [curretChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    console.log("welcome");
    function mess() {
      socket.on("roomrecive", (data) => {
        console.log(data);
        setMessages((prev) => [
          ...prev,
          { text: data.text, sender: data.user },
        ]);
      });
    }
    mess();
  }, [socket]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    socket.emit("roomemit", { text: currentMessage, room: room, user: user });
    setMessages((abc) => [...abc, { text: currentMessage, sender: room }]);
  };

  return (
    <>
      <div className="chat-window">
        <div className="chat-header">
          <p>Live Chat with GROUP</p>
        </div>
        <div className="chat-body">
          <ScrollToBottom className="message-container">
            {messages?.map((m, index) => (
              <div
                key={index}
                className="message"
                id={m.sender === room ? "other" : "you"}
              >
                <div className="message-content">{m.text}</div>
                <div className="author">as</div>
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
          </form>
        </div>
      </div>
    </>
  );
}
export default RoomComp;
