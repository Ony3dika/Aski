"use client";

import React, { useState, useRef, useEffect } from "react";
import { GoogleGenAI } from "@google/genai";
import Markdown from "react-markdown";
import Image from "next/image";
import { useStore } from "../store";
import loading from "../../../public/load.png";
import aski from "../../../public/aski.png";
import pro from "../../../public/pro.jpg";
import { db } from "../firebase/config.js";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { IoSend, IoAdd, IoStop } from "react-icons/io5";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { toast } from "sonner";
import { MessageSquareText, MicIcon, MicOffIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

const LayoutPage = () => {
  const user = useStore((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [response, setResponse] = useState("");
  const bottomRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const [base64Audio, setBase64Audio] = useState(null);
  const [audio, setAudio] = useState("");
  const ai = new GoogleGenAI({
    apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
  });

  // Record Audio
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    audioChunksRef.current = [];

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunksRef.current.push(event.data);
      }
    };

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, {
        type: "audio/mp3",
      });
      const arrayBuffer = await audioBlob.arrayBuffer();
      const base64Audio = Buffer.from(arrayBuffer).toString("base64");
      setBase64Audio(base64Audio);
      setAudio(URL.createObjectURL(audioBlob));
      console.log(audioBlob, base64Audio);
    };

    mediaRecorder.start();
    setRecording(true);
  };

  // Stop Recording
  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
    setContent("Audio Recorded, Click Send to process");
  };

  const generateResponse = async (e) => {
    e.preventDefault();
    if (!content) return;
    setIsLoading(true);

    try {
      // Add user message
      const userMessage = { role: "user", text: content };
      setMessages((prev) => [...prev, userMessage]);
      const contents = [
        { text: content },
        {
          inlineData: {
            mimeType: "audio/mp3",
            data: base64Audio,
          },
        },
      ];
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: base64Audio ? contents : content,
        config: {
          systemInstruction: `You are Aski, a friendly and professional AI customer support assistant. 
          
          Your role is to help customers with questions related to:
            Our products (features, availability, pricing, etc.)

            Orders (status, tracking, modifications, cancellations)

            Delivery (shipping options, delays, expected dates)

            Returns & refunds (process, eligibility, status)

            Technical support (login issues, account setup, troubleshooting).

            If a question falls outside of customer support, politely respond with:
            "I'm here to assist with product, order, delivery, returns, or technical support questions. For other inquiries, I may not be the best resource."

          Always:

            Be concise, clear, and friendly.

            Provide step-by-step guidance when needed.

            If you don't know the answer, suggest contacting a human support agent by prompting the email address - support@aski.com.`,
        },
      });

      const aiMessage = { role: "ai", text: response.text };
      setMessages((prev) => [...prev, aiMessage]);
      // Clear input
      setContent("");
      console.log(response.text);
      setResponse(response.text);
    } catch (error) {
      let parsedError = JSON.parse(JSON.stringify(error));
      toast.error(parsedError.name);
      console.log(parsedError);
    } finally {
      setIsLoading(false);
      setBase64Audio(null);
      addDataToFirebase();
    }
  };

  // Save Messages
  const addDataToFirebase = async () => {
    if (!user) return;

    try {
      const docRef = doc(db, "chats", user.email);

      await setDoc(docRef, {
        uid: user.uid,
        messages: messages,
      });

      console.log("Messages saved for user:", user.uid);
    } catch (e) {
      console.error("Error saving messages:", e);
    }
  };

  //Fetch Messages
  const getMessagesFromFirebase = async (user) => {
    if (!user) return null;

    try {
      setIsLoading(true);
      const docRef = doc(db, "chats", user.email);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log("Messages fetched:", data);
        toast.success("Messages Fetched");
        setMessages(data.messages);
      } else {
        console.log("No messages found for user:", user.email);
        return [];
      }
    } catch (e) {
      console.error("Error fetching messages:", e);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getMessagesFromFirebase(user);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <main
      className={`lg:h-[90vh] h-screen w-full md:px-10 px-5 flex flex-col justify-between relative noise`}
    >
      <div className='flex items-center justify-between'>
        <SidebarTrigger />
        <div className='flex items-center basis-2/3 justify-center mt-5'>
          <Image src={aski} alt='aski' className='h-8 w-8' />
          <p className='text-xl font-semibold ml-3'>Aski</p>{" "}
        </div>
        <div className='flex items-center'>
          <p>{messages.length}</p>
          <MessageSquareText className='ml-1 size-5' strokeWidth={1} />
        </div>
      </div>

      {/* Chat Display */}
      <section
        className={`h-full overflow-y-scroll [scrollbar-color:--alpha(var(--primary)/0%)_transparent] [scrollbar-width:thin]`}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message md:p-3 px-3 py-2 my-3 flex  ${
              msg.role === "user"
                ? " place-self-end rounded-2xl text-white bg-[#242424] w-fit"
                : "text-left borde rounded-2xl bg-[#f5f5f5] text-primary w-fit md:max-w-2/3 max-w-fit"
            }`}
          >
            {msg.role == "user" ? (
              user.photoURL ? (
                <Image
                  alt='user-profile'
                  width={200}
                  height={200}
                  src={user.photoURL}
                  className='h-4 md:h-7 w-4 md:w-7  rounded-full border border-white/30 order-2 ml-2'
                />
              ) : (
                <Image
                  alt='user-profile'
                  width={200}
                  height={200}
                  src={pro}
                  className='h-4 md:h-7 w-4 md:w-7 rounded-full border border-white/30 order-2 ml-2'
                />
              )
            ) : (
              <Image
                className='h-4 md:h-7 w-4 md:w-7  rounded-full border border-white/30 order-1 mr-2'
                src={aski}
                width={200}
                height={200}
                alt='bot'
              />
            )}
            <div className={`${msg.role === "user" ? "order-1" : "order-2"}`}>
              <Markdown>{msg.text}</Markdown>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className='flex p-4 '>
            <div className='relative flex items-center justify-center animate-pulse'>
              {/* Rotating circle */}
              <div className='absolute h-10 w-10 border border-blue-500 border-t-transparent rounded-full animate-spin'></div>

              {/* Image inside */}
              <Image
                src={loading}
                alt='Loading'
                className='md:h-6 h-5 md:w-6 w-5 z-10'
              />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </section>
      {/* chatbox */}
      <section className='flex items-center justify-center sticky z-20 bottom-0 pb-3'>
        <form
          onSubmit={(e) => generateResponse(e)}
          className='w-full flex items-center justify-center'
        >
          <div
            className={`md:h-36 h-28 bg-[#242424] text-white backdrop-blur-md transition-all duration-200 ease-snappy rounded-3xl p-5 flex flex-col md:w-2/3 w-full`}
          >
            <textarea
              placeholder='Ask a question...'
              value={content}
              required
              className=' placeholder:text-white/60 border-none outline-none resize-none h-full bg-transparent'
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
                className='p-3 rounded-full bg-primary/30 hover:bg-primary scale-90 hover:scale-105 transition-all duration-300 ease-snappy border border-gray-600 cursor-pointer'
                type='button'
              >
                {" "}
                <IoAdd />
              </button>
              {/* Send */}
              <div className='flex items-center gap-3'>
                {recording ? (
                  <Button
                    onClick={stopRecording}
                    type='button'
                    className={"rounded-full animate-pulse text-red-500"}
                  >
                    <MicOffIcon />
                  </Button>
                ) : (
                  <Tooltip>
                    <TooltipTrigger type='button'>
                      <Button
                        onClick={startRecording}
                        type='button'
                        className={"rounded-full"}
                      >
                        <MicIcon />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Start Recording</p>
                    </TooltipContent>
                  </Tooltip>
                )}

                <Tooltip>
                  <TooltipTrigger>
                    {" "}
                    <button
                      className={`p-3 rounded-full bg-primary/30 hover:bg-primary scale-90 hover:scale-105 transition-all duration-300 ease-snappy border border-gray-600 cursor-pointer ${
                        isLoading ? "animate-pulse" : ""
                      }`}
                      onClick={(e) => generateResponse(e)}
                      disabled={isLoading}
                      type='submit'
                    >
                      {" "}
                      {isLoading ? <IoStop /> : <IoSend />}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isLoading ? "Generating..." : "Send Message"}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
        </form>
      </section>
    </main>
  );
};

export default LayoutPage;
