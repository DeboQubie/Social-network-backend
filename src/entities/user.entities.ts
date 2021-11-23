import "reflect-metadata";
import { BaseEntity, BeforeInsert, Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import {Post} from "./post.entites";
import bcrypt from "bcrypt";
import { Field, ObjectType } from "type-graphql";
import { Group } from "./group.entities";

@Entity()
@ObjectType()
class User extends BaseEntity{

    @BeforeInsert()
    async hashing_password(){
        this.password=await bcrypt.hash(this.password,10);
    }

    @PrimaryGeneratedColumn()
    id:string

    @Column()
    @Field()
    name:string

    @Column({unique:true})
    @Field()
    email:string

    @Column()
    password:string

    @Column({nullable:true})     //concatinating word is AND
    @Field()
    friends:string;

    @OneToMany(_type=>Post,posts=>posts.from)
    posts:[Post]

    @Column({nullable:true})     //conctinating word is AND
    @Field()
    category:string

    // @OneToMany(_type=>Message,message=>message.to)
    // receivedMessages:[Message]

    @ManyToMany(_type=>Group)
    @JoinTable()
    groups:[Group]

}

export {User};