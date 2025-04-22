"use client";
import { useState } from "react";
import { BsEmojiSmile } from "react-icons/bs";
import { IoIosAttach, IoIosSend } from "react-icons/io";

export const MessageInput = ({ sendMessage, message, setMessage }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const onEmojiClick = (emojiObject) => {
    setMessage((prevMessage) => prevMessage + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(e);
    setShowEmojiPicker(false);
  };

  return (
    <div>
      <div className="md:p-4 py-4 border-t border-gray-100 absolute bg-white bottom-0 w-[90%] md:w-full">
        <form
          onSubmit={handleSubmit}
          className="flex gap-2 items-center relative"
        >
          <div className="relative">
            <BsEmojiSmile
              className="text-gray-400 h-6 w-6 cursor-pointer"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            />
          </div>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type message..."
            className="flex-grow p-2 rounded-lg focus:outline-none"
            // disabled={!currentChat}
          />
          {/* <IoIosAttach className="text-gray-500 h-6 w-6 cursor-pointer" /> */}
          <button
            type="submit"
            // disabled={!currentChat || !message.trim()}
            className="px-4 py-2 rounded bg-gradient-to-t from-[#468ddf] to-[#1969c3] text-white font-medium flex items-center gap-2 disabled:opacity-50"
          >
            Send
            <IoIosSend />
          </button>
        </form>
      </div>
    </div>
  );
};
