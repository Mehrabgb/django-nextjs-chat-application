'use server'

import { redirect } from "next/navigation"

export default async function RegisterAction(prevState,formData){

  const email=formData.get('email')
  const username=formData.get('username')
  const password=formData.get('password')
  const password2=formData.get('password2')
  
  if (password !== password2){
    return {error: 'Passwords are not the same'}
  }
  const response=await fetch('http://backend:8000/register',{
    method:'POST',
    cache: "no-store",
    body:JSON.stringify({username : username, email : email, password : password}),
    headers:{
        'Content-type' : 'application/json'
    }
  })
  const data=await response.json()
  
  if (!response.ok){
    return {error: JSON.stringify(data)}
  }
  redirect('/login')
  

}