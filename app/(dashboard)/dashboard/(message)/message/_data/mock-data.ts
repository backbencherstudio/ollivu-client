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
    lastMessage: "Awesome. This experience looks amazing! May I know what it...",
    time: "5:15 PM",
    online: true,
    pending: true,
    image: profileOne.src
  },
  {
    id: "2",
    name: "Patricia Sanders",
    lastMessage: "Hey! Thanks for accepting the request. May I know what is...",
    time: "5:15 PM",
    online: true,
    image: profileTwo.src
  },
  {
    id: "3",
    name: "Chris Glasser",
    lastMessage: "BTW, What kind of service would you be interested in ex...",
    time: "5:14 PM",
    online: true,
    image: profileThree.src
  },
  {
    id: "4",
    name: "Lori Ward",
    lastMessage: "These times are tough to manage when you have lot to...",
    time: "13h ago",
    online: false,
    image: profileOne.src
  },
  {
    id: "5",
    name: "Joshua Jones",
    lastMessage: "Yes, you're on point! That's what I meant when I wanted t...",
    time: "2 days ago",
    online: false,
    image: profileThree.src
  }
];

// Sample messages data for Chris Glasser
export const messages: Message[] = [
  {
    id: "1",
    sender: "user",
    image: profile.src,
    text: "Hey! 👋 I saw your post about Marketing & Social Media Management services. I've expertise in it! Are you open to an exchange?",
    time: "Thu, Apr, 2024",
    read: true
  },
  {
    id: "2",
    sender: "Chris Glasser",
    image: profile.src,
    text: "Would you be available for a quick call to discuss the details? 📞",
    time: "8:24 PM",
    read: true
  },
  {
    id: "3",
    sender: "user",
    image: profile.src,
    text: "Hey, thanks for reaching out!",
    time: "Read 8:45",
    read: true
  }, 
  {
    id: "4",
    sender: "user",
    image: profile.src,
    text: "A call sounds great! When would be a good time for you?",
    time: "8:44 PM",
    read: true
  },
  {
    id: "5",
    sender: "Chris Glasser",
    image: profileOne.src,
    text: "BTW, What kind of service would you be interested in swapping for the Marketing & Social Media Management? I see that you can swap with web development.",
    time: "8:50 PM",
    read: false
  }
];