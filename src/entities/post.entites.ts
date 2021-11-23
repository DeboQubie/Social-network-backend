import { __Type } from "graphql";
import "reflect-metadata";
import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import {Comment} from "./comments.entities"
import {User} from "./user.entities";

@Entity()
@ObjectType()
class Post extends BaseEntity{

    @PrimaryGeneratedColumn()
    id:string

    @Column()
    @Field()
    content:string

    @ManyToOne(_type=>User,user=>user.posts,{
        cascade:true
    })
    from:User

    @OneToMany(_type=>Comment,comment=>comment.post)
    comments:[Comment]

}

export {Post};