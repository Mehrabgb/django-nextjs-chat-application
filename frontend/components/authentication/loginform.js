'use client'

import Link from 'next/link'
import LoginAction from '@/actions/loginaction'
import { useActionState } from "react"

export default  function LoginForm(){
    const [state,formaction]=useActionState(LoginAction,{})
    return <main className="flex min-h-screen items-center justify-center bg-[#eae2b7] px-4">
            <div className="w-full max-w-md rounded-2xl bg-[#ffc971] p-8 shadow-lg">

                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-black">
                        Welcome Back
                    </h1>

                    <p className="mt-2 text-gray-600">
                        Login to your account
                    </p>
                </div>

                <form className="space-y-5" action={formaction}>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-900">
                            Username
                        </label>

                        <input
                            name='username'
                            type="text"
                            placeholder="Enter your email"
                            className="w-full rounded-lg text-black border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block  text-sm font-medium text-gray-900">
                            Password
                        </label>

                        <input
                            name='password'
                            type="password"
                            placeholder="Enter your password"
                            className="w-full rounded-lg text-black border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full rounded-lg bg-[#fca311] py-3 font-medium text-black transition hover:bg-[#e5e5e5]"
                    >
                        Login
                    </button>

                </form>

                <p className="mt-6 text-center text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link
                        href="/register"
                        className="font-medium text-blue-600 hover:underline"
                    >
                        Create an account
                    </Link>
                </p>

            </div>
        </main>
}