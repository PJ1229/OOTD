import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex justify-between p-4 bg-gray-800 text-white">
      <Link href="/" className="text-xl">Home</Link>
      <div>
        <Link href="/login" className="mx-4">Login</Link>
        <Link href="/signup" className="mx-4">Sign Up</Link>
      </div>
    </nav>
  );
}