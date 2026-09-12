import Image from 'next/image';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

export default function ConversationItem({conversations}){
    
    return(
    <div className="w-full  rounded-xl overflow-hidden">

       {conversations.map((conversation) => {
        const image =
          conversation.profile === null
            ? conversation.image
            : conversation.profile.profile.image

        const imageUrl =
          image?.replace(
            'http://backend:8000',
            ''
          ) || '/samplehq1.jpeg'
          return(
          <Link
            key={conversation.id}
            href={conversation.is_group? `/group/${conversation.id}` : `/pv/${conversation.id}`}
            className="flex my-1 bg-[#ffc971] items-center gap-4 px-5 py-4
                       hover:bg-[#ffd670] transition">
            <Image
              src={imageUrl}
              alt={conversation.name}
              width={52}
              height={52}
              className="w-13 h-13 rounded-full object-cover"
            />

            <div className="flex-1 min-w-0">

              <div className="flex justify-between items-center">
                <h2 className="font-semibold text-lg text-black">
                  {conversation.profile===null?conversation.name:conversation.profile.username}
                </h2>

                <span className="text-xs text-gray-600">
                  {conversation.last_message ? formatDistanceToNow(new Date(conversation.last_message.date),{ addSuffix: true }): null}
                </span>
              </div>

              <p className="text-sm  text-black truncate mt-1">
                {conversation.last_message ?<span className='font-bold text-black mr-1'>{conversation.last_message?.username}:</span>:null}
                {conversation.last_message?.message_content}
              </p>

            </div>

          </Link>
        )})}

      </div>
    )
}