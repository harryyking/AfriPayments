"use client";
import React, {ReactNode} from 'react'
import {SessionProvider} from "next-auth/react"
import type {Session} from 'next-auth'

interface ProviderProps{
  children: ReactNode;
  session?: Session | null;
}


const Provider: React.FC<ProviderProps> = ({children, session}) => {
  return (
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
   
  )
}

export default Provider