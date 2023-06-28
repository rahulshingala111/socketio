import { useState } from "react";
import "../chat/Chat.css";
import "./ChatCss.css";
import { io } from "socket.io-client";
import ChatComp from "./ChatComp";
import RoomComp from "./Component/RoomComp";
import axios from "axios";
const socket = io.connect("http://localhost:3001");

function Chat() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState(null);
  const [showChat, setShowChat] = useState(false);

  const [roomName, setRoomName] = useState();
  const [roomUserName, setRoomUserName] = useState();
  const [showRoom, setShowRoom] = useState(false);

  const handleJoinRoom = async (e) => {
    e.preventDefault();
    const data = {
      username,
    };
    await axios
      .post("http://localhost:5000/login", data)
      .then((response) => {
        console.log(response.data.id);
        setRoom(response.data.id);
        setShowChat(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleNewRoom = (e) => {
    e.preventDefault();
    setShowRoom(true);
    socket.emit("newroom", { roomName });
  };

  return (
    <div className="App">
      {!showRoom ? (
        <div className="joinChatContainer">
          <div>
            <h2>Join Room</h2>
          </div>
          <div>
            <input
              type="text"
              placeholder="ex. rahul"
              onChange={(e) => {
                setRoomName(e.target.value);
              }}
            />
            <input
              type="text"
              placeholder="ex. rahul"
              onChange={(e) => {
                setRoomUserName(e.target.value);
              }}
            />
          </div>
          <div>
            <button onClick={handleNewRoom}>Join Room</button>
          </div>
        </div>
      ) : (
        <div>
          <RoomComp socket={socket} room={roomName} user={roomUserName} />
        </div>
      )}
      {!showChat ? (
        <div className="joinChatContainer">
          <div>
            <h2>Enter Username</h2>
          </div>
          <div>
            <input
              type="text"
              placeholder="ex. rahul"
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
          </div>
          <div>
            <button onClick={handleJoinRoom}>Join Chat</button>
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
