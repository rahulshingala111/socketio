/* eslint-disable */
import "./ChatCss.css";

function Download(data) {
  return (
    <div className="message-content">
      {data.text}
      {data.nameOFfile ? (
        <a
          href={`http://localhost:5000/download/${data.nameOFfile}`}
          target="_blank"
          download
        >
          link
        </a>
      ) : null}
    </div>
  );
}
export default Download;
