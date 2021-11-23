import "reflect-metadata";
import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity,PrimaryGeneratedColumn } from "typeorm";


@Entity()
@ObjectType()
class Message extends BaseEntity{

    @PrimaryGeneratedColumn()
    id:string

    @Column()
    group_id:string

    @Column()
    @Field()
    message:string

    @Column()
    @Field()
    from_email:string

    @CreateDateColumn()
    @Field()
    created_on:Date
}

export {Message};