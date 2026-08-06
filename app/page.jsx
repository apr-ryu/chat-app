"use client";

import { useEffect, useRef, useState, useCallback, use } from "react";

import Messanger from "./components/Messenger";
import Login from "./components/Login";

export default function Home() {
  const [sender, setSender] = useState(null);
  const [recipient, setRecipient] = useState(null);

  useEffect(() => {
    console.log(sender);
  }, [sender, recipient]);

  return (
    <div className={`page`}>
      <p className="title">{"LET'S YAPPP"}</p>
      {!sender && !recipient && (
        <Login setSender={setSender} setRecipient={setRecipient} />
      )}
      <Messanger sender={sender} recipient={recipient} />
    </div>
  );
}
