"use client";
import { useState } from "react";
import { BsEmojiSmile } from "react-icons/bs";
import { IoIosAttach, IoIosSend } from "react-icons/io";
import EmojiPicker from "emoji-picker-react";

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
          <div className="absolute bottom-5 left-3 z-50">
            <BsEmojiSmile
              className="text-gray-400 h-6 w-6 cursor-pointer"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            />
            {showEmojiPicker && (
              <div className="absolute bottom-12 left-0 z-50">
                <EmojiPicker onEmojiClick={onEmojiClick} />
              </div>
            )}
          </div>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type message..."
            className="flex-grow p-2 rounded-lg focus:outline-none h-40 border border-gray-200"
            // disabled={!currentChat}
          />
          {/* <IoIosAttach className="text-gray-500 h-6 w-6 cursor-pointer" /> */}
          <button
            type="submit"
            disabled={!message.trim()}
            className="px-4 py-2 bg-[#20b894] rounded-full text-white disabled:cursor-not-allowed hover:scale-105 transition-all duration-300 flex items-center gap-2 disabled:opacity-50 absolute right-3 bottom-5 cursor-pointer"
          >
            Send
            <IoIosSend />
          </button>
        </form>
      </div>
    </div>
  );
};
