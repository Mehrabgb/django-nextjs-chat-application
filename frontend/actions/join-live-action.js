'use server'

import { redirect } from "next/navigation"
import RefreshTokenAction from "@/data/tokens/refreshtoken"

export default async function JoinLeaveAction({conversation_id}){
  const accessToken = await RefreshTokenAction()

  const response=await fetch(`http://backend:8000/joinleave/${conversation_id}/`,{
    method: 'POST',
    cache: "no-store",
      headers: {
        Authorization: `Bearer ${accessToken}`
  }})
 

  if (response.ok){
    redirect(`/group/${conversation_id}`)
  }
  

}