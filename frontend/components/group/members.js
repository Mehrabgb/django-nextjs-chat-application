'use client'

import Image from "next/image"
import CreatePVAction from "@/actions/create-pv-action";

export default function Members({data}){
  async function handler(id){
    await CreatePVAction(id)
  }
  return <div className="space-y-2">

      {data.members.map((member) => (

        <button onClick={() => handler(member.id)}
          key={member.id}
          className="flex items-center
                      gap-3 p-3 rounded-xl w-full
                      hover:bg-gray-50 transition"
        >

          {/* Profile image */}
          <div className="relative">

            <Image
              src={member.profile?.image ? member.profile.image: '/samplehq1.jpeg'}
              alt={member.username}
              width={120}
              height={120}
              className="w-12 h-12 rounded-full
                          object-cover"
            />

          </div>


          {/* User information */}
          <div className="flex-1">

            <div className="flex items-center gap-2">

              <p className="font-semibold
                            text-gray-800">
                {member.username}
              </p>

              {member.username === data.owner && (
                <span
                  className="text-xs px-2 py-1
                              rounded-full
                              bg-blue-100
                              text-blue-600"
                >
                  Admin
                </span>
              )}

            </div>

          </div>

        </button>

      ))}

    </div>
}