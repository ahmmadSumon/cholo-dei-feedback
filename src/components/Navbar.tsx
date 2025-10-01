'use client'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import React from 'react'
import {User} from 'next-auth'
import { Button } from './ui/button'
import Image from 'next/image'


const Navbar = () => {
   const {data : session} = useSession()
   const user : User = session?.user
  return (
    <nav className="bg-transparent shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        {/* Logo / Brand */}
        <Link href="/" className="text-xl font-bold text-blue-600 hover:text-blue-800 transition">
        <Image 
        src='/logo.png' 
        alt='logo' 
        width={100} 
        height={60} 
        />

        </Link>

        {/* Right Side */}
        <div className="flex items-center text-white gap-4 ">
          {session ? (
            <>
            <div>
              <Link href= '/dashboard'>Dashboard</Link>
            </div>
              <span className="text-gray-700 font-medium  hidden md:block">
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
            <div className='flex justify-center items-center gap-5'>

          
            <Link href="/sign-up">
              <Button
            size="lg"
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-3 rounded-xl shadow-lg transition"
          >
            Sign Up
          </Button>
            </Link>
            <Link href="/sign-in">
              <Button
            size="lg"
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-3 rounded-xl shadow-lg transition"
          >
            Log In
          </Button>
            </Link>
            
              </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar