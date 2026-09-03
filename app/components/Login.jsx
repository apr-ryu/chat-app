"use client";

import "./Login.scss";
import { useRef } from "react";

export default function Login({ setSender, setRecipient, setPopup, popup }) {
  const senderName = useRef(null);
  const recipientName = useRef(null);
  const handleOnClick = (user) => {
    if (popup === "sign-in") {
      setSender(user.value);
    } else if (popup === "new-chat") {
      setRecipient(user.value);
    }
    setPopup(false);
  };

  return (
    <div id="login">
      <div className="wrapper">
        <p>{popup === "sign-in" ? "SIGN IN" : "NEW CHAT"}</p>
        <input
          ref={popup === "sign-in" ? senderName : recipientName}
          type="text"
          placeholder="USERNAME"
        />
        {/* <input
          ref={recipientName}
          type="text"
          placeholder="I'd like to talk to.."
        /> */}
        <button
          onClick={() => {
            handleOnClick(
              popup === "sign-in" ? senderName.current : recipientName.current,
            );
          }}
        >
          SUBMIT
        </button>
      </div>
    </div>
  );
}
