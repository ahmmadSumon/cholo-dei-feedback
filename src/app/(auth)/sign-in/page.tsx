'use client'
import React, { useRef } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { signInSchema } from "@/app/schemas/signInSchema"
import { signIn } from "next-auth/react"
import { Copy } from "lucide-react"

const SignIn = () => {
  const router = useRouter()

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  // Clipboard function
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`Copied: ${text}`)
  }

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    const result = await signIn("credentials", {
      redirect: false,
      identifier: data.username,
      password: data.password,
    })

    if (result?.error) {
      if (result.error === "CredentialsSignIn") {
        toast.error("Invalid username or password")
      } else {
        toast.error(result.error)
      }
    }

    if (result?.url) {
      router.replace("/dashboard")
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen  px-4">
      <div className="w-full max-w-md p-8 rounded-2xl shadow-xl relative bg-white/80 backdrop-blur-md border border-gray-200">
        <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-800">🔐 Login</h2>

        {/* Clipboard section */}
        <div className="mb-6 space-y-3">
          <div className="flex items-center justify-between bg-gray-100 rounded-lg px-3 py-2">
            <span className="font-mono text-sm text-gray-700">demo_user</span>
            <button
              type="button"
              onClick={() => copyToClipboard("demo_user")}
              className="text-blue-600 hover:text-blue-800 transition"
            >
              <Copy size={18} />
            </button>
          </div>
          <div className="flex items-center justify-between bg-gray-100 rounded-lg px-3 py-2">
            <span className="font-mono text-sm text-gray-700">demo_pass</span>
            <button
              type="button"
              onClick={() => copyToClipboard("demo_pass")}
              className="text-blue-600 hover:text-blue-800 transition"
            >
              <Copy size={18} />
            </button>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Email / Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter email or username"
                      {...field}
                      className="rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500"
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
                  <FormLabel className="text-gray-700">Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter password"
                      {...field}
                      className="rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2.5 px-4 rounded-lg font-medium hover:opacity-90 transition transform hover:scale-[1.01] shadow-md"
            >
              Sign In
            </button>
          </form>
        </Form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Not a member?{" "}
          <Link href="/sign-up" className="text-blue-600 hover:underline font-medium">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  )
}

export default SignIn
