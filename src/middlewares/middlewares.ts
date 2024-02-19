import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

export const validateRequest = [
    body('name').isString().isLength({max:15}).withMessage('Invalid name value'),
    body('description').isString().isLength({max:500}).withMessage('Invalid description value'),
    body('websiteUrl').isString().isLength({max:100})
        .withMessage('Invalid websiteUrl value')
        .matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/)
        .withMessage('Invalid websiteUrl pattern'),

    (req: Request, res: Response, next: NextFunction) => {
        debugger
        // Проверка заголовка Authorization
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: 'Unauthorized: Missing Authorization header' });
        }

        const authData = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
        const username = authData[0];
        const password = authData[1];

        if (username !== 'admin' || password !== 'qwerty') {
            return res.status(401).json({ message: 'Unauthorized: Invalid credentials' });
        }

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
