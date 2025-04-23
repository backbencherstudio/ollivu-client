import { connectionRequests } from './../_data/mock-data';
export interface Connection {
  id: string;
  senderUserId: {
    _id: string;
    first_name: string;
    profileImage?: string;
  };
  lastMessage?: {
    content: string;
    createdAt: string;
  };
  message?: string;
  time?: string;
}

export interface Message {
  id: string;
  sender: string;
  receiver?: string;
  content: string;
  room?: string;
  createdAt: string;
  isRead: boolean;
}

export interface SelectedUserData {
  name: string;
  email: string;
  image: string;
}

export interface ConnectionRequest {
  id: string;
  name: string;
  image: string,
  time: string,
  message: string
}