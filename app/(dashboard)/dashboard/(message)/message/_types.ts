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