
import GetProfile from "@/data/profile/get-profile";
import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import Logout from "@/actions/logoutaction";
import Conversations from "./groups-PVs";

export default async function ProfilePage() {
  const cookieStore = await cookies()
  const refreshToken = cookieStore.get('refresh_token')?.value
  const profile=await GetProfile()

  if (!profile){
    return <p className="text-center m-100 text-xl font-semibold text-black bg-[#eae2b7]">login first</p>
  }
  return (
    <main className="min-h-screen bg-[#eae2b7]">

      <div className="max-w-2xl mx-auto px-4 py-10">
        <Link
            href="/"
            className="text-sm p-5 text-gray-700 hover:text-black"
          >
            ← Back to Home page
          </Link>

        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">

          <div className="flex flex-col items-center px-6 py-8 border-b">

            <Image
              src={profile[0].image || '/samplehq1.jpeg'}
              alt="Profile"
              width={120}
              height={120}
              className="w-28 h-28 rounded-full
                         object-cover border-4 border-gray-100"
            />

            <h1 className="mt-4 text-2xl font-bold text-gray-800">
             {profile[0].username}
            </h1>

          </div>

          <div className="px-6 py-6">

            <div className="space-y-4">

              <div>
                <p className="text-sm text-black">
                  Bio
                </p>

                <p className="font-medium  text-black mt-1">
                  {profile[0].bio}
                </p>
              </div>
            <Conversations conversations={profile[0].groups}/>

            </div>


          </div>

          <div className="px-6 pb-6 space-y-3">

            <Link
              href="/profile/edit"
              className="block w-full text-center
                         px-4 py-3 rounded-lg
                         bg-[#fca311ff] text-white
                         font-medium
                         hover:bg-[#ffba4c] transition"
            >
              Edit profile
            </Link>

            <Link
              href="/profile/group"
              className="block w-full text-center
                         px-4 py-3 rounded-lg
                         border border-gray-300
                         text-gray-700 font-medium
                         hover:bg-gray-50 transition"
            >
              Create a group
            </Link>
            
            <button onClick={Logout}
              className="w-full px-4 py-3 rounded-lg
                         text-red-600 font-medium
                         hover:bg-red-50 transition"
            >
              Logout
            </button>

          </div>

        </div>

      </div>

    </main>
  );
}