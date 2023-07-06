import "./videocall.css";
import JitsiVideoCall from "./JitsiVideoCall";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";

function VideoCall() {
  const [roomId, setRommId] = useState();
  const [currentUser, setCurrentUser] = useState();
  const [isRoom, setIsRoom] = useState(true);

  let location = useLocation();

  useEffect(() => {
    setRommId(location.state.roomId);
    setCurrentUser(location.state.currentUser);
    console.log(location.state.roomId);
    // if (roomId === undefined) {
    //   setIsRoom(false);
    // }
  }, []);

  return (
    <div>
      {isRoom ? (
        <JitsiVideoCall roomName={roomId} displayName='jhon' />
      ) : (
        <>{(window.location = "/chat")}</>
      )}
    </div>
  );
}
export default VideoCall;
