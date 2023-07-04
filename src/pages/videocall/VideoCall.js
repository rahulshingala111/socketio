import axios from "axios";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Peer } from "peerjs";
import "./videocall.css";
const socket = io.connect("http://localhost:3001");

function VideoCall(props) {
  const [roomId, setRoomId] = useState(null);

  useEffect(() => {
    const rediretctoroomid = async () => {
      await axios.get("http://localhost:5000/videocall").then((response) => {
        setRoomId(response.data);
      });
    };
    rediretctoroomid();
  }, []);

  const myPeer = new Peer(undefined, {
    host: "/",
    port: "9000",
  });

  const videoGrid = document.getElementById("video-grid");
  const myVideo = document.createElement("video");
  myVideo.muted = true;

  myPeer.on("open", (id) => {
    socket.emit("join-room", roomId, id);
  });
  const peers = {};
  navigator.mediaDevices
    .getUserMedia({
      video: true,
      audio: true,
    })
    .then((stream) => {
      addVideoStream(myVideo, stream);

      //listening to other persons video
      myPeer.on("call", (call) => {
        call.answer(stream);
        const video = document.createElement("video");
        call.on("stream", (userVideoStream) => {
          addVideoStream(video, userVideoStream);
        });
      });

      socket.on("user-connected", (userId) => {
        connectToNewUser(userId, stream);
      });
    });

  socket.on("user-disconnected", (userId) => {
    if (peers[userId]) peers[userId].close();
  });

  const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener("loadedmetadata", () => {
      video.play();
    });
    videoGrid?.append(video);
  };
  const connectToNewUser = (userId, stream) => {
    const call = myPeer.call(userId, stream);
    const video = document.createElement("video");
    call.on("stream", (userVideoStream) => {
      addVideoStream(video, userVideoStream);
    });
    call.on("close", () => {
      video.remove();
    });
    peers[userId] = call;
  };

  return (
    <>
      <div id="video-grid"></div>
    </>
  );
}
export default VideoCall;
