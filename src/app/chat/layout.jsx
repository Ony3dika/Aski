"use client";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/config.js";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/app-sidebar";
import { redirect } from "next/navigation.js";
const DashBoardLayout = ({ children }) => {
  const [user] = useAuthState(auth);
  // if (!user) {
  //   redirect("/");
  // }

  return (
    <SidebarProvider defaultOpen>
      <AppSidebar />
      <main className='w-full h-screen bg-sidebar bg-main'>
        <section
          className={`bg-white lg:my-10 lg:mr-5 transition-all duration-500 ease-in-out md:rounded-lg `}
        >
          {children}
        </section>
      </main>
    </SidebarProvider>
  );
};

export default DashBoardLayout;
