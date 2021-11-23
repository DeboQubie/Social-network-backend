import { IsEmail, Matches } from "class-validator";
import "reflect-metadata";
import { Field, InputType } from "type-graphql";

@InputType()
class createUserInput{

    @Field()
    name:string

    @Field()
    @IsEmail()
    email:string

    @Field()
    @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])/)
    password:string

    @Field()
    confirmPassword:string

}

@InputType()
class loginUserInput{
    
    @Field()
    email:string

    @Field()
    password:string
}

export {createUserInput,loginUserInput};