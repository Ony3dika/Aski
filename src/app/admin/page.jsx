"use client";
import React from "react";
import { collection, getDocs, getDoc, doc, setDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../firebase/config.js";
import { toast } from "sonner";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Loader, MessagesSquare, UserCircle2Icon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogClose,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Markdown from "react-markdown";
import aski from "../../../public/aski.png";
import pro from "../../../public/pro.jpg";

import { SidebarTrigger } from "@/components/ui/sidebar.jsx";
import { Button } from "@/components/ui/button.jsx";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton.jsx";
const AdminPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [chats, setChats] = useState([]);
  const [userData, setUserData] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const [knowledgeBase, setKnowledgeBase] = useState("");
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setIsAdmin(false);
        setCheckingAdmin(false);
        return;
      }

      try {
        const adminRef = doc(db, "admins", user.email);
        const adminSnap = await getDoc(adminRef);
        setIsAdmin(adminSnap.exists());
      } catch (e) {
        console.error("Error checking admin status:", e);
        setIsAdmin(false);
      } finally {
        setCheckingAdmin(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!checkingAdmin) {
      console.log("Is Admin:", isAdmin);

      if (isAdmin) {
        toast.success("Welcome, Admin!");
        const fetchChats = async () => {
          const data = await getAllChats();
          setChats(data);
        };
        fetchChats();
        getSystemInstruction();
      } else {
        toast.error("Access Denied: Admins Only");
        redirect("/");
      }
    }
  }, [checkingAdmin, isAdmin]);

  // Get Chats
  const getAllChats = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "chats"));
      const allChats = [];
      querySnapshot.forEach((doc) => {
        allChats.push({ id: doc.id, ...doc.data() });
      });
      console.log("All chats:", allChats);
      return allChats;
    } catch (e) {
      console.error("Error fetching all chats:", e);
      return [];
    }
  };

  const messageLength = chats.reduce(
    (total, chat) => total + (chat.messages ? chat.messages.length : 0),
    0
  );

  // Fetch System Instruction
  const getSystemInstruction = async () => {
    setIsLoading(true);
    try {
      const docRef = doc(db, "kb", "q2yHOFPdo5U5LQ99crJB");
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data();
        console.log("System Instruction fetched:", data);
        // toast.success("System Instruction Fetched");
        setKnowledgeBase(data.knowledge);
      } else {
        console.log("No System Instruction found");
        return;
      }
    } catch (e) {
      console.error("Error fetching System Instruction:", e);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Save Knowledge Base
  const saveKnowledgeBase = async () => {
    setIsSaving(true);
    try {
      const docRef = doc(db, "kb", "q2yHOFPdo5U5LQ99crJB");
      await setDoc(docRef, {
        knowledge: knowledgeBase,
      });
      console.log("Knowledge Base saved successfully!");
      toast.success("Knowledge Base saved successfully!");
    } catch (error) {
      toast.error("Error saving knowledge base!");
      console.error("Error saving knowledge base:", error);
    } finally {
      setIsSaving(false);
    }
  };
  return (
    <main className={`lg:h-[90vh] h-screen w-full md:px-10 p-5  relative`}>
      <div className='flex items-center'>
        {" "}
        <SidebarTrigger />
        <p className='md:text-2xl text-xl font-semibold ml-3'>Dashboard</p>
      </div>

      {isLoading || checkingAdmin ? (
        <div className='flex md:flex-row flex-col gap-4 my-5'>
          {[1, 2, 3].map((i) => (
            <Skeleton className={"h-24 basis-1/4"} key={i} />
          ))}
        </div>
      ) : (
        <div className='flex md:flex-row flex-col gap-4 my-5'>
          <Card className={"basis-1/4"}>
            <CardContent className={"flex items-center"}>
              <div className='h-12 w-12 bg-cta/20 text-indigo-800 rounded-full p-3 flex items-center justify-center'>
                <UserCircle2Icon strokeWidth={1.2} />
              </div>
              <div className='ml-4'>
                <p className='font-bold text-muted-foreground'>Total Users</p>
                <p className='font-semibold text-2xl'>
                  {chats && chats.length}{" "}
                  <span className='text-sm text-muted-foreground'>users</span>
                </p>
              </div>
            </CardContent>
          </Card>
          {/* Messages */}
          <Card className={"basis-1/4"}>
            <CardContent className={"flex items-center"}>
              <div className='h-12 w-12 bg-green-200 text-green-700 rounded-full p-3 flex items-center justify-center'>
                <MessagesSquare strokeWidth={1.2} />
              </div>
              <div className='ml-4'>
                <p className='font-bold text-muted-foreground'>
                  Total Messages
                </p>
                <p className='font-semibold text-2xl'>
                  {chats && messageLength}{" "}
                  <span className='text-sm text-muted-foreground'>
                    messages
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Knowledge Base */}
          <Card className={"basis-1/4"}>
            <CardContent className={"flex items-center"}>
              <div className='h-12 w-12 bg-green-200 text-green-700 rounded-full p-3 flex items-center justify-center'>
                <Brain strokeWidth={1.2} />
              </div>
              <div className='ml-4'>
                <p className='font-bold text-muted-foreground'>
                  Knowledge Base
                </p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>Edit Knowledge Base</Button>
                  </DialogTrigger>
                  <DialogContent className='flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-lg [&>button:last-child]:top-3.5'>
                    <DialogHeader className='contents space-y-0 text-left'>
                      <DialogTitle className='border-b px-6 py-4 text-base'>
                        Edit Knowledge Base
                      </DialogTitle>
                    </DialogHeader>
                    <DialogDescription className='sr-only'>
                      Make changes to your profile here. You can change your
                      photo and set a username.
                    </DialogDescription>
                    <div className='overflow-y-auto'>
                      <div className='px-6 pt-4 pb-6'>
                        <Textarea
                          placeholder='Knowledge Base'
                          className={
                            "h-44 [scrollbar-color:--alpha(var(--primary)/50%)_transparent] [scrollbar-width:thin]"
                          }
                          value={knowledgeBase}
                          onChange={(e) => setKnowledgeBase(e.target.value)}
                        />
                      </div>
                    </div>
                    <DialogFooter className='border-t px-6 py-4'>
                      <DialogClose asChild>
                        <Button type='button' variant='outline'>
                          Cancel
                        </Button>
                      </DialogClose>

                      <Button
                        onClick={saveKnowledgeBase}
                        disabled={isSaving}
                        type='sumbit'
                      >
                        {isSaving ? (
                          <Loader className='animate-spin' />
                        ) : (
                          "Save changes"
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Table */}
      <Table>
        <TableCaption>Users Table</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>UID</TableHead>
            <TableHead>Email</TableHead>

            <TableHead className='text-right'>Chats</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading || checkingAdmin
            ? [1, 2, 3, 4, 5, 6].map((i) => (
                <TableRow key={i}>
                  <TableCell>
                    {" "}
                    <Skeleton className='h-8 w-full animate-pulse' />
                  </TableCell>

                  <TableCell>
                    {" "}
                    <Skeleton className='h-8 w-full  animate-pulse' />
                  </TableCell>
                  <TableCell>
                    {" "}
                    <Skeleton className='h-8 w-full animate-pulse' />
                  </TableCell>
                </TableRow>
              ))
            : chats &&
              chats.map((chat) => (
                <TableRow
                  key={chat.uid}
                  className={"cursor-pointer"}
                  onClick={() => setUserData(chat)}
                >
                  <TableCell className='font-medium py-3'>{chat.uid}</TableCell>
                  <TableCell>{chat.id}</TableCell>

                  <TableCell className='text-right'>
                    {chat.messages.length}
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant={"outline"}>View</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle className={"capitalie"}>
                            {userData.id} messages
                          </DialogTitle>
                          <DialogDescription>Chat Messages</DialogDescription>
                        </DialogHeader>

                        <div className='my-5 h-72 overflow-y-scroll [scrollbar-color:--alpha(var(--primary)/0%)_transparent] [scrollbar-width:thin]'>
                          {userData?.messages?.map((msg, index) => (
                            <div
                              key={index}
                              className={`message md:p-3 px-3 py-2 my-3 flex  ${
                                msg.role === "user"
                                  ? " place-self-end rounded-2xl text-white bg-[#242424] w-fit"
                                  : "text-left rounded-2xl bg-[#f5f5f5] text-primary w-fit md:w-full max-w-fit"
                              }`}
                            >
                              {msg.role == "user" ? (
                                <Image
                                  alt='user-profile'
                                  width={200}
                                  height={200}
                                  src={pro}
                                  className='h-4 md:h-7 w-4 md:w-7 rounded-full border border-white/30 order-2 ml-2'
                                />
                              ) : (
                                <Image
                                  className='h-4 md:h-7 w-4 md:w-7  rounded-full border border-white/30 order-1 mr-2'
                                  src={aski}
                                  width={200}
                                  height={200}
                                  alt='bot'
                                />
                              )}
                              <div
                                className={`${
                                  msg.role === "user" ? "order-1" : "order-2"
                                }`}
                              >
                                <Markdown>{msg.text}</Markdown>
                              </div>
                            </div>
                          ))}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </main>
  );
};

export default AdminPage;
