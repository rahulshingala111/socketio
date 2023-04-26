import axios from "axios";
import { CButton } from "@coreui/react";
import "@coreui/coreui/dist/css/coreui.min.css";

function Register() {
  axios
    .get("http://localhost:5000/home")
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
  return (
    <div>
      <h1>Register</h1>
      <CButton href="/">Home</CButton>
    </div>
  );
}
export default Register;
