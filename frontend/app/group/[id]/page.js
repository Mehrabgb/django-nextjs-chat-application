import GroupChat from "@/components/group/chat";
import GetConversationMessages from "@/data/chats/get-chat-messages";
import RefreshTokenAction from "@/data/tokens/refreshtoken";

export default async function Group({params}){
    const { id } = await params;
    const messages=await GetConversationMessages({conversation_id:id})
    const accesstoken=await RefreshTokenAction()
    return (<GroupChat messages={messages} token={accesstoken}/>)
}