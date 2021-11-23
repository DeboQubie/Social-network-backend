import "reflect-metadata";
import postData from "../../inputs/post.inputs";
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import MyContext from "../../context";
import { Post } from "../../entities/post.entites";
import { CommentInput,SeeCommentInput } from "../../inputs/comment.inputs";
import { Comment } from "../../entities/comments.entities";


@Resolver()
export class PostResolvers{

    @Mutation(()=>Boolean)
    @Authorized()
    async post_Post(
        @Ctx() {user}:MyContext,
        @Arg("post_data") post_data:postData
    ){
        const post = await Post.create({
            content:post_data.message,
            from:user
        })

        post.save();
        console.log(post);
        return !!post;
    }

    @Query(()=>[Post])
    @Authorized()
    async seeingYourPosts(
        @Ctx() {user}:MyContext
    ){
        const post= await Post.find({where:{from:user}});
        // console.log(post.length)
        // var list_of_post_contents:String[]=[]
        // for(var i=0;i<post.length;i++){
        //     list_of_post_contents=list_of_post_contents.concat([post[i].content]);
        // }
        return post;
    }
}

@Resolver()
export class CommentsResolver{

    @Mutation(()=>String)
    @Authorized()
    async createComment(
        @Ctx() {user}:MyContext,
        @Arg("comment_data") comment_data:CommentInput
    ){
        const post = await Post.findOne({where:{id:comment_data.post_id}})
        if(!post){
            return "post does not exist";
        }

        const comment=Comment.create({
            comment_message:comment_data.comment_message,
            from_email:user.email,
            post:post
        })

        comment.save();

        return "commented successfully";
    }

    @Query(()=>[Comment])
    @Authorized()
    async seeAllComments(
        @Ctx() {user}:MyContext,
        @Arg("seeCommentInput")  see_comment_input:SeeCommentInput
    ){
        //const post = await Post.find({where:{from:user}});
        var return_value=new Comment();
        const post=await Post.findOne({where:{id:see_comment_input.post_id},relations:["from"]})
        // console.log(post);
        // console.log(post_1);

        // function check(list:Post[],data:Post){
        //     for(var i=0;i<list.length;i++){
        //         if(list[i].id==data.id){
        //             return true;
        //         }
        //     }
        //     return false;
        // }
        if(!post){
            // var map= new Map();
            // map.set("error","Post does not exist");
            // return map;
            return_value.comment_message="Post does not exist";
            return [return_value];
        }
        if(post.from.id!=user.id){
            // var map= new Map();
            // map.set("error","this is not your post");
            // return map;
            return_value.comment_message="this is not your post";
            return [return_value];
        }
        const comments=await Comment.find({where:{post:post}});
        // console.log(comments_in_Comment);
        // var comments_in_String:String[]=[];
        // for(var i=0;i<comments_in_Comment.length;i++){
        //     comments_in_String=comments_in_String.concat(comments_in_Comment[i].comment_message);
        // }
        console.log(comments);
        if(comments.length==0){
            console.log("no comments")
            return_value.comment_message="no comments";
            return [return_value];
        }

        return comments;

    }

}

