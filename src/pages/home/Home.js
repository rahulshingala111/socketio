import axios from "axios";
import { CButton } from "@coreui/react";
import "@coreui/coreui/dist/css/coreui.min.css";
import { Button } from "@mui/material";

function Home() {
  axios
    .get("http://localhost:5000/home")
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });

  const handlemeet = () => {
    window.location = "https://127.0.0.1:8080/newmeet";
  };

  return (
    <div>
      <Button variant="contained" href="/login">
        Login
      </Button>
      <Button variant="contained" href="/register">
        Register
      </Button>
      <Button variant="contained" href="/chat">
        Chat
      </Button>
      <Button onClick={handlemeet}>to meet</Button>
    </div>
  );
}
export default Home;
