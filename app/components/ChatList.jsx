"use client";

import "./Messanger.scss";
import "./ChatList.scss";
import { FiArrowUpCircle } from "react-icons/fi";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { FiPlusCircle } from "react-icons/fi";

export default function ChatList({
  sender,
  recipient,
  setSender,
  setRecipient,
  setPopup,
}) {
  const CryptoJS = require("crypto-js");
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
    // console.log("디코딩 된 메세지:", decryptedMessage);
    // if (message.type === "newMessage") {
    setMessage((prev) => [...prev, decryptedMessage]);
    // }
  };

  useEffect(() => {
    console.log("응?");
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/chat-list?username=${sender}`,
        );
        // console.log(response.data);
        response.data.messages.forEach((message) => {
          decryptMesaage(message);
        });
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };

    if (sender) {
      //   let data = {
      //     type: "userInfo",
      //     id: sender,
      //   };
      //     wsRef?.current?.send(JSON.stringify(data));
      fetchMessages();
    }
  }, [sender]);

  useEffect(() => {
    console.log(message);
  }, [message]);

  const formattedTime = (createdat) => {
    const date = new Date(createdat);
    return (
      `${date.getMonth() + 1}/${date.getDate()} ` +
      `${String(date.getHours()).padStart(2, "0")}:` +
      `${String(date.getMinutes()).padStart(2, "0")}`
    );
  };

  const handleOnClick = (opponent) => {
    setSender(sender);
    setRecipient(opponent);
  };

  return (
    <div id="messenger" className="wrapper chatlist">
      <div className="bg-overlay">
        <div></div>
      </div>
      <div className="top-bar"></div>
      <div className="list-wrapper">
        <div className="flex-row title-wrapper">
          <div className="title">Chat List</div>
          <div
            onClick={() => {
              setPopup("new-chat");
            }}
          >
            <FiPlusCircle />
          </div>
        </div>
        {message &&
          message.map((item, index) => (
            <div
              key={index}
              className="list-item"
              onClick={() => {
                handleOnClick(
                  item.sender === sender ? item.recipient : item.sender,
                );
              }}
            >
              <div className="name">
                {item.sender === sender ? item.recipient : item.sender}
              </div>
              <div className="flex-row">
                <div className="message">{item.content}</div>
                <span className="time" key={index}>
                  {formattedTime(item.created_at)}
                </span>
              </div>
            </div>
          ))}
      </div>
      <div className="bottom-bar"></div>
    </div>
  );
}
