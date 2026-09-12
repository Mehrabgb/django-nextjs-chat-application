
import Link from "next/link"

export default function CreateProfile(){

    return(
    <div className="flex min-h-screen items-center justify-center bg-[#eae2b7] px-4">
  <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">

    {/* Icon */}
    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#fcbf49]">
      <span className="text-3xl">👤</span>
    </div>

    {/* Title */}
    <h1 className="mb-2 text-2xl font-bold text-black">
      Complete your profile
    </h1>

    {/* Description */}
    <p className="mb-8 text-gray-800">
      You don't have a profile yet. Create one to add your photo and bio,
      or skip this step and continue using the app.
    </p>

    {/* Buttons */}
    <div className="flex flex-col gap-3">
      <Link href={'/profile/edit'}
        
        className="block w-full rounded-lg bg-[#780116] px-4 py-3 font-semibold text-white transition hover:bg-[#ff7f51]"
      >
        Create Profile
      </Link>

      <Link href={'/'}
        className="w-full rounded-lg border border-[#e36414] px-4 py-3 font-semibold text-gray-700 transition hover:bg-[#ff7f51]"
      >
        Skip for now
      </Link>
    </div>

  </div>
</div>
    )
}