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
  const params = useParams()
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
    <div className="flex items-center justify-center min-h-screen -50 px-4">
      <div className="w-full max-w-lg p-8 bg-white rounded-2xl shadow-xl border border-gray-200">
        <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-800">
          Send a Message to <span className="text-indigo-600">{username}</span>
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <textarea
            placeholder="Type your message..."
            rows={5}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
            {...register("content")}
            required
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-xl hover:bg-indigo-700 transition flex justify-center items-center"
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default MessagePage
