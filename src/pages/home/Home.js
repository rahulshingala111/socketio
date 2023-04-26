import axios from "axios";
import { CButton } from "@coreui/react";
import "@coreui/coreui/dist/css/coreui.min.css";

function Home() {
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
      <h1>hello</h1>
      <CButton href="/login">Login</CButton>
      <CButton href="/register">Register</CButton>
    </div>
  );
}
export default Home;
