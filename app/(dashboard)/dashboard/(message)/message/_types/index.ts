import { connectionRequests } from './../_data/mock-data';
export interface Connection {
  id: string;
  name: string;
  email: string;  // Add this
  lastMessage: string;
  time: string;
  online: boolean;
  pending?: boolean;
  image: string;
}

export interface Message {
  id: string;
  sender: string;
  email: string;  // Add this
  image: string;
  text: string;
  time: string;
  read: boolean;
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