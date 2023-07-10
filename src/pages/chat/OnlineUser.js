/* eslint-disable */
import axios from "axios";
import { useState, useEffect } from "react";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";

function OnlineUser(props) {
  const [user, setUser] = useState();

  useEffect(() => {
    const usernamefetch = async () => {
      await axios
        .get("http://localhost:5000/api/user/" + props.ou.userId)
        .then((response) => {
          setUser(response.data[0]);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    usernamefetch();
  }, []);

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
              `${user?.firstname} ${
                user?.lastname ? user?.lastname : user?.firstname
              }`
            )}
          />
        </ListItemAvatar>
        <ListItemText
          primary={user?.firstname + " " + user?.lastname}
          secondary={"@" + user?.username}
        />
      </ListItem>
    </>
  );
}
export default OnlineUser;
