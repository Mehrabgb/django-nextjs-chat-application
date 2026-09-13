'use server'

import { redirect } from "next/navigation"
import RefreshTokenAction from "@/data/tokens/refreshtoken"

export default async function EditProfileAction(prevState,formData){
  const accessToken = await RefreshTokenAction()
  const username=formData.get('username')
  const image=formData.get('image')
  const bio=formData.get('bio')
  const method = 'PATCH'
  const data = new FormData()

    data.append('username', username)
    data.append('bio', bio)

    if (image && image.size > 0) {
        data.append('image', image)
    }

  const response=await fetch('http:/backend:8000/createuser/edit/',{
    method: method,
    body: data,
    cache: "no-store",
    credentials: 'include',
      headers: {
        Authorization: `Bearer ${accessToken}`
  }})
 

  if (response.ok){
    redirect('/profile')
  }
  

}