import "reflect-metadata";
import { User } from "../../entities/user.entities";
import { Resolver ,Mutation, Query, Arg, Ctx, Authorized} from "type-graphql";
import { createUserInput, loginUserInput } from "../../inputs/user.inputs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import MyContext from "src/context";

dotenv.config();

@Resolver()
export class userResolvers{

    @Mutation(()=>String)
    async createUser(
        @Arg("createUserData") createUser:createUserInput
    ){
        if(createUser.password!=createUser.confirmPassword){
            return "password and confirm password not matched";
        }
        if(await User.findOne({where:{email:createUser.email}})){
            return "Email already exists";
        }
        const user = await User.create({
            name:createUser.name,
            email:createUser.email,
            password:createUser.password,
        });

        await user.save();
        console.log(user);
        return "User created sucessfully";
    }

    @Mutation(()=>String)
    async loginUser(
        @Arg("loginData") loginUser:loginUserInput
    ){
        const user=await User.findOne({where:{email:loginUser.email}});
        if(!user){
            return "Email id does not exist";
        }

        const isVerified=bcrypt.compare(loginUser.password,user.password);
        if(!isVerified){
            return "Password does not match";
        }

        const token=jwt.sign({email:user.email},process.env.JWT_TOKEN!);
        return token;

    }

    @Query(()=>User)
    @Authorized()
    async showUser(
        @Ctx() {user}:MyContext
    ){

        return user;
    }

    @Mutation(()=>String)
    @Authorized()
    async makeFriendsByFriendEMAILs(
        @Arg("friends") friends_emails:string,
        @Ctx() {user}:MyContext
    ){
        const friends_emails_list=friends_emails.split(" ");
        for(var i=0;i<friends_emails_list.length;i++){
            var friend=await User.findOne({where:{email:friends_emails_list[i]}});
            if(!friend){
                return "user does not exist";
            }
        }
        user.friends=friends_emails;
        await user.save();

        return "Friends added";
    }

}