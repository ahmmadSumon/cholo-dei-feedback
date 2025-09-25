'use client'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import React, { use } from 'react'
import {User} from 'next-auth'
import { Button } from './ui/button'
const Navbar = () => {
   const {data : session} = useSession()
   const user : User = session?.user
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        {/* Logo / Brand */}
        <Link href="/" className="text-xl font-bold text-blue-600 hover:text-blue-800 transition">
          Mystry msg
        </Link>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {session ? (
            <>
              <span className="text-gray-700 font-medium">
                Welcome, {user?.username || user?.email}
              </span>
              <Button
                onClick={() => signOut()}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                Log out
              </Button>
            </>
          ) : (
            <Link href="/sign-in">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                Log In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar