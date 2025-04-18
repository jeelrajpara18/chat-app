/* eslint-disable react-refresh/only-export-components */
import AppLayout from '@/components/layout/AppLayout'
import { useAppStore } from '../../store/index'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { User } from 'lucide-react';
import ContactContainer from "./components/contacts/ContactsContainer";
import EmptyChatContainer from './components/empty-chat-container/EmptyChat';
import ChatContainer from './components/chat-container/ChatContainer';

const Chat =() =>{
  const {userInfo} = useAppStore();
  const navigate = useNavigate();

  useEffect(()=> {

    if(!userInfo.profileSetup){
      toast("Please setup profile to continue.");
      navigate("/profile")
    }
  },[userInfo , navigate])
  return (
    <div className='flex overflow-hidden h-screen'>
      <ContactContainer/>
      {/* <EmptyChatContainer/> */}
      {/* <ChatContainer/> */}
    </div>
  )
}

export default Chat