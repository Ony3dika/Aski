"use client";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/config.js";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/app-sidebar";
import { useRouter } from "next/navigation.js";
const DashBoardLayout = ({ children }) => {
  const router = useRouter();
  const [user] = useAuthState(auth);
  // if (!user ) {
  //   router.push("/");
  // }

  return (
    <SidebarProvider defaultOpen>
      <AppSidebar />
      <main className='w-full bg-main'>
        <section
          className={`bg-white transition-all duration-500 ease-in-out `}
        >
          {children}
        </section>
      </main>
    </SidebarProvider>
  );
};

export default DashBoardLayout;
