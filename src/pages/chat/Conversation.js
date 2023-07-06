/* eslint-disable */
import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
function Conversation({ conversationid, currentUser, conversation }) {
  const [friendId, setFriendId] = useState("");

  useEffect(() => {
    if (currentUser === conversation.member1) {
      setFriendId(conversation.member2);
    } else {
      setFriendId(conversation.member1);
    }
  }, []);
  const handleVideoCall = () => {
    const toVideoCall = () => {
      const toconversationid = conversationid?.id;
      console.log(toconversationid);
      window.location = `/videocall?conversationid=` + toconversationid;
    };
    toVideoCall();
  };

  return (
    <div>
      <table border={1}>
        <th>{friendId}</th>
        <th onClick={handleVideoCall}>video call</th>
      </table>
    </div>
  );
}
export default Conversation;
