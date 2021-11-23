import MyContext from "../context";
import { AuthChecker } from "type-graphql";

const authChecker:AuthChecker<MyContext>=async ({context:{user}})=>{
        if(user) return true;
        return false;
}

export default authChecker;