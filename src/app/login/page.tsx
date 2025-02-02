import { Button } from "@/components/ui/button";
import Image from "next/image";
import { signInAction } from "../actions";
import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Image src="/ootd.png" alt="OOTD" width={200} height={100} />

        <form className="flex flex-col gap-4 items-center sm:items-start">
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm">
              Email
            </label>
            <input
              type="text"
              id="username"
              name="email"
              className="p-2 border border-gray-300 rounded-md w-72 sm:w-80"
              placeholder="Enter your username"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="p-2 border border-gray-300 rounded-md w-72 sm:w-80"
              placeholder="Enter your password"
            />
          </div>

          <Button type="submit" className="w-full" formAction={signInAction}>
            Login
          </Button>
        </form>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-blue-500">
          Sign up
        </Link>
      </footer>
    </div>
  );
}
