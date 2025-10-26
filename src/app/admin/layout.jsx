"use client";
import AppSidebar from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import React from "react";

const AdminLayout = ({ children }) => {
  
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

export default AdminLayout;
