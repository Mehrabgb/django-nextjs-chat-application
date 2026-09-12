'use server'

import { cookies } from "next/headers"
import RefreshTokenAction from "../tokens/refreshtoken"

export default async function GetConversationList() {
    const cookieStore = await cookies()
    const accessToken = await RefreshTokenAction()
    const refreshToken = cookieStore.get('refresh_token')?.value

    if(refreshToken){
        const response = await fetch(
            `http://backend:8000/`,
            
            {  next: {tags: ["conversations"],},
            headers: {Authorization: `Bearer ${accessToken}`}})
        const date=await response.json()
        return [date,'auth']
    }
    if(!refreshToken){
        const response = await fetch(`http://backend:8000/`)
        const date=await response.json()
        return [date]
    }
}