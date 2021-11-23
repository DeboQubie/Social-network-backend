import MyContext from "../../context";
import { Message } from "../../entities/message.entities";
import { User } from "../../entities/user.entities";
import { messageInput } from "../../inputs/message.inputs";
import { Arg, Authorized, Ctx, Mutation, Query } from "type-graphql";
import { Group } from "../../entities/group.entities";
import { checkUser } from "../../utils/usefull_functions";
import { createGroupInput,addMembersToGroupInput } from "../../inputs/group.inputs";

export class MessageResolvers{

    @Mutation(()=>String)
    @Authorized()
    async createGroup(
        @Ctx() {user}:MyContext,
        @Arg("create_group_input") create_group_input:createGroupInput
    ){
        
        const id_list_of_users=[user.id].concat(create_group_input.users_ids.split(" "));
        var list_of_users:User[]=[];
        for(var i=0;i<id_list_of_users.length;i++){
            var user_to_be_added=await User.findOne({where:{id:id_list_of_users[i]}});
            if(!user_to_be_added){
                return "wrong user ids given";
            }
            list_of_users=list_of_users.concat(user_to_be_added);
        }

        const group=await Group.create({
            name:create_group_input.name,
            users:list_of_users
        })

        group.save();

        return "group created";

    }


    @Mutation(()=>String)
    @Authorized()
    async addMembersToGroup(
        @Arg("add_new_members_input") add_new_members_data:addMembersToGroupInput,
        @Ctx() {user}:MyContext
    ){
        const group=await Group.findOne({where:{id:add_new_members_data.group_id},relations:["users"]});

        if(!group){
            return "group does not exist";
        }
        if(!checkUser(group.users,user)){
            return "you do not belong to this group";
        }
        console.log(add_new_members_data.new_email_ids);
        const new_email_ids_list:String[]=add_new_members_data.new_email_ids.split(" ");
        console.log(new_email_ids_list);
        var new_members:User[]=[];
        for(var i=0;i<new_email_ids_list.length;i++){
            const user=await User.findOne({where:{email:add_new_members_data.new_email_ids.split(" ")[i]}})
            if(!user){
                return "user does not exist";
            }
            new_members=new_members.concat(user);
        }

        group.users=group.users.concat(new_members)
        group.save();
        return "Successfully added new members to your group";
    }

    @Mutation(()=>String)
    @Authorized()
    async deleteGroupByGroupId(
        @Ctx() {user}:MyContext,
        @Arg("group_id") group_id:string
    ){
        const group= await Group.findOne({where:{id:group_id},relations:["users"]});
        if(!checkUser(group!.users,user)){
            return "you do not belong to this group";
        }

        await Message.delete({group_id:group?.id});
        await Group.delete({id:group_id});
        return "group deleted";

    }

    @Mutation(()=>String)
    @Authorized()
    async sendMessage(
        @Ctx() {user}:MyContext,
        @Arg("message_data") message_input:messageInput
    ){
        
        const group= await Group.findOne({where:{id:message_input.group_id},relations:["users"]});
        if(!group){
            return "group does not exist";
        }

        if(!checkUser(group.users,user)){
            return "you do not belong to this group";
        }

        const message= await Message.create({
            group_id:group.id,
            message:message_input.message,
            from_email:user.email
        });

        message.save();

        return "message sent successfully";
    }

    @Query(()=>[Message])
    @Authorized()
    async seeMessagesInGroup(
        @Arg("group_id") group_id:string,
    ){
        const group_messages= await Message.find({where:{group_id:group_id}});
        return group_messages;
    }

    @Mutation(()=>String)
    @Authorized()
    async deleteMessageByMessageId(
        @Arg("message_id") message_id:string,
        @Ctx() {user}:MyContext
    ){
        const message=await Message.findOne({where:{id:message_id}});
        const group=await Group.findOne({where:{id:message?.group_id},relations:["users"]});
        console.log(group!.users);
        if(!checkUser(group!.users,user)){
                return "You did not send this message";
        }
        Message.delete({id:message_id});
        return "message successfully deleted";
    }
    
}