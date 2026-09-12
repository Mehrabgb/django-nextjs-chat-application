import Image from "next/image";
import Link from "next/link";
import Members from "./members";

export default function GroupDetailPage({id,data}) {

  return (
    <main className="min-h-screen  bg-[#eae2b7]">

      <div className="max-w-3xl mx-auto px-4 py-8">

        {/* Back */}
        <Link
          href={`/group/${id}`}
          className="inline-flex items-center
                     text-sm text-gray-700
                     hover:text-black mb-5"
        >
          ← Back to group chat
        </Link>


        {/* Group profile */}
        <section className="bg-white rounded-2xl border
                            shadow-sm overflow-hidden">

          {/* Group header */}
          <div className="flex flex-col items-center
                          px-6 py-8 border-b">

            {/* Group image */}
            <Image
              src={data.image}
              alt={data.name}
              width={240}
              height={240}
              className="w-28 h-28 rounded-full
                         object-cover border-4
                         border-gray-100"
            />

            {/* Group name */}
            <h1 className="mt-4 text-2xl font-bold text-gray-800">
              {data.name}
            </h1>

            {/* Members count */}
            <p className="mt-1 text-sm text-gray-500">
              {data.members.length} members
            </p>

          </div>


          {/* Group information */}
          <div className="px-6 py-6 border-b">

            <h2 className="text-sm font-semibold
                           text-gray-500 uppercase">
              About
            </h2>

            <p className="mt-2 text-gray-700 leading-relaxed">
              {data.bio}
            </p>


            {/* Details */}
            <div className="mt-5 space-y-3">

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Created by
                </span>

                <span className="font-medium text-gray-800">
                  {data.owner}
                </span>
              </div>


              <div className="flex justify-between">
                <span className="text-gray-500">
                  Created
                </span>

                <span className="font-medium text-gray-800">
                  {'group.createdAt'}
                </span>
              </div>

            </div>

          </div>


          {/* Members */}
          <div className="px-6 py-6">

            <div className="flex items-center
                            justify-between mb-4">

              <h2 className="text-lg font-bold text-gray-800">
                Members
              </h2>

            </div>


            {/* Members list */}
            <Members data={data}/>

          </div>



        </section>

      </div>

    </main>
  );
}