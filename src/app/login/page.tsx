import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Image
          src="/ootd.svg"
          alt="OOTD"
          width={200}
          height={100}
          />

        <form className="flex flex-col gap-4 items-center sm:items-start">
          <div className="flex flex-col gap-2">
            <label htmlFor="username" className="text-sm">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              className="p-2 border border-gray-300 rounded-md w-72 sm:w-80"
              placeholder="Enter your username"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="p-2 border border-gray-300 rounded-md w-72 sm:w-80"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="bg-black text-white rounded-full h-10 w-72 sm:w-80 mt-4 hover:bg-gray-800 transition-colors"
          >
            Login
          </button>
        </form>

      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        Don't have an account? <a href="/signup" className="text-blue-500">Sign up</a>
      </footer>
      <footer className="row-start-4 flex gap-6 flex-wrap items-center justify-center">
          Bypass login here: <a href="/swipe" className="text-blue-500">Swipe Page!</a>
      </footer>
    </div>
  );
}
