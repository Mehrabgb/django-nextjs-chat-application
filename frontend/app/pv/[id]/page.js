import PrivateChat from "@/components/Pv/pv";
import GetConversationMessages from "@/data/chats/get-chat-messages";
import RefreshTokenAction from "@/data/tokens/refreshtoken";

export default async function PV({params}){
    const { id } = await params;
    const messages=await GetConversationMessages({conversation_id:id})
    const accesstoken=await RefreshTokenAction()
    return (<PrivateChat messages={messages} token={accesstoken}/>)
}