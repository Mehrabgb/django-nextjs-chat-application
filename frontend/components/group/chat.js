'use client'

import Image from "next/image";
import Link from "next/link";
import { useState,useRef,useEffect } from "react";
import { formatDistanceToNow } from 'date-fns';
import JoinLeaveAction from "@/actions/join-live-action";


export default function GroupChat({messages,token}) {
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
  function JoinLeaveActionhandler(){
    JoinLeaveAction({conversation_id: conversation.id})
  }

  return (
    <div className="h-screen flex flex-col bg-[#eae2b7]">

      {/* Chat header */}
      <header className="h-16 bg-[#fca311ff] shadow-sm flex items-center px-4">

        {/* Back */}
        <Link
          href="/"
          className="text-2xl mr-4 text-gray-600 hover:text-gray-900"
        >
          ←
        </Link>

        {/* Group image */}
        <Link href={`/group/${conversation.id}/detail`}>
        <Image
          src={conversation ? (conversation.image).replace('http://backend:8000',''):'/samplehq1.jpeg'}
          alt="Django Developers"
          width={42}
          height={42}
          className="w-10 h-10 rounded-full object-cover"
        /></Link>
        

        {/* Group information */}
        <div className="ml-3">
          <h1 className="font-semibold text-gray-800">
            {conversation.name}
          </h1>

          <p className="text-xs text-gray-800">
            {conversation.members.length} members
          </p>
        </div>
        {conversation.members.includes(currentUserId) && <button className="fixed right-0 rounded-lg m-5 p-2 text-red-500 hover:bg-red-200" onClick={JoinLeaveActionhandler}>Leave</button>}
      </header>


      {/* Messages */}
      <main ref={messagesEndRef} className="flex-1 overflow-y-auto p-5">

        <div className="max-w-screen mx-auto space-y-4">

          {chatMessages.map((msg) => {

            const isMe = msg.user === currentUserId;

            return (
              <div
                key={msg.id}
                className={`flex items-end gap-2 ${
                  isMe ? "justify-end" : "justify-start"
                }`}
              >

                {/* Other user's image */}
                {!isMe && (
                  <Image
                    src={msg.user_profile ? msg.user_profile.image:'/samplehq1.jpeg'}
                    alt={msg.username}
                    width={36}
                    height={36}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                )}


                <div
                  className={`max-w-[70%] ${
                    isMe ? "items-end" : "items-start"
                  } flex flex-col`}
                >

                  {/* Username */}
                  {!isMe && (
                    <span className="text-xs text-gray-500 mb-1 ml-2">
                      {msg.username}
                    </span>
                  )}

                  {/* Message */}
                  <div
                    className={`px-4 py-2 rounded-2xl ${
                      isMe
                        ? "bg-[#bc6c25]  text-white rounded-br-none"
                        : "bg-[#f9c74f] text-black border border-[#e36414] rounded-bl-none"
                    }`}
                  >
                    {msg.message_content}
                  </div>

                  {/* Time */}
                  <span className="text-xs text-gray-400 mt-1 px-2">
                    {formatDistanceToNow(new Date(msg.date),{ addSuffix: true })}
                  </span>

                </div>

              </div>
            );
          })}

        </div>

      </main>


      {/* Message input */}
      <div className="bg-[#fcbf49] border-t p-4">
        {conversation.members.includes(currentUserId)?
        <form
          onSubmit={sendMessage}
          className="max-w-4xl mx-auto flex gap-3"
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
        : messages[1]=== false ?
         <div className=" max-w-4xl mx-auto font-bold text-xl text-black text-center rounded-full  bg-[#ffdac6]">
          <Link className="block rounded-full w-full h-full p-3" href={'/login'}>Login</Link>
          </div>        :

        <div className=" max-w-4xl mx-auto font-bold text-xl text-black text-center rounded-full bg-[#babd8d]">
          <button className="rounded-full w-full h-full p-3" onClick={JoinLeaveActionhandler}>join</button>
          </div>}
      </div>

    </div>
  );
}