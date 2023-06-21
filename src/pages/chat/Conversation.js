/* eslint-disable */
import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
function Conversation({ currentUser, conversation }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const friendId = conversation.member.find((m) => m !== currentUser);
    const getUser = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/getuser/" + friendId
        );
        setUser(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  }, [currentUser, conversation]);

  return (
    <div>
      <table border={2}>
        <row>{user?.firstname}</row>
      </table>
    </div>
  );
}
export default Conversation;
