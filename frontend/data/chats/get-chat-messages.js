'use server'

import { cookies } from "next/headers"
import RefreshTokenAction from "../tokens/refreshtoken"

export default async function GetConversationMessages({conversation_id}) {
    const cookieStore = await cookies()
    const accessToken = await RefreshTokenAction()
    const refreshToken = cookieStore.get('refresh_token')?.value

    if(refreshToken){
        const response = await fetch(
            `http://backend:8000/messages/${conversation_id}/`,
            {cache:'no-store',
                 headers: {Authorization: `Bearer ${accessToken}`}})
        const date=await response.json()
        return [date,'auth']
    }
    if(!refreshToken){
        const response = await fetch(`http://backend/messages/${conversation_id}/`,{cache:'no-store',
            
        })
        const date=await response.json()
        return [date,false]
    }
}