'use client'
import React, {use, useState, useEffect } from "react"
import { useDebounceValue } from 'usehooks-ts'
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import * as z from 'zod'
import { useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod'
import { signUpSchema } from "@/app/schemas/signUpSchema"
import axios,{AxiosError} from "axios"
import { set } from "mongoose"
import { ApiResponse } from "@/types/ApiResponse"

const page = () => {
   const [username, setUsername] = useState('')
   const [usernameMessage, setUsernameMessage] = useState('')
   const [isCheckingUsername, setIsCheckingUsername] = useState(false)
   const [isSubmitting, setIsSubmitting] = useState(false)
 
    const debouncedUsername = useDebounceValue(username, 500)
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
          if(debouncedUsername){
            setIsCheckingUsername(true)
            setUsernameMessage('')
            try {
             const response =  await axios.get(`api/check-username-uniqueness?username=${debouncedUsername}`)

             setUsernameMessage(response.data.message)
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
    }, [debouncedUsername])

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
    <div>page</div>
  )
}

export default page