import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Next.js with Firebase</h1>

      <div className="flex flex-col gap-4 w-full max-w-md">
        <Link
          href="/auth/signin"
          className="px-4 py-2 bg-blue-500 text-white text-center rounded hover:bg-blue-600"
        >
          Sign In
        </Link>

        <Link
          href="/auth/signup"
          className="px-4 py-2 bg-green-500 text-white text-center rounded hover:bg-green-600"
        >
          Sign Up
        </Link>

        <Link
          href="/dashboard"
          className="px-4 py-2 bg-purple-500 text-white text-center rounded hover:bg-purple-600"
        >
          Dashboard (Protected)
        </Link>
      </div>
    </main>
  );
}
