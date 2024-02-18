import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

export const validateRequest = [
    // Проверка данных запроса
    body('name').isString().isLength({max:15}).withMessage('Invalid name value'),
    body('description').isString().isLength({max:500}).withMessage('Invalid description value'),
    body('websiteUrl').isString().isLength({max:100})
        .withMessage('Invalid websiteUrl value')
        .matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/)
        .withMessage('Invalid websiteUrl pattern'),

    (req: Request, res: Response, next: NextFunction) => {
        // if (!req.user || !req.user.id) {
        //     return res.status(401).json({ message: 'Unauthorized' });
        // }
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
