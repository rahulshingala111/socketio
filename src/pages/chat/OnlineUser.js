/* eslint-disable */
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";

function OnlineUser(props) {
  const [user, setUser] = useState();

  useEffect(() => {
    const usernamefetch = async () => {
      await axios
        .get("http://localhost:5000/api/users/" + props.ou.userId)
        .then((response) => {
          setUser(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    usernamefetch();
  }, []);

  const newConversation = () => {
    console.log("clicked");
  };

  return (
    <div onClick={newConversation}>
      <table border={1}>
        <tr>
          <tr>{user?.username}</tr>
        </tr>
      </table>
    </div>
  );
}
export default OnlineUser;
