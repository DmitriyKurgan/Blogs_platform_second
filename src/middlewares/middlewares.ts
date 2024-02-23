import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

export const validateBlogsRequests = [
    body('name').isString().isLength({max:15}).withMessage('Invalid name value'),
    body('description').isString().isLength({max:500}).withMessage('Invalid description value'),
    body('websiteUrl').isString().isLength({max:100})
        .withMessage('Invalid websiteUrl value')
        .matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/)
        .withMessage('Invalid websiteUrl pattern'),
];

export const validatePostsRequests = [
    body('title').isString().isLength({max:30}).withMessage('Invalid title value'),
    body('shortDescription').isString().isLength({max:100}).withMessage('Invalid shortDescription value'),
    body('content').isString().isLength({max:1000}).withMessage('Invalid content value'),
    body('blogId').isString().withMessage('Invalid blogId value'),
];

export const validateAuthorization = [
    (req: Request, res: Response, next: NextFunction) => {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.sendStatus(401);
        }

        const token = authHeader.split(' ')[1]; // Extract token from header

        const decodedToken = Buffer.from(token, 'base64').toString('utf-8'); // Decode token from base64

        if (decodedToken !== 'admin:qwerty') { // Check decoded token
            console.log('Token: ', decodedToken);
            return res.sendStatus(401);
        }

        next();
    }
];

// export const validateErrorsMiddleware = (req: Request, res: Response, next: NextFunction) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         const uniqueErrors: { [field: string]: string } = {};
//         errors.array().forEach(error => {
//             if (!uniqueErrors[error.param]) {
//                 uniqueErrors[error.param] = error.msg;
//             }
//         });
//
//         const errorMessages = Object.keys(uniqueErrors).map(field => ({
//             message: uniqueErrors[field],
//             field
//         }));
//
//         return res.status(400).json({ errorsMessages: errorMessages });
//     }
//     next();
// };

export const validateErrorsMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const error = validationResult(req)
    if (!error.isEmpty()) {
        return res.status(400).send({
            errorsMessages: error.array({onlyFirstError: true}).map((e:any) => {
                return {
                    message: e.msg,
                    field: e.param
                }
            })
        })
    }
    next()
}