'use client'

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { formatDistanceToNow } from "date-fns";

export default function PrivateChat({messages,token}) {
  const messagesEndRef = useRef(null);
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState(messages[0][0]);

  const socketRef = useRef(null);

  const conversation = messages[0][1];
  const currentUserId = messages[0][2];

  useEffect(() => {
    let isActive = true;

    const socket = new WebSocket(
      `ws://localhost:8000/ws/conversations/${conversation.id}/?token=${token}`
    );

    socketRef.current = socket;

    socket.onopen = () => {
      if (!isActive) {
        socket.close();
        return;
      }

      console.log("WebSocket connected");
    };

    socket.onmessage = (event) => {
      if (!isActive) return;

      const data = JSON.parse(event.data);

      console.log("Received:", data);

      setChatMessages((prev) => {
        // Prevent duplicate messages
        if (prev.some((msg) => msg.id === data.id)) {
          return prev;
        }

        return [...prev, data];
      });
    };

    socket.onerror = (error) => {
      if (isActive) {
        console.log("WebSocket error:", error);
      }
    };

    socket.onclose = (event) => {
      if (isActive) {
        console.log(
          "WebSocket disconnected",
          event.code,
          event.reason
        );
      }
    };

    return () => {
      isActive = false;
      socket.close();
    };
  }, [conversation.id, token]);


  useEffect(() => {
    const container = messagesEndRef.current;

    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [chatMessages]);

  
  function sendMessage(e) {
    e.preventDefault();

    if (!message.trim()) return;

    if (!socketRef.current) {
      console.log("WebSocket is not connected");
      return;
    }

    if (socketRef.current.readyState !== WebSocket.OPEN) {
      console.log("WebSocket is not open");
      return;
    }

    socketRef.current.send(
      JSON.stringify({
        message: message,
      })
    );

    setMessage("");
  }


  return (
    <div className="h-screen flex bg-[#eae2b7] flex-col ">

      {/* Chat Header */}
      <header className="h-16 bg-[#fca311ff]  shadow-sm
                         flex items-center px-4">

        {/* Back */}
        <Link
          href="/"
          className="text-2xl mr-4 text-gray-700
                     hover:text-black font-bold"
        >
          ←
        </Link>

        {/* User image */}
        <Link href={`/pv/${conversation.id}/detail`}>
        <Image
          src={conversation.profile?.profile.image ? conversation.profile.profile.image.replace('http://backend:8000',''):'/samplehq1.jpeg'}
          alt="Ali"
          width={42}
          height={42}
          className="w-10 h-10 rounded-full object-cover"
        /></Link>

        {/* User information */}
        <div className="ml-3">
          <h1 className="font-semibold text-black">
            {conversation.profile?.username}
          </h1>
        </div>

      </header>


      {/* Messages */}
      <main ref={messagesEndRef} className="flex-1 overflow-y-auto p-5">

        <div  className="max-w-screen mx-auto space-y-3">

          {chatMessages.map((msg) => {

            const isMe = msg.user ===currentUserId;

            return (
              <div
                key={msg.id}
                className={`flex ${
                  isMe ? "justify-end" : "justify-start"
                }`}
              >

                <div
                  className={`max-w-[70%] flex flex-col ${
                    isMe ? "items-end" : "items-start"
                  }`}
                >

                  {/* Message bubble */}
                  <div
                    className={`px-4 py-2 rounded-2xl ${
                      isMe
                        ? "bg-[#bc6c25] text-white font-medium rounded-br-none"
                        : "bg-[#f9c74f] text-black font-medium border border-[#e36414] rounded-bl-none"
                    }`}
                  >
                    {msg.message_content}
                  </div>

                  {/* Time */}
                  <span className="text-xs text-gray-500 mt-1 px-2">
                    {formatDistanceToNow(new Date(msg.date),{ addSuffix: true })}
                  </span>

                </div>

              </div>
            );
          })}

        </div>

      </main>


      {/* Message Input */}
      <div className="bg-[#fcbf49] border-t border-gray-400 p-4">

        <form
          onSubmit={sendMessage}
          className="max-w-4xl mx-auto  flex gap-3"
        >

          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 text-black px-4 py-3 border border-[#e36414] rounded-full
                       outline-none focus:ring-2
                       focus:ring-blue-400"
          />

          <button
            type="submit"
            className="w-12 h-12 rounded-full
                       bg-[#780116] text-white
                       hover:bg-[#ff7f51] transition"
          >
            ➤
          </button>

        </form>

      </div>

    </div>
  );
}