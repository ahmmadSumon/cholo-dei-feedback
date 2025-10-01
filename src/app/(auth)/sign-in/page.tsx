'use client'
import React from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import * as z from 'zod'
import { useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { signInSchema } from "@/app/schemas/signInSchema"
import { signIn } from "next-auth/react"



const SignIn = () => {
   

 
 
    const router = useRouter()

    //zod implementation
    const form = useForm<z.infer<typeof signInSchema>>({
      resolver: zodResolver(signInSchema),
      defaultValues : {
        username: '',
        password: ''
      }
    })
    
 const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    const result =   await signIn('credentials', {
      redirect: false,
        identifier: data.username,
        password: data.password,
      })

      if(result?.error){
        if(result.error === 'CredentialsSignIn'){
            toast.error('Invalid username or password')
        }else{
          toast.error(result.error)
        }
       

    }
    if(result?.url){
      router.replace('/dashboard')
    }
  }
       
         
    

  return (
   <div className="flex items-center justify-center min-h-screen bg-transparent">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login into Account</h2>
        <Form {...form}>
        <form onSubmit= {form.handleSubmit(onSubmit)} className="space-y-4">
         
           <FormField
           control={form.control}
           name="username"
           render={({ field }) => (
            <FormItem>
              <FormLabel>Email/Username</FormLabel>
             <FormControl>
                <Input placeholder="email/username" 
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
 
  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
>
 Sign In
</button>
        </form>
        </Form>
        <div className="mt-4 text-center">
          <p>Not a member? {' '}</p>
          <Link href="/sign-up" className="text-blue-600 hover:underline">Sign Up</Link>
          </div>     
      </div>
    </div>
  )
}

export default SignIn;