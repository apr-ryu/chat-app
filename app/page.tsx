"use client";

import { useState } from "react";
import Messanger from "./components/Messenger";
import Login from "./components/Login";
import ChatList from "./components/ChatList";
import { PopupState, UserState } from "./types";

export default function Home() {
  const [sender, setSender] = useState<UserState>(null);
  const [recipient, setRecipient] = useState<UserState>(null);
  const [popup, setPopup] = useState<PopupState>("start");

  return (
    <div className={`page`}>
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
