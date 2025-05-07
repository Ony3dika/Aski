"use client";

import React, { useState } from "react";
import { GoogleGenAI } from "@google/genai";
import Markdown from "react-markdown";
import Image from "next/image";
import { useStore } from "../store";
import menu from "../../../public/menu.svg";
import { IoSend, IoAdd, IoStop } from "react-icons/io5";

const LayoutPage = () => {
  const fullScreen = useStore((state) => state.menu);
  const setFullScreen = useStore((state) => state.updateMenu);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [response, setResponse] = useState("");

  const ai = new GoogleGenAI({
    apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
  });

  const generateResponse = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Add user message
    const userMessage = { role: "user", text: content };
    setMessages((prev) => [...prev, userMessage]);

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: content,
    });

    const aiMessage = { role: "ai", text: response.text };
    setMessages((prev) => [...prev, aiMessage]);

    // Clear input
    setContent("");
    console.log(response.text);
    setResponse(response.text);
    setIsLoading(false);
  };
  return (
    <main className={`h-screen  flex flex-col justify-between relative ${fullScreen ? "px-40" : "px-0"}`}>
      {" "}
      <Image
        onClick={() => setFullScreen(!fullScreen)}
        src={menu}
        alt='Logo'
        className={`rounded-lg ${
          fullScreen ? "w-8 md:block hidden" : "hidden"
        }`}
      />
      {/* Chat Display */}
      <section className='h-full overflow-y-scroll'>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message p-3 my-3  ${
              msg.role === "user"
                ? " place-self-end rounded-br-none rounded-2xl  bg-alt/30 border border-border"
                : "text-left"
            }`}
          >
            <Markdown>{msg.text}</Markdown>
          </div>
        ))}
      </section>

      {/* chatbox */}
      <section className='flex items-center justify-center sticky z-20 w-full bottom-0'>
        <form
          onSubmit={(e) => generateResponse(e)}
          className='w-full flex items-center justify-center'
        >
          <div
            className={`h-36 border bg-alt/70 backdrop-blur-md border-border outline-none focus:border-good transition-all duration-200 ease-snappy rounded-3xl p-5 flex flex-col ${
              fullScreen ? "w-2/3" : "w-full"
            }`}
          >
            <textarea
              placeholder='Aski something here... 😊'
              value={content}
              className='w-full border-none outline-none resize-none h-full bg-transparent'
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  generateResponse(e);
                }
              }}
            ></textarea>
            <div className='flex justify-between'>
              {/* Add */}
              <button className='p-3 rounded-full bg-primary/30 hover:bg-cta/50 scale-90 hover:scale-105 transition-all duration-300 ease-snappy border border-border cursor-pointer'>
                {" "}
                <IoAdd />
              </button>
              {/* Send */}
              <button
                className={`p-3 rounded-full bg-primary/30 hover:bg-cta/50 scale-90 hover:scale-105 transition-all duration-300 ease-snappy border border-border cursor-pointer ${
                  isLoading ? "animate-pulse" : ""
                }`}
                onClick={(e) => generateResponse(e)}
                disabled={isLoading}
              >
                {" "}
                {isLoading ? <IoStop /> : <IoSend />}
              </button>
            </div>
          </div>
        </form>
      </section>
    </main>
  );
};

export default LayoutPage;
