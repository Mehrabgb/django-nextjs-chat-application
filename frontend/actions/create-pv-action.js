'use server'

import { redirect } from "next/navigation"
import RefreshTokenAction from "@/data/tokens/refreshtoken"
import { revalidateTag } from "next/cache"

export default async function CreatePVAction(id){
  const accessToken = await RefreshTokenAction()

  const response=await fetch(`http://backend:8000/conversations/private/${id}/`,{
    method: 'GET',
    cache: "no-store",
      headers: {
        Authorization: `Bearer ${accessToken}`
  }})
 

  if (response.ok){
    revalidateTag("conversations");
    const data=await response.json()
    redirect(`/pv/${data.id}`)
  }
  

}