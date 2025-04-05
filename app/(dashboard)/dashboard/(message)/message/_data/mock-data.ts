import profile from "@/public/avatars/emily.png"
import profileOne from "@/public/avatars/john.png"
import profileTwo from "@/public/avatars/michael.png"
import profileThree from "@/public/avatars/sophia.png"
import { Connection, Message } from "../_types";

// Sample connections data
export const connections: Connection[] = [
  {
    id: "1",
    name: "Corina McCoy",
    email: "corina.mccoy@example.com",
    lastMessage: "Awesome. This experience looks amazing! May I know what it...",
    time: "5:15 PM",
    online: true,
    pending: true,
    image: profileOne.src
  },
  {
    id: "2",
    name: "Patricia Sanders",
    email: "patricia.sanders@example.com",
    lastMessage: "Hey! Thanks for accepting the request. May I know what is...",
    time: "5:15 PM",
    online: true,
    image: profileTwo.src
  },
  {
    id: "3",
    name: "Chris Glasser",
    email: "chris.glasser@example.com",
    lastMessage: "BTW, What kind of service would you be interested in ex...",
    time: "5:14 PM",
    online: true,
    image: profileThree.src
  },
  {
    id: "4",
    name: "Lori Ward",
    email: "lori.ward@example.com",
    lastMessage: "These times are tough to manage when you have lot to...",
    time: "13h ago",
    online: false,
    image: profileOne.src
  },
  {
    id: "5",
    name: "Joshua Jones",
    email: "joshua.jones@example.com",
    lastMessage: "Yes, you're on point! That's what I meant when I wanted t...",
    time: "2 days ago",
    online: false,
    image: profileThree.src
  }
];

// Messages for different conversations
const messagesByUser = {
  "Corina McCoy": [
    {
      id: "1",
      sender: "user",
      email: "user@example.com",
      image: profile.src,
      text: "Hi Corina! I saw your graphic design portfolio. It's amazing!",
      time: "Thu, Apr, 2024",
      read: true
    },
    {
      id: "2",
      sender: "Corina McCoy",
      email: "corina.mccoy@example.com",
      image: profileOne.src,
      text: "Thank you! Are you interested in collaborating on a project?",
      time: "8:24 PM",
      read: true
    }
  ],

  "Patricia Sanders": [
    {
      id: "1",
      sender: "Patricia Sanders",
      email: "patricia.sanders@example.com",
      image: profileTwo.src,
      text: "Hello! I'm interested in your web development services.",
      time: "Wed, Apr, 2024",
      read: true
    },
    {
      id: "2",
      sender: "user",
      email: "user@example.com",
      image: profile.src,
      text: "Hi Patricia! I'd be happy to discuss your web development needs.",
      time: "9:30 AM",
      read: true
    }
  ],

  "Chris Glasser": [
    {
      id: "1",
      sender: "user",
      email: "user@example.com",
      image: profile.src,
      text: "Hey! 👋 I saw your post about Marketing & Social Media Management services. I've expertise in it! Are you open to an exchange?",
      time: "Thu, Apr, 2024",
      read: true
    },
    {
      id: "2",
      sender: "Chris Glasser",
      email: "chris.glasser@example.com",
      image: profileThree.src,
      text: "Would you be available for a quick call to discuss the details? 📞",
      time: "8:24 PM",
      read: true
    }
  ],

  "Lori Ward": [
    {
      id: "1",
      sender: "Lori Ward",
      email: "lori.ward@example.com",
      image: profileOne.src,
      text: "I need help with content writing for my blog.",
      time: "Mon, Apr, 2024",
      read: true
    },
    {
      id: "2",
      sender: "user",
      email: "user@example.com",
      image: profile.src,
      text: "I can definitely help with that! What's your blog about?",
      time: "11:15 AM",
      read: true
    }
  ],

  "Joshua Jones": [
    {
      id: "1",
      sender: "user",
      email: "user@example.com",
      image: profile.src,
      text: "Hi Joshua! Your photography portfolio is impressive!",
      time: "Tue, Apr, 2024",
      read: true
    },
    {
      id: "2",
      sender: "Joshua Jones",
      email: "joshua.jones@example.com",
      image: profileThree.src,
      text: "Thanks! Would you like to collaborate on a project?",
      time: "3:45 PM",
      read: true
    }
  ]
};

// Helper function to get messages by user
export const getMessagesByUser = (userName: string): Message[] => {
  return messagesByUser[userName] || [];
};

// Default empty messages array for initial state
export const messages: Message[] = [];