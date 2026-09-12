import Image from "next/image";
import Link from "next/link";
import Conversations from "../profile/groups-PVs";


export default function UserDetailPage({id,data}) {
  return (
    <main className="min-h-screen bg-[#eae2b7]">

      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* Back to chat */}
        <Link
          href={`/pv/${id}`}
          className="inline-flex items-center
                     text-sm text-gray-700
                     hover:text-black mb-5"
        >
          ← Back to chat
        </Link>


        {/* Profile card */}
        <section
          className="bg-white rounded-2xl
                     border shadow-sm overflow-hidden"
        >

          {/* Profile header */}
          <div
            className="flex flex-col items-center
                       px-6 py-8 border-b"
          >

            {/* Profile image */}
            <div className="relative">

              <Image
                src={data.image? data.image : '/samplehq1.jpeg'}
                alt={data.username}
                width={240}
                height={240}
                className="w-28 h-28 rounded-full
                           object-cover border-4
                           border-gray-100"
              />
            </div>


            {/* Username */}
            <h1
              className="mt-4 text-2xl
                         font-bold text-gray-800"
            >
              {data.username}
            </h1>

          </div>


          {/* About */}
          <div className="px-6 py-6 border-b">

            <h2
              className="text-sm font-semibold
                         text-gray-500 uppercase"
            >
              About
            </h2>

            <p
              className="mt-2 text-gray-700
                         leading-relaxed"
            >
              {data.bio}
            </p>

          </div>


          {/* User information */}
          <div className="px-6 pt-6 border-b">

            <h2
              className="text-sm font-semibold
                         text-gray-500 uppercase mb-4"
            >
              Groups
            </h2>
            <Conversations conversations={data.groups}/>

          </div>
        </section>

      </div>

    </main>
  );
}