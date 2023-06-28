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
  return user?.username;
}
export default OnlineUser;
