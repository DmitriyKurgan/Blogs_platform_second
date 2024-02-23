import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

export const validateBlogsRequests = [
    body('name').isString().isLength({max:15}).withMessage('Invalid name value'),
    body('description').isString().isLength({max:500}).withMessage('Invalid description value'),
    body('websiteUrl').isString().isLength({max:100})
        .withMessage('Invalid websiteUrl value')
        .matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/)
        .withMessage('Invalid websiteUrl pattern'),
//TODO check
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map((error: any) => ({
                message: error.msg,
                field: error.param
            }));
            return res.status(400).json({ errorsMessages: errorMessages });
        }
        next();
    }
];

export const validatePostsRequests = [
    body('title').isString().isLength({max:30}).withMessage('Invalid name value'),
    body('shortDescription').isString().isLength({max:100}).withMessage('Invalid description value'),
    body('content').isString().isLength({max:1000}),
    body('blogId').isString(),

    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map((error: any) => ({
                message: error.msg,
                field: error.param
            }));
            return res.status(400).json({ errorsMessages: errorMessages });
        }
        next();
    }
];

export const validateAuthorization = [
    (req: Request, res: Response, next: NextFunction) => {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.sendStatus(401);
        }

        const token = authHeader.split(' ')[1]; // Извлекаем сам токен из заголовка

        const decodedToken = Buffer.from(token, 'base64').toString('utf-8'); // Декодируем токен из base64

        if (decodedToken !== 'admin:qwerty') { // Проверяем декодированный токен
            console.log('Token: ', decodedToken);
            return res.sendStatus(401);
        }

        next();
    }
];


