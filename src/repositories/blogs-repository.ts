import {BLogType} from "../utils/types";
import {posts} from "./posts-repository";
export const blogs = [] as BLogType[]
export const blogsRepository = {

    findBlogByID(blogID:string) {
        return blogs.find(blog => blog.id === blogID);
    },
    createBlog(body:BLogType) {
        const id = new Date().getTime().toString();
        const newBlog:BLogType = {
            id,
            name: body.name,
            description: body.description,
            websiteUrl: body.websiteUrl
        }
        return newBlog
    },
    updateBlog(blogID:string, body:BLogType) {
        const blogByID = blogs.find(blog => blog.id === blogID);
        if (blogByID) {
            blogByID.name = body.name ?? blogByID.name;
            blogByID.description = body.description ?? blogByID.description;
            blogByID.websiteUrl = body.websiteUrl ?? blogByID.websiteUrl;
            return true;
        } else {
            return false;
        }
    },
    deleteBlog(blogID:string){
        const blogIndexToDelete = blogs.findIndex(blog => blog.id === blogID);
        if (blogIndexToDelete !== -1){
            posts.splice(blogIndexToDelete, 1);
            return true
        } else {
            return false
        }
    }

}