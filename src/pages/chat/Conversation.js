/* eslint-disable */
import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
function Conversation({ currentUser, conversation }) {
  const [friendId, setFriendId] = useState("");

  useEffect(() => {
    if (currentUser === conversation.member1) {
      setFriendId(conversation.member2);
    } else {
      setFriendId(conversation.member1);
    }
  }, []);

  return (
    <div>
      <table border={2}>
        <tr>{friendId}</tr>
      </table>
    </div>
  );
}
export default Conversation;
