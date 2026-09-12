'use server'

import { redirect } from "next/navigation"
import { cookies } from "next/headers"

export default async function LoginAction(prevState,formData){

  const username=formData.get('username')
  const password=formData.get('password')
  
  const response=await fetch('http://backend:8000/login/',{
    method:'POST',
    cache: "no-store",
     body:JSON.stringify({username : username, password : password}),
    headers:{
        'Content-type' : 'application/json'
    }
  })
  const data=await response.json()
  const cookieStore = await cookies()

  cookieStore.set('refresh_token', data.refresh, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
  })

  if (response.ok) {
    if (data.has_profile === false) {
      redirect('/profile/edit/create')
    } else {
      redirect('/')
    }
  }
    }
    