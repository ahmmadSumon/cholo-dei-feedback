'use client'
import React, { useState, useEffect } from "react"
import { useDebounceCallback } from "usehooks-ts"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signUpSchema } from "@/app/schemas/signUpSchema"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Loader, Info } from "lucide-react"
import Link from "next/link"

const SignUp = () => {
  const [username, setUsername] = useState("")
  const [usernameMessage, setUsernameMessage] = useState("")
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const debounced = useDebounceCallback(setUsername, 500)
  const router = useRouter()

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  })

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (!username.trim()) return
      setIsCheckingUsername(true)
      setUsernameMessage("")
      try {
        const response = await axios.get(`/api/check-username-uniqueness?username=${encodeURIComponent(username)}`)
        setUsernameMessage(response.data.message)
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>
        setUsernameMessage(axiosError.response?.data.message ?? "Error in checking username")
      } finally {
        setIsCheckingUsername(false)
      }
    }
    checkUsernameUnique()
  }, [username])

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true)
    try {
      await axios.post("/api/sign-up", data)
      toast.success("Account created successfully! Please check your email to verify your account.")
      router.replace(`/verify/${data.username}`)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error(axiosError.response?.data.message ?? "Error in sign up")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen  px-4">
      <div className="w-full max-w-md p-8 rounded-2xl shadow-xl relative bg-white/80 backdrop-blur-md border border-gray-200">
        
        {/* Showcase Notice */}
        <div className="mb-6 p-4 rounded-lg border border-yellow-300 bg-yellow-100/80 text-yellow-800 text-sm flex items-start gap-2">
          <Info className="w-5 h-5 mt-0.5 text-yellow-600" />
          <p>
            <strong>Note:</strong> This project is only a <span className="font-semibold">showcase</span>.  
            Resend email verification is <span className="underline">disabled</span>.  
            Please use the <span className="font-semibold text-purple-700">default demo credentials</span> on the{" "}
            <Link href="/sign-in" className="text-blue-600 hover:underline">Login page</Link> to continue.
          </p>
        </div>

        <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-800">✨ Create Account</h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Username */}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Choose a username"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e)
                        debounced(e.target.value)
                      }}
                      className="rounded-lg border-gray-300 focus:ring-2 focus:ring-purple-500"
                    />
                  </FormControl>
                  {isCheckingUsername && <Loader className="animate-spin w-4 h-4 text-gray-500 mt-1" />}
                  {usernameMessage && (
                    <p
                      className={`text-sm mt-1 transition ${
                        usernameMessage === "Username is available" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {usernameMessage}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email"
                      {...field}
                      className="rounded-lg border-gray-300 focus:ring-2 focus:ring-purple-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter a secure password"
                      {...field}
                      className="rounded-lg border-gray-300 focus:ring-2 focus:ring-purple-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2.5 px-4 rounded-lg font-medium hover:opacity-90 transition transform hover:scale-[1.01] shadow-md disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader className="animate-spin w-4 h-4" />
                  Please wait...
                </span>
              ) : (
                "Sign Up"
              )}
            </button>
          </form>
        </Form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Already a member?{" "}
          <Link href="/sign-in" className="text-purple-600 hover:underline font-medium">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}

export default SignUp
