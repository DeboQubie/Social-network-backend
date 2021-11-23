import { User } from "../entities/user.entities";
import { Group } from "../entities/group.entities";


export function checkUser(list:User[],data:User){
    if(list.length==0){
        return false;
    }
    for(var i=0;i<list.length;i++){
        if(list[i].id==data.id){
            return true;
        }
    }
    return false;
}

export function checkGroup(list:[Group],data:Group){
    // if(list.length==0){
    //     return false;
    // }
    for(var i=0;i<list.length;i++){
        if(list[i].id==data.id){
            return true;
        }
    }
    return false;
}