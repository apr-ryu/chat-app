"use client";

import "./Login.scss";
import { useEffect, useRef, useState, useCallback, use } from "react";

export default function Login({ setSender, setRecipient }) {
  const senderName = useRef(null);
  const recipientName = useRef(null);
  const handleOnClick = (sender, recipient) => {
    if (sender.value && recipient.value) {
      setSender(sender.value);
      setRecipient(recipient.value);
    }
  };

  return (
    <div id="login">
      <div className="wrapper">
        <p>Welcome Back!</p>
        <input ref={senderName} type="text" placeholder="I am.." />
        <input
          ref={recipientName}
          type="text"
          placeholder="I'd like to talk to.."
        />
        <button
          onClick={() => {
            handleOnClick(senderName.current, recipientName.current);
          }}
        >
          SUBMIT
        </button>
      </div>
    </div>
  );
}
