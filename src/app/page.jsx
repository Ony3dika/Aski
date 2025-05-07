import Image from "next/image";

export default function Home() {
  return (
    <main className='bg-primary h-screen py-10 md:py-16 xl:px-28 lg:px-10 px-5 flex  patte'>
      <div className='flex md:flex-row flex-col justify-between items-center w-full border border-border rounded-xl p-5 backdrop-blur-sm bg-transparent'>
        <section className='basis-1/2'>
          <h1 className='md:text-3xl text-xl font-black text-primary-light font-jost'>
            Welcome Back
          </h1>
          <form action='' className='font-raleway'>
            <input
              type='text'
              className='w-full my-2 py-2 px-4 rounded bg-alt/70 outline-none text-copy-light border-border border-[1px]'
              placeholder='Username'
            />

            <input
              type='email'
              className='w-full my-2 py-2 px-4 rounded bg-alt/70 outline-none text-copy-light border-border border-[1px]'
              placeholder='Email Address'
            />

            <button className='w-full mt-2 py-3 px-4 rounded bg-cta text-copy-light font-black text-lg'>
              Send
            </button>
          </form>
        </section>

        <section className='basis-[45%] flex items-center justify-center bg-red-200 h-full w-full  mt-5 md:mt-0  bg-pattern rounded-md'>
          {/* <Image
          src='/contact.png'
          priority={true}
          alt='hero'
          height={100}
          width={500}
        /> */}
        </section>
      </div>
    </main>
  );
}
