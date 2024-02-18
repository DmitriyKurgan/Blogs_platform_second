import {BLogType} from "../utils/types";
export const posts = [] as BLogType[]
export const postsRepository = {

    findPostByID(postID:string) {
        return posts.find(post => post.id === postID);
    },
    createPost(blogID:string, body:{name:string, description:string, websiteUrl:string}) {
        const newPost = {
            id: blogID,
            name: body.name,
            description: body.description,
            websiteUrl: body.websiteUrl
        }
        return newPost
    },
    updatePost(postID:string, body:{name:string, description:string, websiteUrl:string}) {
        const postByID = posts.find(post => post.id === postID);
        if (postByID) {
            postByID.name = body.name ?? postByID.name;
            postByID.description = body.description ?? postByID.description;
            postByID.websiteUrl = body.websiteUrl ?? postByID.websiteUrl;
            return true;
        } else {
            return false;
        }
    },
    deletePost(postID:string){
        const postIndexToDelete = posts.findIndex(post => post.id === postID);
        if (postIndexToDelete !== -1){
            posts.splice(postIndexToDelete, 1);
            return true
        } else {
            return false
        }

    }

}