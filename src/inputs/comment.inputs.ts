import { Field, InputType } from "type-graphql";

@InputType()
export class CommentInput{

    @Field()
    post_id:String

    @Field()
    comment_message:String
}

@InputType()
export class SeeCommentInput{

    @Field()
    post_id:String
}