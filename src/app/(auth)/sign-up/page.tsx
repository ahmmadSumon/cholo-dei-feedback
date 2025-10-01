'use client'
import React, { useState, useEffect } from "react"
import {  useDebounceCallback} from 'usehooks-ts'
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import * as z from 'zod'
import { useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod'
import { signUpSchema } from "@/app/schemas/signUpSchema"
import axios,{AxiosError} from "axios"

import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Loader } from 'lucide-react';
import Link from "next/link"


const SignUp = () => {
   const [username, setUsername] = useState('')
   const [usernameMessage, setUsernameMessage] = useState('')
   const [isCheckingUsername, setIsCheckingUsername] = useState(false)
   const [isSubmitting, setIsSubmitting] = useState(false)
 
    const debounced = useDebounceCallback(setUsername, 500)
    const router = useRouter()

    //zod implementation
    const form = useForm<z.infer<typeof signUpSchema>>({
      resolver: zodResolver(signUpSchema),
      defaultValues : {
        username: '',
        email: "",
        password: ''
      }
    })
    
    useEffect(() => {
        const checkUsernameUnique = async () => {
          if(username){
            setIsCheckingUsername(true)
            setUsernameMessage('')
            try {
             const response =  await axios.get(`api/check-username-uniqueness?username=${username}`)
            
           
                console.log(response.data.message)
                console.log(usernameMessage)
             setUsernameMessage(response.data.message)
             console.log(usernameMessage)
            } catch (error) {
              const  axiosError = error as AxiosError<ApiResponse>
              setUsernameMessage(axiosError.response?.data.message ?? 'Error in checking username')
            }
            finally{
              setIsCheckingUsername(false)
            }
          }
        }
        checkUsernameUnique()
    }, [username])

//     useEffect(() => {
//   if (!username.trim()) return; // skip if empty
//   const checkUsernameUnique = async () => {
//     setIsCheckingUsername(true)
//     setUsernameMessage('')
//     try {
//       const response = await axios.get(`/api/check-username-uniqueness?username=${encodeURIComponent(username)}`)
//       setUsernameMessage(response.data.message)
//     } catch (error) {
//       const axiosError = error as AxiosError<ApiResponse>
//       setUsernameMessage(axiosError.response?.data.message ?? 'Error in checking username')
//     } finally {
//       setIsCheckingUsername(false)
//     }
//   }
//   checkUsernameUnique()
// }, [username])


    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
      setIsSubmitting(true)
      try {
        await axios.post('api/sign-up', data)
        toast('Account created successfully! Please check your email to verify your account.')
        router.replace(`/verify/${username}`)
        setIsSubmitting(false)

      } catch (error) {
        console.error('Error in sign up', error)
        const  axiosError = error as AxiosError<ApiResponse>
        toast.error(axiosError.response?.data.message ?? 'Error in sign up')
        setIsSubmitting(false)
      }
    }

  return (
   <div className="flex items-center justify-center min-h-screen ">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
        <Form {...form}>
        <form onSubmit= {form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
           control={form.control}
           name="username"
           render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
             <FormControl>
                <Input placeholder="username" 
                {...field}
                onChange = {(e) => {
                  field.onChange(e)
                  debounced(e.target.value)
                }}
                />
                
                
              </FormControl>
             {isCheckingUsername && <Loader className="animate-spin"/>}
             <p className={`text-sm mt-1 ${usernameMessage === 'Username is available' ? 'text-green-600' : 'text-red-600'}`}>
            {usernameMessage}
              
             </p>
              <FormMessage />
            </FormItem>
           )}
          />
           <FormField
           control={form.control}
           name="email"
           render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
             <FormControl>
                <Input placeholder="Email" 
                {...field}
            
                />
               
                
              </FormControl>
             
              <FormMessage />
            </FormItem>
           )}
          />
       <FormField
  control={form.control}
  name="password"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Password</FormLabel>
      <FormControl>
        <Input
          type="password"
          placeholder="password"
          {...field}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
<button
  type="submit"
  disabled={isSubmitting}
  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
>
  {isSubmitting ? 
  (
    <>
     <Loader /> please wait
    </>
  ) : ('sign up')}
</button>
        </form>
        </Form>
        <div className="mt-4 text-center">
          <p>Already a member? {' '}</p>
          <Link href="/sign-in" className="text-blue-600 hover:underline">Sign In</Link>
          </div>     
      </div>
    </div>
  )
}

export default SignUp