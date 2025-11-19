import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import { signOut } from "firebase/auth";
import { useStore } from "../app/store";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../app/firebase/config.js";
import aski from "../../public/aski.png";
import pro from "../../public/pro.jpg";
import Image from "next/image";
import { LogOut, MessagesSquareIcon } from "lucide-react";
import { redirect } from "next/navigation";
const AppSidebar = () => {
  const [user] = useAuthState(auth);
  const userData = useStore((state) => state.user);

  return (
    <Sidebar className={"menu "} collapsible='icon'>
      <SidebarHeader className={"py-10"}>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className={"py-5"}>
              {" "}
              <Image src={aski} alt='aski' height={40} width={40} />
              <span className="text-3xl font-semibold italic pr-3">Aski</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>User Info</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {userData && (
                <SidebarMenuItem>
                  <SidebarMenuButton className={"py-5"}>
                    {userData.photoURL ? (
                      <Image
                        alt='user-profile'
                        src={userData.photoURL}
                        height={40}
                        width={40}
                        className=' rounded-full border border-white/30'
                      />
                    ) : (
                      <Image
                        alt='user-profile'
                        src={pro}
                        height={40}
                        width={40}
                        className=' rounded-full overflow-clip border border-white/30'
                      />
                    )}
                    {userData.displayName
                      ? userData.displayName
                      : userData.email
                      ? userData.email
                      : "Guest"}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Chat */}
        {/* <SidebarGroup>
          <SidebarGroupLabel>Tickets</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <MessagesSquareIcon />
                  New Chat
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup> */}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem className={"text-red-500"}>
            <SidebarMenuButton
              onClick={() => {
                signOut(auth);
                redirect("/");
              }}
            >
              <LogOut />
              Logout
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
