import { Field, InputType } from "type-graphql";

@InputType()
export class messageInput{

    @Field()
    group_id:string

    @Field()
    message:string
}