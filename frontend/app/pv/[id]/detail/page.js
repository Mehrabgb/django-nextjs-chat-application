import UserDetailPage from "@/components/Pv/pv-detail";
import GetConversationDetail from "@/data/conversation-detail/get-detail";

export default async function PVDetail({params}){
    const { id } = await params;
    const data=await GetConversationDetail({id:id})
    return (<UserDetailPage id={id} data={data}/>)
}