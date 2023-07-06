import React, { useEffect } from "react";

const JitsiVideoCall = ({ roomName, displayName, serverURL }) => {
  useEffect(() => {
    const domain = serverURL || "meet.jit.si";
    const options = {
      roomName: roomName,
      width: "100%",
      height: 700,
      parentNode: document.getElementById("jitsi-container"),
      interfaceConfigOverwrite: {
        SHOW_CHROME_EXTENSION_BANNER: false,
        TOOLBAR_BUTTONS: [
          "microphone",
          "camera",
          "closedcaptions",
          "desktop",
          "fullscreen",
          "fodeviceselection",
          "hangup",
          "profile",
          "chat",
          "recording",
          "livestreaming",
          "etherpad",
          "sharedvideo",
          "settings",
          "raisehand",
          "videoquality",
          "filmstrip",
          "invite",
          "feedback",
          "stats",
          "shortcuts",
          "tileview",
          "videobackgroundblur",
          "download",
          "help",
          "mute-everyone",
          "e2ee",
        ],
      },
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const api = new window.JitsiMeetExternalAPI(domain, options);
    api.executeCommand("displayName", displayName);

    return () => {
      api.dispose();
    };
  }, [roomName, displayName, serverURL]);

  return (
    <div id="jitsi-container" style={{ height: "100%", width: "100%" }}></div>
  );
};

export default JitsiVideoCall;
