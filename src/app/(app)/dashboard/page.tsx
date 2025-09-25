import { acceptMessageSchema } from '@/app/schemas/acceptMessageSchema'
import { Message } from '@/model/User'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSession } from 'next-auth/react'
import React, { use, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { fa } from 'zod/locales'

const page = () => {
  const [messages, setMessages] = useState<Message[]>([])
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
  const acceptMessages = watch('acceptMessage')


   return (
    <div>dashboard</div>
  )
}

export default page