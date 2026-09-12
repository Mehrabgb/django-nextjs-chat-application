'use server'

import { redirect } from 'next/navigation'
import RefreshTokenAction from '../data/tokens/refreshtoken'
import { cookies } from 'next/headers'

export default async function Logout() {
    const cookieStore = await cookies()
    const accessToken = await RefreshTokenAction()

    const response = await fetch(
        'http://backend:8000/logout',
        {method: 'POST',
            cache: "no-store",
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }
    )

    cookieStore.delete('refresh_token')

    redirect('/')
}