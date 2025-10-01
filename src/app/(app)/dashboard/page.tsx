'use client'
import { acceptMessageSchema } from '@/app/schemas/acceptMessageSchema'
import MessageBox from '@/components/MessageBox'
import { Switch } from '@/components/ui/switch'
import { Message, User } from '@/model/User'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'

import { useSession } from 'next-auth/react'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'


const Dashboard = () => {
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
  toast("URL copied to clipboard ✅")
}

   

   return (
   <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-8 px-4">
  {/* Dashboard container */}
  <div className="max-w-6xl mx-auto bg-gray-900 shadow-2xl rounded-2xl p-8 border border-gray-700">
    
    {/* Header */}
    <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
      <h1 className="text-3xl md:text-4xl font-extrabold text-white">
        {username} Dashboard
      </h1>
       
    </div>
<div className="mt-8 flex flex-col md:flex-col items-center justify-between bg-gray-800 p-5 rounded-xl border border-gray-700 shadow-inner">
      <div className=" md:flex items-center gap-3">
        <span className="text-gray-300 font-mono truncate">{profileUrl}</span>
        <button
          onClick={copyToClipboard}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
        >
          Copy Profile URL
        </button>
      </div>
      <p className="text-gray-500 mt-2 md:mt-0 text-sm">
        Share this URL to receive anonymous messages
      </p>
    </div>
    {/* Accept Messages Toggle */}
    <div className="flex items-center justify-between bg-gray-800 p-5 rounded-xl mb-8 shadow-inner border border-gray-700">
      <span className="text-white font-semibold text-lg">Accept Messages</span>
      <div className="flex items-center gap-4">
        <Switch
          {...register('acceptMessages')}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className={`font-medium ${acceptMessages ? 'text-green-400' : 'text-red-400'}`}>
          {acceptMessages ? 'ON' : 'OFF'}
        </span>
      </div>
    </div>

    {/* Messages List */}
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Messages</h2>
      {isLoading ? (
        <p className="text-gray-400 italic">Loading messages...</p>
      ) : messages.length === 0 ? (
        <p className="text-gray-400 italic">No messages yet</p>
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
   
  </div>
</div>
  )
}

export default Dashboard