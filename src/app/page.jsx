import Image from "next/image";
import bg from "../../public/bg.svg"
import Link from "next/link";

export default function Home() {
  return (
    <main className='bg-white h-screen flex md:flex-row flex-col px-0'>
      <section className='basis-[40%] bg-primary text-white  h-full w-full mt-0 px-5 md:px-10 py-10 md:py-20'>
        <p className='text-xl font-semibold font-jost'>Aski</p>

        <p className={"text-3xl my-5 font-semibold  font-jost "}>
          Sign in to continue your journey with Aski
        </p>

        <Link
          href='/dashboard'
          className='bg-cta px-5 md:px-10 py-2.5 rounded my-5 font-semibold font-jost '
        >
          Get Started
        </Link>

        <Image src={bg} alt='backgound' className='rounded my-10' />
      </section>

      <section className='basis-full md:px-52 px-5 flex flex-col justify-center'>
        <h1 className='md:text-3xl text-xl font-bold text-primary-light font-raleway'>
          Welcome Back
        </h1>
        <p className='my-4 text-xl'>Sign In to Aski</p>
        <form action='' className='font-raleway'>
          <input
            type='text'
            className='w-2/3 my-2 py-2 md:py-4 px-4 rounded-xl outline-none text-copy-light transition-all duration-200 ease-in-out focus:border-cta/30 border-border border-[1px]'
            placeholder='Username'
          />

          <input
            type='email'
            className='w-2/3 my-2 py-2 md:py-4 px-4 rounded-xl outline-none text-copy-light transition-all duration-200 ease-in-out focus:border-cta/30 border-border border-[1px]'
            placeholder='Email Address'
          />

          <button className='w-2/3 mt-2 py-3 md:py-4 transition-all cursor-pointer duration-200 ease-in-out px-4 rounded-full bg-alt text-white text-copy-light font-semibold text-lg font-jost'>
            Sign In
          </button>
        </form>

        <p className="w-2/3 text-center text-black/50 mt-3">Don&apos;t have an account? <Link href='/register' className='text-alt underline'>Sign Up</Link></p>
      </section>
    </main>
  );
}
