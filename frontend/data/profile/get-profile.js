'use server'

import RefreshTokenAction from '../tokens/refreshtoken'
import { cookies } from 'next/headers'

export default async function GetProfile() {
    const cookieStore = await cookies()
    const accessToken = await RefreshTokenAction()
    const refreshToken = cookieStore.get('refresh_token')?.value

    if (!refreshToken) {
        return null
    }

    const response = await fetch(
        'http://backend:8000/profile',
        {   cache:'no-store',
            headers: {
                 Authorization: `Bearer ${accessToken}`
            }})
    const data=await response.json()
    
    return data
}