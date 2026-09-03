"use client";

import { FiArrowUpCircle } from "react-icons/fi";
import { useEffect, useRef, useState } from "react";
import { FiArrowLeftCircle } from "react-icons/fi";
import axios from "axios";
import "./Messanger.scss";

export default function Messanger({ sender, recipient, setRecipient }) {
  const CryptoJS = require("crypto-js");
  const wsRef = useRef(null);
  const input = useRef("");
  const secretKey = useRef("my-secret-key-is-7777");
  const [message, setMessage] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const decryptMesaage = (message) => {
    let bytes = CryptoJS.AES.decrypt(message.content, secretKey.current);
    let decryptedText = bytes.toString(CryptoJS.enc.Utf8);
    // message.text = decryptedText;
    let decryptedMessage = {
      ...message,
      content: decryptedText,
    };
    // if (message.type === "newMessage") {
    setMessage((prev) => [...prev, decryptedMessage]);
    // }
  };

  useEffect(() => {
    const ws = new WebSocket("ws://192.168.1.67:8080");
    wsRef.current = ws;
    const fetchMessages = async () => {
      if (sender && recipient) {
        try {
          const response = await axios.get(
            `http://localhost:3001/api/messages?sender=${sender}&recipient=${recipient}`,
          );
          console.log(response.data);
          response.data.messages.forEach((message) => {
            decryptMesaage(message);
          });
        } catch (error) {
          console.error("Failed to fetch messages:", error);
        }
      }
    };

    //: Generating Public Keys
    ws.onopen = () => {
      console.log("ONOPEN");
      if (sender && recipient) {
        let data = {
          type: "userInfo",
          id: sender,
        };
        wsRef?.current?.send(JSON.stringify(data));
        fetchMessages();
      }
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      decryptMesaage(message);
    };

    ws.onclose = (e) => {
      console.log("Disconnected");
    };

    return () => {
      console.log("clean up");
      ws.close();
    };
  }, []);

  useEffect(() => {
    // const fetchMessages = async () => {
    //   try {
    //     const response = await axios.get(
    //       `http://localhost:3001/api/messages?sender=${sender}&recipient=${recipient}`,
    //     );
    //     console.log(response.data);
    //     response.data.messages.forEach((message) => {
    //       decryptMesaage(message);
    //     });
    //   } catch (error) {
    //     console.error("Failed to fetch messages:", error);
    //   }
    // };
    // if (sender && recipient) {
    //   let data = {
    //     type: "userInfo",
    //     id: sender,
    //   };
    //   wsRef?.current?.send(JSON.stringify(data));
    //   fetchMessages();
    // }
  }, [sender, recipient]);

  useEffect(() => {
    console.log(message);
  }, [message]);

  const handleOnClick = (input) => {
    let ciphertext = CryptoJS.AES.encrypt(
      input.current.value,
      secretKey.current,
    ).toString();

    let data = {
      type: "newMessage",
      sender: sender,
      recipient: recipient,
      content: ciphertext,
    };

    if (wsRef.current.readyState === WebSocket.OPEN) {
      wsRef?.current?.send(JSON.stringify(data));
    }
    setInputValue("");
  };

  const handleKeyDown = (e) => {
    console.log("키 다운");
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      handleOnClick(input);
    }
  };

  const formattedTime = (createdat) => {
    const date = new Date(createdat);
    return (
      `${String(date.getHours()).padStart(2, "0")}:` +
      `${String(date.getMinutes()).padStart(2, "0")}`
    );
  };

  return (
    <div id="messenger" className="wrapper">
      <div className="bg-overlay">
        <div></div>
      </div>
      <div
        className="back-button"
        onClick={() => {
          setRecipient(null);
        }}
      >
        <FiArrowLeftCircle />
      </div>
      <div className="top-bar"></div>
      <div className="message-box">
        {message.map((msg, index) =>
          msg.sender === sender && typeof window !== "undefined" ? (
            <div key={index} className="message-bubble sent">
              <div className="flex-row">
                <p>{msg.content}</p>
                <span>{formattedTime(msg.created_at)}</span>
              </div>
            </div>
          ) : (
            <div key={index} className="message-bubble received">
              <span>{msg.sender}</span>
              <div className="flex-row received">
                <p>{msg.content}</p>
                <span>{formattedTime(msg.created_at)}</span>
              </div>
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
