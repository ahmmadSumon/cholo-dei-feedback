// "use client"

// import React, { useState } from "react"
// import { useForm } from "react-hook-form"
// import { z } from "zod"
// import { zodResolver } from "@hookform/resolvers/zod"
// import axios, { AxiosError } from "axios"
// import { toast } from "sonner"
// import { ApiResponse } from "@/types/ApiResponse"
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { Loader } from "lucide-react"

// const messageSchema = z.object({
//   username: z.string().min(3, "Username is required"),
//   content: z.string().min(5, "Message should be at least 5 characters"),
// })

// type MessageSchema = z.infer<typeof messageSchema>


// const MessagePage = () => {
//   const [isSubmitting, setIsSubmitting] = useState(false)

//   const form = useForm<MessageSchema>({
//     resolver: zodResolver(messageSchema),
//     defaultValues: {
//       username: "",
//       content: "",
//     },
//   })

//   const onSubmit = async (data: MessageSchema) => {
//     setIsSubmitting(true)
//     try {
//       const response = await axios.post<ApiResponse>("/api/send-message", data)
//       toast.success(response.data.message)
//       form.reset()
//     } catch (error) {
//       const axiosError = error as AxiosError<ApiResponse>
//       toast.error(axiosError.response?.data.message ?? "Failed to send message")
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
//       <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
//         <h2 className="text-2xl font-bold mb-6 text-center">Send a Message</h2>

//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//             {/* Username */}
//             {/* <FormField
//               control={form.control}
//               name="username"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Username</FormLabel>
//                   <FormControl>
//                     <Input placeholder="Enter recipient username" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             /> */}

//             {/* Content */}
//             <FormField
//               control={form.control}
//               name="content"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Message</FormLabel>
//                   <FormControl>
//                     <Textarea
//                       placeholder="Write your message here..."
//                       {...field}
//                       className="resize-none"
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {/* Submit */}
//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
//             >
//               {isSubmitting ? (
//                 <div className="flex items-center justify-center gap-2">
//                   <Loader className="animate-spin w-4 h-4" /> Sending...
//                 </div>
//               ) : (
//                 "Send Message"
//               )}
//             </button>
//           </form>
//         </Form>
//       </div>
//     </div>
//   )
// }

// export default MessagePage


"use client"

import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { useParams } from "next/navigation"
import axios from "axios"
import { toast } from "sonner"

type FormData = {
  senderName: string
  content: string
}

const MessagePage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const params = useParams() // <-- get params here
  const username = params?.username as string

  const { register, handleSubmit, reset } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    try {
      await axios.post("/api/send-message", {
        username,
        senderName: data.senderName,
        content: data.content,
      })
      toast.success("Message sent successfully!")
      reset()
    } catch (err) {
      toast.error("Failed to send message.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Send message to {username}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
         
          <textarea
            placeholder="Your Message"
            className="w-full p-2 border rounded resize-none"
            {...register("content")}
            required
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default MessagePage
