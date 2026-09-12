'use client'

import Link from 'next/link'
import RegisterAction from '@/actions/registeraction'
import { useActionState } from "react"

export default  function RegisterForm(){
    const [state,formaction]=useActionState(RegisterAction,{})

    return <main className="flex min-h-screen items-center justify-center bg-[#eae2b7] px-4">
            <div className="w-full max-w-md rounded-2xl bg-[#ffc971] p-8 shadow-lg">

                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-black">
                        Create Account
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Create your account and start shopping
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
                            placeholder="Choose a username"
                            className="w-full rounded-lg border border-gray-300 text-black px-4 py-3 outline-none transition focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-900">
                            Email
                        </label>

                        <input
                            name='email'
                            type="email"
                            placeholder="Enter your email"
                            className="w-full rounded-lg text-black border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-900">
                            Password
                        </label>

                        <input
                            name='password'
                            type="password"
                            placeholder="Create a password"
                            className="w-full rounded-lg border text-black border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-900">
                            Confirm Password
                        </label>

                        <input
                            name='password2'
                            type="password"
                            placeholder="Confirm your password"
                            className="w-full rounded-lg border text-black border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full rounded-lg bg-[#fca311] py-3 font-medium text-black transition hover:bg-[#e5e5e5]"
                    >
                        Create Account
                    </button>

                </form>

                <p className="mt-6 text-center text-sm text-gray-700">
                    Already have an account?{' '}
                    <Link
                        href="/login"
                        className="font-medium text-blue-600 hover:underline"
                    >
                        Login
                    </Link>
                </p>

            </div>
        </main>
}