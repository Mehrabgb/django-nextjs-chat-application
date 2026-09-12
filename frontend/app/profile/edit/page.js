import EditProfilePage from "@/components/profile/edit-profile";
import GetProfile from "@/data/profile/get-profile";

export default async function EditProfile(){
    const profile=await GetProfile()
    return (<EditProfilePage profile={profile[0]} has_profile={profile[1]==='created'? false : true}/>)
}