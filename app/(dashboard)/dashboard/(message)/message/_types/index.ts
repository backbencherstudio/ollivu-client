export interface Connection {
    id: string;
    name: string;
    lastMessage: string;
    time: string;
    online: boolean;
    pending?: boolean;
    image: string;
  }
  
  export interface Message {
    id: string;
    image: string;
    sender: string;
    text: string;
    time: string;
    read?: boolean;
  }