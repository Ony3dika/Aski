"use client";
import { useState } from "react";
import Image from "next/image";
import aski from "../../public/aski.png";
import google from "../../public/google.svg";
import Link from "next/link";
import {
  signInWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth as auth2 } from "./firebase/config";
import { useStore } from "./store";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const setUser = useStore((state) => state.updateUser);

  const auth = getAuth();
  const provider = new GoogleAuthProvider();
  const router = useRouter();

  // Google Sign In
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      toast.success("Login Successful");
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
      console.log("Google Sign-In success:", user);
      setUser(user);
    } catch (error) {
      toast.error("Google Auth Failed");
      console.error("Google Sign-In Error:", error.code, error.message);
    }
  };

  // Sign In
  const handleSignIn = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await signInWithEmailAndPassword(auth2, email, password);

      console.log(res);
      setUser(res.user);
      setEmail("");
      setPassword("");
      toast.success("Sign In Successful");
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (error) {
      toast.error("Invalid Credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className='bg-white h-screen flex  md:flex-row flex-col md:p-10 px-0'>
      <section className='md:basis-[60%] basis-full h-full md:px-20 px-5 md:py-0 py-20 flex flex-col justify-center md:items-start bg-pattern2 '>
        <div className='items-center flex flex-col md:py-0 py-10 w-full rounded'>
          <Image
            alt='aski'
            src={aski}
            className='h-10 w-10 border border-cta rounded-full'
          />
          <h1 className='md:text-3xl text-xl font-bold text-primary-light text-center w-full mt-5'>
            Welcome Back
          </h1>
          <p className='my-4 text-xl text-center w-full'>Sign In to Aski</p>
          <button
            onClick={handleGoogleSignIn}
            className='flex items-center justify-center border border-border md:w-2/3 w-5/6 my-2 py-2 md:py-4 px-4 rounded-full font-semibold cursor-pointer transition-all duration-300 ease-linear hover:bg-alt hover:text-white'
          >
            <Image src={google} className='mr-4' alt='google-icon' />
            Sign in with Google
          </button>
        </div>

        <p className='text-center w-full font-semibold'>OR</p>
        <form
          onSubmit={handleSignIn}
          className='flex flex-col items-center w-full  md:py-0 py-10 rounded'
        >
          <input
            type='email'
            required
            onChange={(e) => setEmail(e.target.value)}
            className='md:w-2/3 w-5/6 my-2 py-2 md:py-4 px-4 rounded-xl outline-none text-copy-light transition-all duration-200 ease-in-out focus:border-cta/30 border-border border-[1px]'
            placeholder='Email Address'
          />
          <div className='relative md:w-2/3 w-5/6'>
            <input
              required
              type={showPassword ? "text" : "password"}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full my-2 py-2 md:py-4 px-4 rounded-xl outline-none text-copy-light transition-all duration-200 ease-in-out focus:border-cta/30 border-border border-[1px]'
              placeholder='Password'
            />
            <button
              type='button'
              onClick={() => setShowPassword(!showPassword)}
              className='absolute right-3 top-1/2 transform -translate-y-1/2 text-primary'
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <button
            disabled={isLoading}
            className={`w-2/3 mt-4 py-3 md:py-4 transition-all cursor-pointer duration-200 ease-in-out px-4 rounded-full bg-alt text-white text-copy-light font-semibold text-lg flex items-center justify-center  ${
              isLoading ? "animate-pulse" : ""
            }`}
          >
            {isLoading ? (
              <AiOutlineLoading3Quarters className='animate-spin' />
            ) : (
              "Sign In"
            )}
          </button>
          <p className='w-2/3 text-sm text-center text-black/50 mt-3'>
            Don&apos;t have an account?{" "}
            <Link href='/signup' className='text-alt underline'>
              Sign Up
            </Link>
          </p>
        </form>
      </section>
      <section className='basis-[40%] hidden md:block bg-primary  mt-0 md:px-10 py-10 md:py-20 widget rounded-xl'>
       
      </section>
    </main>
  );
}
