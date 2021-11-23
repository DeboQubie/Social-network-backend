import dotenv from "dotenv";
import {ApolloServer} from "apollo-server";
import { buildSchema } from "type-graphql";
import { userResolvers } from "./resolvers/user/userResolvers";
import "reflect-metadata";
import { createConnection } from "typeorm";
import { Post } from "./entities/post.entites";
import {User} from "./entities/user.entities";
import { Comment } from "./entities/comments.entities";
import {Message} from "./entities/message.entities";
import jwt from "jsonwebtoken";
import authChecker from "./authchecker/authchecker.user";
import {PostResolvers,CommentsResolver} from "./resolvers/post/postResolvers";
import {MessageResolvers} from "./resolvers/message/messageResolver";
import { Group } from "./entities/group.entities";


dotenv.config();

const main= async ()=>{
    const schema=await buildSchema({resolvers:[userResolvers,PostResolvers,CommentsResolver,MessageResolvers],authChecker:authChecker});

    const server = new ApolloServer({
            schema,
            context:async ({req}:{req:any})=>{
                let user;
                console.log(req.headers);
                if(req.headers.authorization){
                    let token=req.headers.authorization;
                    const decoded:any=await jwt.verify(token!,process.env.JWT_TOKEN!);
                    user =await User.findOne({where:{email:decoded.email}});
                }
                return {user};
            }
    });

    server.listen(1000).then(({url})=>console.log(`server running in port http/localhost:${url}`)).catch((e)=>console.log(e));
}


createConnection({
    type:"postgres",
    url:process.env.DATABASE_URL,
    entities:[User,Post,Message,Comment,Group],
    synchronize:true,
    logging:true
}).then(()=>console.log("database connected")).catch((e)=>console.log(e.message));


main();