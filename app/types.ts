import type { Dispatch, SetStateAction } from "react";

export type PopupState = "start" | "sign-up" | "sign-in" | "new-chat" | false;

export type UserState = string | null;

export interface LoginProps {
  setSender: Dispatch<SetStateAction<UserState | null>>;
  setRecipient: Dispatch<SetStateAction<UserState | null>>;
  setPopup: Dispatch<SetStateAction<PopupState>>;
  popup: PopupState;
}
export interface ChatListProps {
  setSender: Dispatch<SetStateAction<UserState | null>>;
  setRecipient: Dispatch<SetStateAction<UserState | null>>;
  setPopup: Dispatch<SetStateAction<PopupState>>;
  sender: UserState;
}
export interface MessangerProps {
  setRecipient: Dispatch<SetStateAction<UserState | null>>;
  sender: UserState;
  recipient: UserState;
}

export type MessageState = {
  created_at: string;
  id: number;
  recipient: string;
  sender: string;
  content: string;
};

export type MessageApiResponse = {
  messages: MessageState[];
};
