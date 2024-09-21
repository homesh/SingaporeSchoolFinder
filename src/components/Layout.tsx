
import React, { ReactNode } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { data: session, status } = useSession();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-600 text-white p-4">
        <nav className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            International School Finder
          </Link>
          <div>
            {status === 'authenticated' ? (
              <>
                <Link href="/profile" className="mr-4 hover:underline">Profile</Link>
                <span className="mr-4">Welcome, {session.user?.name}</span>
                <button onClick={() => signOut()} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded">
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button onClick={() => signIn()} className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded mr-2">
                  Sign In
                </button>
                <Link href="/auth/signup" className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>
      <main className="flex-grow container mx-auto p-4">
        {children}
      </main>
      <footer className="bg-gray-200 p-4 text-center">
        <p>&copy; 2023 International School Finder. All rights reserved.</p>
      </footer>
    </div>
  );
}
  const { data: session, status } = useSession();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-600 text-white p-4">
        <nav className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            International School Finder
          </Link>
          <div>
            {status === 'authenticated' ? (
              <>
                <span className="mr-4">Welcome, {session.user?.name}</span>
                <button onClick={() => signOut()} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded">
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button onClick={() => signIn()} className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded mr-2">
                  Sign In
                </button>
                <Link href="/auth/signup" className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>
      <main className="flex-grow container mx-auto p-4">
        {children}
      </main>
      <footer className="bg-gray-200 p-4 text-center">
        <p>&copy; 2023 International School Finder. All rights reserved.</p>
      </footer>
    </div>
  );
}
