'use client';

import { useState } from 'react';
import ConversationItem from './conversation-item';

export default function ConversationsList({ conversations }) {
  const [filter, setFilter] = useState('all');
  const filteredConversations = conversations[0].filter((conversation) => {
      if (filter === 'group') {
          return conversation.is_group === true;
      }

      if (filter === 'private') {
          return conversation.is_group === false;
      }

      return true;
  });
    return (
      <main className="w-full max-w-5xl mx-auto ">
        {conversations[1] ? <div className="flex gap-2 p-4">
            <button onClick={() =>
            setFilter('all')} className={`px-4 py-2 rounded-lg ${ filter === 'all' ? 
            'bg-[#fca311] font-bold text-white' : 'bg-[#e5e5e5] text-black' }`} >
            All 
            </button> 
            <button 
            onClick={() => setFilter('private')} 
            className={`px-4 py-2 rounded-lg ${ filter === 'private' ?
            'bg-[#fca311] font-bold text-white' : 'bg-[#e5e5e5] text-black' }`} > Private 
            </button> 
            <button onClick={() => setFilter('group')} 
            className={`px-4 py-2 rounded-lg ${ filter === 'group' ?
            'bg-[#fca311] font-bold text-white' : 'bg-[#e5e5e5] text-black' }`} > Groups 
            </button> 
        </div>: <div className='p-6'></div>}
        <ConversationItem conversations={filteredConversations}/>
      </main>
    );
  }