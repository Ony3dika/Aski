"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useStore } from "../store";
import menu from "../../../public/menu.svg";

const DashBoardLayout = ({ children }) => {
  const [mobile, setMobile] = useState(false);
  const fullScreen = useStore((state) => state.menu);
  const setFullScreen = useStore((state) => state.updateMenu);

  return (
    <main className='md:flex bg-main'>
      <section
        className={`h-screen overflow-y-scroll md:overflow-auto py-8 px-8 bg-alt/70 flex-col flex fixed z-20 top-0 transition-all duration-500 ease-in-out border-r border-border rounded-r-lg  ${
          mobile ? "left-0 w-4/5 " : "left-[-100%]"
        } ${
          fullScreen
            ? "basis-0 left-[-100%]"
            : "xl:basis-[25%] md:basis-[50%] md:left-0 md:relative md:w-auto"
        }`}
      >
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

        <p className="mt-5 text-3xl font-semibold">Aski</p>
      </section>
      <section
        className={`h-screen overflow-y-scroll bg-primary   lg:px-10 px-5 md:py-8 py-5 transition-all duration-500 ease-in-out  ${
          fullScreen ? "w-screen" : "basis-full"
        }`}
      >
        <Image
          onClick={() => setMobile(!mobile)}
          src={menu}
          alt='Logo'
          className='md:hidden block w-8 fixed dark:bg-foreground bg-foreground rounded-lg'
        />
        {children}
      </section>
    </main>
  );
};

export default DashBoardLayout;
