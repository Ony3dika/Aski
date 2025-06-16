"use client";

import React, { useState, useRef, useEffect } from "react";
import { GoogleGenAI } from "@google/genai";
import Markdown from "react-markdown";
import Image from "next/image";
import { useStore } from "../store";
import menu from "../../../public/menu.svg";
import loading from "../../../public/loading.svg";
import aski from "../../../public/aski-bl.svg";
import { IoSend, IoAdd, IoStop } from "react-icons/io5";

const LayoutPage = () => {
  const mobile = useStore((state) => state.mobile);
  const user = useStore((state) => state.user);
  const setMobile = useStore((state) => state.updateMobile);
  const fullScreen = useStore((state) => state.menu);
  const setFullScreen = useStore((state) => state.updateMenu);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [response, setResponse] = useState("");
  const bottomRef = useRef(null);
  const ai = new GoogleGenAI({
    apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
  });

  const generateResponse = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Add user message
      const userMessage = { role: "user", text: content };
      setMessages((prev) => [...prev, userMessage]);

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: content,
        config: {
          systemInstruction:
            "You are Aski, a helpful AI customer support. Only answer questions related to our products, services, orders, delivery, returns, or technical support. If the question is unrelated to customer support, politely say you cannot help with that.",
        },
      });

      const aiMessage = { role: "ai", text: response.text };
      setMessages((prev) => [...prev, aiMessage]);

      // Clear input
      setContent("");
      console.log(response.text);
      setResponse(response.text);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <main
      className={`h-screen md:px-10 px-5 flex flex-col justify-between relative noise ${
        fullScreen ? "px-40" : "px-0"
      }`}
    >
      <Image
        onClick={() => setMobile(!mobile)}
        src={menu}
        alt='Logo'
        className='md:hidden block h-8 w-8 absolute left-5 top-5 bg-primary rounded-lg'
      />
      <div className='flex items-center justify-center mt-5'>
        <Image src={aski} className='h-8 w-8' />
        <p className='text-xl font-semibold ml-3'>Aski</p>{" "}
      </div>
      <Image
        onClick={() => setFullScreen(!fullScreen)}
        src={menu}
        alt='Logo'
        className={`rounded-lg bg-primary ${
          fullScreen ? "w-8 md:block hidden" : "hidden"
        }`}
      />
      {/* Chat Display */}
      <section
        className={`${fullScreen ? "md:px-32" : ""} h-full overflow-y-scroll `}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message p-3 my-3 ${
              msg.role === "user"
                ? " place-self-end rounded-br-none rounded-2xl text-white bg-primary w-fit"
                : "text-left border border-border rounded-tl-none rounded-2xl bg-white text-primary min-w-64 md:max-w-2/3 max-w-fit"
            }`}
          >
            <Markdown>{msg.text}</Markdown>
          </div>
        ))}

        {isLoading && (
          <Image src={loading} alt='Loading' className='mt-4 h-12 w-12' />
        )}
        <div ref={bottomRef} />
      </section>
      {/* chatbox */}
      <section className='flex items-center justify-center sticky z-20 w-full bottom-0 pb-3'>
        <form
          onSubmit={(e) => generateResponse(e)}
          className='w-full flex items-center justify-center'
        >
          <div
            className={`h-36 bg-alt text-white backdrop-blur-md outline-none focus:border-good transition-all duration-200 ease-snappy rounded-3xl p-5 flex flex-col ${
              fullScreen ? "w-2/3" : "w-full"
            }`}
          >
            <textarea
              placeholder='Aski something here...😊'
              value={content}
              className='w-full placeholder:text-white/60 border-none outline-none resize-none h-full bg-transparent'
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  generateResponse(e);
                }
              }}
            ></textarea>
            <div className='flex justify-between'>
              {/* Add */}
              <button
                disabled={isLoading}
                className='p-3 rounded-full bg-primary/30 hover:bg-cta/50 scale-90 hover:scale-105 transition-all duration-300 ease-snappy border border-gray-600 cursor-pointer'
              >
                {" "}
                <IoAdd />
              </button>
              {/* Send */}
              <button
                className={`p-3 rounded-full bg-primary/30 hover:bg-cta/50 scale-90 hover:scale-105 transition-all duration-300 ease-snappy border border-gray-600 cursor-pointer ${
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
