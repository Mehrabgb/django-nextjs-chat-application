import Logout from "@/actions/logoutaction";
import Image from "next/image";
import Link from "next/link";
import { cookies} from "next/headers";
export default async function Header({profile}) {
  const cookieStore = await cookies()
  const refreshToken = cookieStore.get('refresh_token')?.value

  return (
    <header className="h-16 bg-[#fca311] shadow-lg">
      <div className="h-full max-w-7xl mx-auto px-4 flex items-center justify-between">

        <Link href="/" className="flex items-center gap-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-10 text-black "
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
            />
          </svg>

          <span className="text-xl font-bold text-black">
            Chats App
          </span>
        </Link>

        {refreshToken?
        <div className="flex items-center gap-4">

          <Link
            href="/profile"
            className="flex items-center gap-3"
          >
            <div className="text-right hidden sm:block">
              <p className="text-m font-semibold text-black">
                {profile[0].username}
              </p>

              <p className="text-xs text-gray-700">
                Online
              </p>
            </div>

            <Image
              src={profile[0].image || '/samplehq1.jpeg'}
              alt={profile[0].username}
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover"
            />
          </Link>

          
          <button
          onClick={Logout}
            className="px-3 py-2 text-sm font-semibold text-red-600
                       hover:bg-red-200 rounded-lg transition"
          >
            Logout
          </button>
          </div>
          :<div>
          <Link
          href={'/login'}
            className="px-3 py-2 font-bold mx-5 text-green-600
                       hover:bg-green-50 rounded-lg transition"
          >
            Login
          </Link>
          <Link
          href={'/register'}
            className="px-3 py-2 font-bold text-green-600
                       hover:bg-green-50 rounded-lg transition"
          >
            Register
          </Link>
          </div>
          }
        </div>
    </header>
  );
}