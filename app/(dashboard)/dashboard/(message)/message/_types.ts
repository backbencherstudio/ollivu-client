export interface Message {
  id: string;
  sender: string;
  email: string;
  text: string;
  time: string;
  read: boolean;
}

export interface User {
  _id: string;
  first_name: string;
  email: string;
  profileImage?: string;
}

export interface Connection {
  _id: string;
  reciverUserId: {
    _id: string;
    first_name: string;
    email: string;
    profileImage?: string;
  };
  online?: boolean;
  time?: string;
  lastMessage?: string;
  pending?: boolean;
}

export interface ChatAreaProps {
  messages: Message[];
  typing: boolean;
  setTyping: (typing: boolean) => void;
  selectedUser: User;
  onOpenDetails: () => void;
  setMessages: (messages: Message[]) => void;
  onBack: () => void;
}