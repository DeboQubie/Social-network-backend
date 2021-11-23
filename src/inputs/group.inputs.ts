import { Field, InputType } from "type-graphql";

@InputType()
export class createGroupInput{

    @Field()
    name:string

    @Field()
    users_ids:string
}

@InputType()
export class addMembersToGroupInput{

    @Field()
    group_id:String

    @Field()
    new_email_ids:string
}