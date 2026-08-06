"use client";

import "./Messanger.scss";
import { FiArrowUpCircle } from "react-icons/fi";
import { useEffect, useRef, useState, useCallback, use } from "react";

export default function Messanger({ sender, recipient }) {
  const CryptoJS = require("crypto-js");
  const wsRef = useRef(null);
  const input = useRef("");
  const secretKey = useRef("my-secret-key-is-7777");
  const [message, setMessage] = useState([]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const ws = new WebSocket("ws://192.168.1.67:8080");
    wsRef.current = ws;

    //: Generating Public Keys
    ws.onopen = () => {
      console.log("ONOPEN");
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      let bytes = CryptoJS.AES.decrypt(message.text, secretKey.current);
      let decryptedText = bytes.toString(CryptoJS.enc.Utf8);
      message.text = decryptedText;

      let decryptedMessage = { ...message, text: decryptedText };
      if (message.type === "text") {
        setMessage((prev) => [...prev, decryptedMessage]);
      }
    };

    ws.onclose = (e) => {
      console.log("Disconnected");
    };

    return () => {
      console.log("클립업함수");
      ws.close();
    };
  }, []);

  const handleOnClick = (input) => {
    let ciphertext = CryptoJS.AES.encrypt(
      input.current.value,
      secretKey.current,
    ).toString();

    let data = {
      type: "text",
      sender: sender,
      recipient: recipient,
      text: ciphertext,
    };

    if (wsRef.current.readyState === WebSocket.OPEN) {
      wsRef?.current?.send(JSON.stringify(data));
    }
    setInputValue("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleOnClick(input);
    }
  };

  return (
    <div id="messenger" className="wrapper">
      <div className="bg-overlay">
        <div></div>
      </div>
      <div className="top-bar"></div>
      <div className="message-box">
        {message.map((msg, index) =>
          msg.sender === sender && typeof window !== "undefined" ? (
            <div key={index} className="message-bubble sent">
              <p>{msg.text}</p>
            </div>
          ) : (
            <div key={index} className="message-bubble received">
              <span>{msg.sender}</span>
              <p>{msg.text}</p>
            </div>
          ),
        )}
      </div>

      <div className="input-wrapper">
        <input
          type="text"
          ref={input}
          value={inputValue}
          onChange={(e) => setInputValue(e?.target?.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={() => {
            handleOnClick(input);
          }}
        >
          <FiArrowUpCircle color="#fff" />
        </button>
      </div>
      <div className="bottom-bar"></div>
    </div>
  );
}
