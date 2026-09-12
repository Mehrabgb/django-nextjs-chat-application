import ConversationList from "@/components/main-page/conversations-list";
import Header from "@/components/main-page/header";
import GetConversationList from "@/data/conversation-list/get-conversation-list";
import GetProfile from "@/data/profile/get-profile";

export default async function Home() {
  const conversations=await GetConversationList()
  const profile=await GetProfile()

  return (
    <div className="min-h-screen bg-[#eae2b7]">

      <Header profile={profile}/>

      <ConversationList conversations={conversations}/>

    </div>
  );
}
