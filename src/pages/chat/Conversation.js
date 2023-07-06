/* eslint-disable */
import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Conversation({ conversationid, currentUser, conversation }) {
  const [friendId, setFriendId] = useState("");
  const navigate = useNavigate();

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
      navigate("/videocall", {
        state: {
          roomId: toconversationid,
          currentUser,
        },
      });
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
