/* eslint-disable */
import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";

function Conversation({ socket, currentUser, conversation }) {
  const [friendId, setFriendId] = useState(null);
  const [friendIdData, setFriendIdData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser === conversation.member1) {
      setFriendId(conversation.member2);
    } else {
      setFriendId(conversation.member1);
    }
  }, []);

  useEffect(() => {
    axios.get("http://localhost:5000/api/user/" + friendId).then((response) => {
      setFriendIdData(response.data[0]);
    });
  }, [friendId]);

  const handleVideoCall = (e) => {
    e.preventDefault();
    const toVideoCall = async () => {
      await socket.emit("videocallnotification", {
        text: "Incoming Videocall",
        conversationid: conversation.id,
        friendId: friendId,
      });
      window.location = `https://127.0.0.1:8080/${conversation.id}`;
    };
    toVideoCall();
  };

  //#region -----style-----

  function stringToColor(string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
  }
  function stringAvatar(capitalName) {
    const name = capitalName.toUpperCase();
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
    };
  }
  //#endregion

  return (
    <>
      <ListItem>
        <ListItemAvatar>
          <Avatar
            {...stringAvatar(
              `${friendIdData?.firstname} ${
                friendIdData?.lastname
                  ? friendIdData?.lastname
                  : friendIdData?.firstname
              }`
            )}
          />
        </ListItemAvatar>
        <ListItemText
          primary={friendIdData?.firstname + " " + friendIdData?.lastname}
          secondary={"@" + friendIdData?.username}
        />
        <ListItemText onClick={handleVideoCall} primary="VideoCall" />
      </ListItem>
    </>
  );
}
export default Conversation;
