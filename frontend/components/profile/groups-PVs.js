import Link from "next/link";
import Image from "next/image";

export default function Conversations({ conversations }) {

    const groups = conversations?.filter(
        conversation => conversation.is_group
    );

    const privateChats = conversations?.filter(
        conversation => !conversation.is_group
    );

    return (
        <div className="w-full">

            {/* Groups */}
            <div className="mb-8">

                <h2 className="text-xl text-black font-bold mb-4">
                    Groups
                </h2>

                {groups?.length === 0 ? (

                    <p className="text-gray-500">
                        You haven't joined any groups.
                    </p>

                ) : (

                    <div className="space-y-2">

                        {groups?.map((group) => (

                            <Link
                                key={group.id}
                                href={`/group/${group.id}`}
                                className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100"
                            >

                                <Image
                                    src={group.image? group.image : '/samplehq1.jpeg'}
                                    alt={group.name}
                                    width={52}
                                    height={52}
                                    className="w-12 h-12 rounded-full object-cover"
                                />

                                <div>
                                    <h3 className="font-semibold text-black">
                                        {group.name}
                                    </h3>

                                </div>

                            </Link>

                        ))}

                    </div>
                )}

            </div>
        </div>
    );
}