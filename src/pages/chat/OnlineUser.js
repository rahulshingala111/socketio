/* eslint-disable */
import axios from "axios";

function OnlineUser(props) {
  const newConversation = async () => {
    await axios
      .post("http://localhost:5000/api/newconversation", {
        currentUser: props.currentUser,
        newUser: props.ou.userId,
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };
//-
  return (
    <div onClick={newConversation}>
      <table border={1}>
        <tbody>
          <td>{props.ou.userId}</td>
        </tbody>
      </table>
    </div>
  );
}
export default OnlineUser;
