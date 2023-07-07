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

  const [isLogin, setIsLogin] = useState(false);
  
  const handleJoinRoom = async (e) => {
    e.preventDefault();
    const data = {
      username,
    };
    await axios
      .post("http://localhost:5000/login", data)
      .then((response) => {
        console.log(response.data.username);
        setRoom(response.data.username);
        setShowChat(true);
      })
      .catch((error) => {
        console.log(error.response.data.username);
        if (error.response.data.username === null) {
          setIsLogin(true);
        }
      });
  };
  const handleNewRoom = (e) => {
    e.preventDefault();
    setShowRoom(true);
    socket.emit("newroom", { roomName });
  };

  return (
    <div className="App">
      {/* {!showRoom ? (
        <div className="joinChatContainer">
          <div>
            <h2>Join Room</h2>
          </div>
          <div>
            <input
              type="text"
              placeholder="room name"
              onChange={(e) => {
                setRoomName(e.target.value);
              }}
            />
            <input
              type="text"
              placeholder="username"
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
      )} */}
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
          <div>
            {isLogin ? <p style={{ color: "red" }}>INVALID Username</p> : null}
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
