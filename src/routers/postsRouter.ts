import {Router, Response, Request} from "express";
import {validateAuthorization, validateErrorsMiddleware, validatePostsRequests} from "../middlewares/middlewares";
import {CodeResponsesEnum} from "../utils/utils";
import {posts, postsRepository} from "../repositories/posts-repository";
import {PostType} from "../utils/types";
import {blogs, blogsRepository} from "../repositories/blogs-repository";

export const postsRouter = Router({})


postsRouter.get('/', (req: Request, res: Response) => {
    res.send(posts).status(CodeResponsesEnum.OK_200)
});

postsRouter.get('/:id', (req:Request, res: Response) => {
    const postID = req.params.id;
    const postByID = postsRepository.findPostByID(postID);
    if (!postID || !postByID){
        res.sendStatus(CodeResponsesEnum.Not_found_404);
        return
    }
    res.status(CodeResponsesEnum.OK_200).send(postByID);
})

postsRouter.post('/', validateAuthorization, validatePostsRequests, validateErrorsMiddleware, (req: Request, res: Response) => {
    const blog = blogs.find(b=>b.id === req.body.blogId)
    if (!blog){
        return res.sendStatus(CodeResponsesEnum.Not_found_404);
    }
    const newPost:PostType = postsRepository.createPost(req.body, blog.name);
    posts.push(newPost);
    res.status(CodeResponsesEnum.Created_201).send(newPost);
});

postsRouter.put('/:id', validateAuthorization, validatePostsRequests,validateErrorsMiddleware, (req:Request, res: Response)=>{
    const postID = req.params.id;
    const isUpdated = postsRepository.updatePost(postID, req.body);

    if (isUpdated){
        const postByID = postsRepository.findPostByID(postID);
        res.status(CodeResponsesEnum.Not_content_204).send(postByID);
    } else {
        res.sendStatus(CodeResponsesEnum.Not_found_404);
        return;
    }
});

postsRouter.delete('/:id', validateAuthorization, (req:Request, res:Response)=>{
    const postID = req.params.id;
    const isDeleted = postsRepository.deletePost(postID);

    if (!postID || !isDeleted){
        res.sendStatus(404);
        return;
    }
    res.sendStatus(CodeResponsesEnum.Not_content_204);
});