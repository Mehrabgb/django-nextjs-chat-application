'use server'

import { cookies } from 'next/headers'

export default async function RefreshTokenAction() {
    const cookieStore = await cookies()

    const refreshToken = cookieStore.get('refresh_token')?.value

    if (!refreshToken) {
        return null
    }

    const response = await fetch(
        'http://backend:8000/token/refresh/',
        {   method: 'POST',
            cache: 'no-store',
            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({
                refresh: refreshToken
            })
        }
    )

    if (!response.ok) {
        return null
    }
    const data = await response.json()

    return data.access
}
