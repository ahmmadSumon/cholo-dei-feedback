'use client'
import React from 'react'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from './ui/button'
import { Message } from  '../model/User'
import axios from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { toast } from "sonner"

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
}

const MessageBox  = ({message, onMessageDelete} : MessageCardProps) => {
  const confirmHandleDelete = async () => {
    try {
      await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`)
      toast.success("Message deleted successfully")
      onMessageDelete(message._id)
    } catch (error) {
      toast.error("Failed to delete message")
      console.error(error)
    }
  }

  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <CardTitle>Anonymous Message</CardTitle>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">X</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the message.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmHandleDelete}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardHeader>
      <CardContent>
        <p>{message.content}</p>
      </CardContent>
      <CardFooter className="text-sm text-gray-500">
        {new Date(message.createdAt).toLocaleString()}
      </CardFooter>
    </Card>
  )
}

export default MessageBox
