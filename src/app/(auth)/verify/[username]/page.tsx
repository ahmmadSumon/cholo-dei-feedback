'use client'
import { verifySchema } from '@/app/schemas/verifySchema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from "sonner"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import * as z from 'zod' 
import { Button } from '@/components/ui/button'


const VerifyAccount = () => {
    const params = useParams()
    const router = useRouter()
    
    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema)
    })

    const onSubmit = async (data : z.infer< typeof verifySchema>) => {
         try {
           const response =   await axios.post('/api/verify-code' , {
              username : params.username,
              code: data.code
            })
            toast.success(response.data.message)
          router.replace('/sign-in')
         } catch (error) {
             console.error('Error in sign up', error)
                    const  axiosError = error as AxiosError<ApiResponse>
                    toast.error(axiosError.response?.data.message ?? 'Error in sign up')
                  
         }
    }

  return (
   <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 px-4">
  <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
    <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
      Verify Your Account
    </h2>

    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700">Verification Code</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your code"
                  {...field}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md transition"
        >
          Submit
        </Button>
      </form>
    </Form>
  </div>
</div>

  )
}

export default VerifyAccount