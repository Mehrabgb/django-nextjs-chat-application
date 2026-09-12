import GroupDetailPage from "@/components/group/group-detail";
import GetConversationDetail from "@/data/conversation-detail/get-detail";

export default async function GroupDetail({params}){
    const { id } = await params;
    const data=await GetConversationDetail({id:id})
    return (<GroupDetailPage data={data} id={id}/>)
}