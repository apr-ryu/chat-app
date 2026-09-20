"use client";

import { useRef } from "react";
import axios from "axios";
import "./Login.scss";
import type { LoginProps } from "../types";

export default function Login({
  setSender,
  setRecipient,
  setPopup,
  popup,
}: LoginProps) {
  const senderName = useRef<HTMLInputElement | null>(null);
  const recipientName = useRef<HTMLInputElement | null>(null);
  const password = useRef<HTMLInputElement | null>(null);

  const handleOnClick = (
    user: HTMLInputElement | null,
    password?: HTMLInputElement | null,
  ): void => {
    if (!user) return;
    if (popup === "sign-in" && user.value && password?.value) {
      login(user.value, password.value);
    } else if (popup === "sign-up" && user.value && password?.value) {
      signup(user.value, password.value);
    } else if (popup === "new-chat" && user.value) {
      setRecipient(user.value);
    } else if (!user.value || !password?.value) {
      alert("Please fill in all required fields.");
      return;
    }
    setPopup(false);
  };

  const login = async (username: string, password: string): Promise<void> => {
    try {
      const response = await axios.post(`http://localhost:3001/api/login`, {
        username: username,
        password: password,
      });
      console.log(response);
      if (response.status === 200) {
        setSender(username);
      }
    } catch (error: unknown) {
      console.error("Failed to fetch messages:", error);
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message);
      }
      location.reload();
    }
  };

  const signup = async (username: string, password: string): Promise<void> => {
    try {
      const response = await axios.post(`http://localhost:3001/api/signup`, {
        username: username,
        password: password,
      });
      if (response.status === 201) {
        alert(`Welcome!`);
        setSender(username);
      }
    } catch (error: unknown) {
      console.error("Failed to fetch messages:", error);
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message);
      }
      location.reload();
    }
  };

  return (
    <div id="login">
      <div className="wrapper">
        {popup === "start" && (
          <>
            <p>WELCOME !</p>
            <button
              onClick={() => {
                setPopup("sign-up");
              }}
            >
              Create new Account
            </button>
            <button
              onClick={() => {
                setPopup("sign-in");
              }}
            >
              Sign in
            </button>
          </>
        )}
        {(popup === "sign-up" || popup === "sign-in") && (
          <>
            <input ref={senderName} type="text" placeholder="USERNAME" />
            <input ref={password} type="password" placeholder="PASSWORD" />
            <button
              onClick={() => {
                handleOnClick(senderName.current, password.current);
              }}
            >
              {popup === "sign-up" ? "CREATE NEW ACCOUNT" : "SIGN IN"}
            </button>
          </>
        )}
        {popup === "new-chat" && (
          <>
            <p>{"I'd like to talk to.."}</p>
            <input ref={recipientName} type="text" placeholder="USERNAME" />
            <button
              onClick={() => {
                handleOnClick(recipientName.current);
              }}
            >
              START A NEW CHAT
            </button>
          </>
        )}
      </div>
    </div>
  );
}
