import { __Type } from "graphql";
import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Post } from "./post.entites";

@Entity()
@ObjectType()
export class Comment extends BaseEntity{

    @PrimaryGeneratedColumn()
    id:String

    @Column()
    @Field()
    comment_message:String

    @Column()
    @Field()
    from_email:String

    @ManyToOne(_type=>Post,post=>post.comments,{
        cascade:true
    })
    post:Post
}
