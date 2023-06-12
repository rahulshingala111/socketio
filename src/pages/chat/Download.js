import axios from "axios";
import "./ChatCss.css";
import { logDOM } from "@testing-library/react";

function Download(data) {
  return (
    <div className="message-content">
      {data.text}
      {data.nameOFfile ? (
        <a href={`http://localhost:5000/download/${data.nameOFfile}`} download>
          link
        </a>
      ) : null}
    </div>
  );
}
export default Download;
