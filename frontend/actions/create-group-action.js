'use server'

import { redirect } from "next/navigation"
import RefreshTokenAction from "@/data/tokens/refreshtoken"
import { revalidateTag } from "next/cache";

export default async function CreateGroupAction(prevState,formData){
  const accessToken = await RefreshTokenAction()
  const username=formData.get('name')
  const image=formData.get('image')
  const bio=formData.get('bio')

  const data = new FormData()

    data.append('name', username)
    data.append('bio', bio)

    if (image && image.size > 0) {
        data.append('image', image)
    }

  const response=await fetch('http://backend:8000/conversations/create',{
    method: 'POST',
    cache: "no-store",
    body: data,
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${accessToken}`
  }})
 

  if (response.ok){
    revalidateTag("conversations");
    redirect('/profile')
  }
  

}