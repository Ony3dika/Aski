"use client";
import { useState } from "react";
import Image from "next/image";
import bg from "../../../public/bg.svg";
import Link from "next/link";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config.js";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useRouter } from "next/navigation";

const SignUpPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      console.log(res);
      setEmail("");
      setPassword("");
      setSuccess("Sign up successful!");
      setTimeout(() => {
        router.push("/");
      }, 2000);
    
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        setError("This email is already registered.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        setError("");
        setSuccess("");
      }, 3000);
    }
  };

  return (
    <main className='bg-white h-screen flex md:flex-row flex-col px-0'>
      <section className='basis-[40%] hidden md:block order-2 md:order-1 bg-primary text-white  h-full w-full mt-0 px-5 md:px-10 py-10 md:py-20'>
        <p className='text-xl font-semibold font-jost'>Aski</p>

        <p className={"text-2xl my-5 font-semibold  font-jost "}>
          Sign up in seconds to start chatting with Aski and get real-time
          answers to your questions.
        </p>

        <Link
          href='/'
          className='bg-cta px-5 md:px-10 py-2.5 rounded my-5 font-semibold font-jost '
        >
          Sign In
        </Link>

        <Image src={bg} alt='backgound' className='rounded my-10 h-3/5' />
      </section>

      <section className='basis-full order-1 md:order-2  md:px-52 px-5 md:py-0 py-20 flex flex-col justify-center md:items-start items-center bg-pattern2'>
        <form
          onSubmit={handleSignUp}
          className='flex flex-col items-center w-full bg-white/90 md:py-0 py-10 rounded'
        >
          <h1 className='md:text-3xl text-xl font-bold text-primary-light font-raleway'>
            Welcome to <span className='text-cta'>Aski</span>
          </h1>
          <p className='my-4 text-xl'>Sign Up</p>

          <input
            type='email'
            onChange={(e) => setEmail(e.target.value)}
            className='md:w-2/3 w-5/6 my-2 py-2 md:py-4 px-4 rounded-xl outline-none text-copy-light transition-all duration-200 ease-in-out focus:border-cta/30 border-border border-[1px]'
            placeholder='Email Address'
          />
          <div className='relative md:w-2/3 w-5/6'>
            <input
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
          {success && (
            <p className='mt-3 md:w-2/3 w-5/6 md:py-4 py-2 rounded-xl duration-300 transition-all ease-in-out px-4 bg-green-400 text-white text-center'>
              {success}
            </p>
          )}
          {error && (
            <p className='mt-3 md:w-2/3 w-5/6 md:py-4 py-2 rounded-xl duration-300 transition-all ease-in-out px-4 bg-red-400 text-white shake text-center'>
              {error}
            </p>
          )}
          <button
            disabled={isLoading}
            className={`w-2/3 mt-4 py-3 md:py-4 transition-all cursor-pointer duration-200 ease-in-out px-4 rounded-full bg-alt text-white text-copy-light font-semibold text-lg flex items-center justify-center  ${
              isLoading ? "animate-pulse" : ""
            }`}
          >
            {isLoading ? (
              <AiOutlineLoading3Quarters className='animate-spin' />
            ) : (
              "Sign Up"
            )}
          </button>
          <p className='w-2/3 text-sm text-center text-black/50 mt-3'>
            Have an account?{" "}
            <Link href='/' className='text-alt underline'>
              Sign In
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
};

export default SignUpPage;
