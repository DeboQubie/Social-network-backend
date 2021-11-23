import { Field, InputType } from "type-graphql";

@InputType()
class postData{

    @Field()
    message:string

    // @Field()
    // categories:String[]
}

export default postData