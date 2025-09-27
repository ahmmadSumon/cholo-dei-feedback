'use client'
import { acceptMessageSchema } from '@/app/schemas/acceptMessageSchema'
import MessageBox from '@/components/MessageBox'
import { Switch } from '@/components/ui/switch'
import { Message, User } from '@/model/User'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { set } from 'mongoose'
import { useSession } from 'next-auth/react'
import React, { use, useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { fa, tr } from 'zod/locales'

const page = () => {
  const [ messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const[isSwitchLoading, setIsSwitchLoading] = useState(false)

  const handleDeleteMessage = (messageId :string) => {
      setMessages(messages.filter((message) => message._id !== messageId))
  }

  const {data : session} = useSession()

  const form = useForm({
     resolver: zodResolver(acceptMessageSchema)
  })

  const {register, watch, setValue} = form

  const acceptMessages = watch('acceptMessages')

  const fetchAcceptedMessages = useCallback(async () => {
      setIsSwitchLoading(true)
      try {
       const response = await axios.get<ApiResponse>(`/api/accept-messages`)
       setValue('acceptMessages', response.data.isAcceptingMessages || false)

       

      } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>
          toast.error(axiosError.response?.data.message || 'Failed to fetch message acceptance status')
      } finally{
          setIsSwitchLoading(false)
          }
  }, [setValue])  

const  fetchMessages = useCallback(async (refresh: boolean = false) => {
       setIsLoading(true)
       setIsSwitchLoading(false)
       try {
        const response = await axios.get<ApiResponse>('/api/get-messages')
        setMessages(response.data.messages || [])
        if(refresh){
          toast.success('Showing latest messages')

        }
       } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>
          toast.error(axiosError.response?.data.message || 'Failed to fetch message acceptance status')

       }finally{
        setIsLoading(false)
        setIsSwitchLoading(false)
       }
}, [setMessages, setIsLoading]) 

  useEffect(() => {
      if(!session || !session.user)  return
 
      fetchMessages()
          
      fetchAcceptedMessages()
  }, [session, setValue, fetchMessages, fetchAcceptedMessages])
  
  //handle switch change
  const handleSwitchChange = async() =>{

    try {
        const response =  await axios.post<ApiResponse>('/api/accept-messages', {
        acceptMessages : !acceptMessages
      })
      setValue('acceptMessages', !acceptMessages)
      toast.success(response.data.message)
    } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>
          toast.error(axiosError.response?.data.message || 'Failed to fetch message acceptance status')
    }
  
  } 
if(!session || !session.user){
    return <div>Please sign in to access your dashboard</div>
   }
  const {username} = session?.user as User
  const baseUrl = `${window.location.protocol}//${window.location.host}`
  const profileUrl = `${baseUrl}/u/${username}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl)
    toast("Url copied to clipboard")
  }

   

   return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
    {/* Dashboard container */}
    <div className="max-w-6xl mx-auto bg-white shadow-md rounded-xl p-6">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <button
          onClick={copyToClipboard}
          value={profileUrl}
          disabled
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Copy Profile URL
        </button>
      </div>

      {/* Accept Messages Toggle */}
      <div className="flex items-center justify-between bg-gray-50 p-4 rounded-md mb-6 shadow-sm">
        <span className="text-gray-700 font-medium">Accept Messages</span>
        <label className="relative inline-flex items-center cursor-pointer">
         <div className='mb-4'>
          <Switch
          {...register('acceptMessages')}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
          />
          <span className='ml-2'>
            Accept Messages : {acceptMessages ? 'ON' : 'OFF'}
          </span>
         </div>
          <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 transition" />
          <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition" />
        </label>
      </div>

      {/* Messages List */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Messages</h2>
        {isLoading ? (
          <p className="text-gray-500">Loading messages...</p>
        ) : messages.length === 0 ? (
          <p className="text-gray-500">No messages yet</p>
        ) : (
          <ul className="space-y-4">
            {messages.map((message) => (
              <MessageBox 
               key={message._id}
               message={message}
               onMessageDelete={handleDeleteMessage}
               />
            ))}
          </ul>
        )}
      </div>

      {/* Footer / Profile URL */}
      <div className="mt-6 text-gray-600">
        Your Profile URL:{" "}
        <span className="font-mono text-blue-600">{profileUrl}</span>
      </div>
    </div>
  </div>
  )
}

export default page