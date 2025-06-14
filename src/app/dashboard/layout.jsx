"use client";
import Image from "next/image";
import { useStore } from "../store";
import menu from "../../../public/menu.svg";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config.js";
import { useRouter } from "next/navigation";
import { IoLogOutOutline } from "react-icons/io5";
import { PiUserCircleThin } from "react-icons/pi";

const DashBoardLayout = ({ children }) => {
  const router = useRouter();
  const mobile = useStore((state) => state.mobile);
  const setMobile = useStore((state) => state.updateMobile);
  const fullScreen = useStore((state) => state.menu);
  const setFullScreen = useStore((state) => state.updateMenu);
  const userData = useStore((state) => state.user);

  return (
    <main className='md:flex bg-main'>
      <section
        className={`h-screen overflow-y-scroll md:overflow-auto py-8 px-8 bg-primary text-white flex-col flex  fixed z-40 top-0 transition-all duration-500 ease-in-out ${
          mobile ? "left-0 w-4/5 " : "left-[-100%]"
        } ${
          fullScreen
            ? "basis-0 left-[-100%]"
            : "xl:basis-[30%] md:basis-[50%] md:left-0 md:relative md:w-auto"
        }`}
      >
        <div className='flex items-center justify-between'>
          {" "}
          <p className='ml-3 text-3xl font-semibold'>Aski</p>
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
        </div>

        {/* User Details */}
        {userData && (
          <div className='flex items-center justify-between my-5'>
            <div className='flex items-center'>
              {userData.photoURL ? (
                <Image
                  src={userData.photoURL}
                  alt='Logo'
                  width={200}
                  height={200}
                  className='w-10 h-10 rounded-full mr-5 border border-border/30'
                />
              ) : (
                <PiUserCircleThin
                  width={200}
                  height={200}
                  className='w-8 h-8 rounded-full mr-3'
                />
              )}
              <p className='text-base font-semibold'>
                {userData.displayName ? userData.displayName : userData.email}
              </p>
            </div>
            <button
              title='Logout'
              className='cursor-pointer ease-linear transition-all duration-300 hover:text-cta'
              onClick={() => {
                signOut(auth);
                router.push("/");
              }}
            >
              <IoLogOutOutline className='h-6 w-6 mr-3' />
            </button>
          </div>
        )}
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
