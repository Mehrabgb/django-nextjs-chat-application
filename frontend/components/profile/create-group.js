"use client";

import CreateGroupAction from "@/actions/create-group-action";
import Image from "next/image";
import Link from "next/link";
import { useActionState } from "react";
import { useState } from "react";

export default function CreateGroupPage() {
  const [state,formaction]=useActionState(CreateGroupAction,{})
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [image, setImage] = useState();

  function handleImageChange(e) {
    const file = e.target.files?.[0];

    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setImage(imageUrl);
  }

  return (
    <main className="min-h-screen  bg-[#eae2b7]">

      <div className="max-w-2xl mx-auto px-4 py-10">

        {/* Page title */}
        <div className="mb-6">
          <Link
            href="/profile"
            className="text-sm text-gray-700 hover:text-black"
          >
            ← Back to profile
          </Link>

          <h1 className="text-2xl font-bold text-black mt-3">
            Create New Group
          </h1>
        </div>


        {/* Form */}
        <form
          action={formaction}
          className="bg-white rounded-2xl shadow-sm border p-6"
        >

          {/* Profile image */}
          <div className="flex flex-col items-center mb-8">

            <Image
              src={image? image : `/samplehq1.jpeg`}
              alt="Group"
              width={120}
              height={120}
              loading="eager"
              className="w-28 h-28 rounded-full
                         object-cover border-4 border-gray-100"
            />

            <label
              htmlFor="group-image"
              className="mt-4 cursor-pointer
                         px-4 py-2 rounded-lg
                         border border-gray-500
                         text-sm font-medium
                         text-gray-700
                         hover:bg-gray-50 transition"
            >
              Add photo
            </label>

            <input
              id="group-image"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />

          </div>


          {/* Name */}
          <div className="mb-5">

            <label
              htmlFor="name"
              className="block text-sm font-medium
                         text-gray-900 mb-2"
            >
              Name
            </label>

            <input
              id="name"
              name="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3
                          text-black
                         border border-gray-300
                         rounded-lg outline-none
                         focus:ring-2 focus:ring-blue-400
                         focus:border-transparent"
            />

          </div>


          {/* Bio */}
          <div className="mb-8">

            <label
              htmlFor="bio"
              className="block text-sm font-medium
                         text-gray-900 mb-2"
            >
              Bio
            </label>

            <input
              id="bio"
              name="bio"
              type="text"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-4 py-3
                        text-black
                         border border-gray-300
                         rounded-lg outline-none
                         focus:ring-2 focus:ring-blue-400
                         focus:border-transparent"
            />

          </div>


          {/* Buttons */}
          <div className="flex gap-3">

            <Link
              href="/profile"
              className="flex-1 text-center
                         px-4 py-3 rounded-lg
                         border border-gray-500
                         text-gray-700 font-medium
                         hover:bg-gray-50 transition"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="flex-1 px-4 py-3
                         rounded-lg bg-[#fca311ff]
                         text-white font-medium
                         hover:bg-[#ffba4c] transition"
            >
              Create
            </button>

          </div>

        </form>

      </div>

    </main>
  );
}