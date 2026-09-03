"use client";

import { useEffect, useRef, useState, useCallback, use } from "react";

import Messanger from "./components/Messenger";
import Login from "./components/Login";
import ChatList from "./components/ChatList";

export default function Home() {
  const [sender, setSender] = useState(null);
  const [recipient, setRecipient] = useState(null);
  const [popup, setPopup] = useState("sign-in");

  useEffect(() => {
    console.log(sender);
  }, [sender, recipient]);

  return (
    <div className={`page`}>
      {sender && <p className="title">{"LET'S YAPPP"}</p>}
      {popup && (
        <Login
          setSender={setSender}
          setRecipient={setRecipient}
          setPopup={setPopup}
          popup={popup}
        />
      )}
      {sender && !recipient && (
        <ChatList
          sender={sender}
          setSender={setSender}
          setRecipient={setRecipient}
          setPopup={setPopup}
        />
      )}
      {sender && recipient !== null && (
        <Messanger
          sender={sender}
          recipient={recipient}
          setRecipient={setRecipient}
        />
      )}
    </div>
  );
}
