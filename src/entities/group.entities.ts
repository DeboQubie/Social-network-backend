import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entities";

@Entity()
@ObjectType()
export class Group extends BaseEntity{

    @PrimaryGeneratedColumn()
    id:string

    @Column()
    @Field()
    name:string

    @ManyToMany(_type=>User)
    @JoinTable()
    users:User[]
}