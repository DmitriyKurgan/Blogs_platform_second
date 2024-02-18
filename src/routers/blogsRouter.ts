import {Request, Response, Router} from "express";
import {validateRequest} from "../middlewares/middlewares";
import {BLogType} from "../utils/types";
import {CodeResponsesEnum} from "../utils/utils";
import {blogs, blogsRepository} from "../repositories/blogs-repository";

export const blogsRouter = Router({})


blogsRouter.get('/', (req: Request, res: Response)=> {
    res.send(blogs).status(CodeResponsesEnum.OK_200)
});

blogsRouter.get('/:id', (req:Request, res: Response) => {
    const blogID = req.params.id;
    const blogByID = blogsRepository.findBlogByID(blogID);

    if (!blogByID){
        res.sendStatus(CodeResponsesEnum.Not_found_404);
    }

    res.status(CodeResponsesEnum.OK_200).send(blogByID);

})

blogsRouter.post('/', validateRequest, (req:Request, res: Response) =>{
    const newBlog = blogsRepository.createBlog(req.body)
    blogs.push(newBlog)
    res.status(CodeResponsesEnum.Created_201).send(newBlog)
});

blogsRouter.put('/:id', validateRequest, (req:Request, res:Response) => {
    const blogID = req.params.id;
    const isUpdated = blogsRepository.updateBlog(blogID, req.body);

    if (isUpdated){
        const blog = blogsRepository.findBlogByID(blogID);
        res.status(CodeResponsesEnum.Not_content_204).send(blog);
    } else {
        res.sendStatus(CodeResponsesEnum.Not_found_404)
    }
});

blogsRouter.delete('/:id', (req:Request, res:Response) => {
    const blogID = req.params.id;
    const isDeleted = blogsRepository.deleteBlog(blogID);

    if(!isDeleted){
        res.sendStatus(CodeResponsesEnum.Not_found_404);
        return;
    }

    res.sendStatus(CodeResponsesEnum.Not_content_204);
})


