import { useState } from "react";
import "../chat/Chat.css";
import "./ChatCss.css";
import { io } from "socket.io-client";
import ChatComp from "./ChatComp";
const socket = io.connect("http://localhost:3001");

function Chat() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);

  const handleJoinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowChat(true);
    } else {
      console.log("Enter both details....");
    }
  };

  return (
    <div className="App">
      {!showChat ? (
        <div className="joinChatContainer">
          <div>
            <h2>Join chat</h2>
          </div>
          <div>
            <input
              type="text"
              placeholder="name......"
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
            <input
              type="text"
              placeholder="room No..."
              onChange={(e) => {
                setRoom(e.target.value);
              }}
            />
          </div>
          <div>
            <button onClick={handleJoinRoom}>Join Room</button>
          </div>
        </div>
      ) : (
        <div>
          <ChatComp socket={socket} username={username} room={room} />
        </div>
      )}
    </div>
  );
}
export default Chat;
