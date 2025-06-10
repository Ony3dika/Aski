"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useStore } from "../store";
import menu from "../../../public/menu.svg";
import { signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/config.js";
import { useRouter } from "next/navigation";
import { AiOutlineLogout } from "react-icons/ai";


const DashBoardLayout = ({ children }) => {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const mobile = useStore((state) => state.mobile);
  const setMobile = useStore((state) => state.updateMobile);
  const fullScreen = useStore((state) => state.menu);
  const setFullScreen = useStore((state) => state.updateMenu);
  const userSession = sessionStorage.getItem("user");

  if (!user && !userSession) {
    router.push("/");
  }

  return (
    <main className='md:flex bg-main'>
      <section
        className={`h-screen overflow-y-scroll md:overflow-auto py-8 px-8 bg-primary text-white flex-col flex justify-between fixed z-40 top-0 transition-all duration-500 ease-in-out ${
          mobile ? "left-0 w-4/5 " : "left-[-100%]"
        } ${
          fullScreen
            ? "basis-0 left-[-100%]"
            : "xl:basis-[30%] md:basis-[50%] md:left-0 md:relative md:w-auto"
        }`}
      >
        <div className='flex items-center'>
          {" "}
          <Image
            onClick={() => setFullScreen(!fullScreen)}
            src={menu}
            alt='Logo'
            className='w-8 md:block hidden'
          />
          <Image
            onClick={() => setMobile(!mobile)}
            src={menu}
            alt='Logo'
            className='w-8 md:hidden block'
          />
          <p className='ml-3 text-3xl font-semibold'>Aski</p>
        </div>

        <button
          title='Logout'
          className='cursor-pointer bg-alt border border-border/50 scale-90 hover:scale-100 ease-in-out transition-all duration-300 rounded-full p-3 flex items-center'
          onClick={() => {
            signOut(auth);
            sessionStorage.removeItem("user");
          }}
        >
          <AiOutlineLogout className='h-8 w-8 mr-3' /> Log out
        </button>
      </section>
      <section
        className={`bg-white transition-all duration-500 ease-in-out ${
          fullScreen ? "w-screen" : "basis-full"
        }`}
      >
       
        {children}
      </section>
    </main>
  );
};

export default DashBoardLayout;
