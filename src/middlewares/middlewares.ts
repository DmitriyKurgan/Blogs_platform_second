import { Request, Response, NextFunction } from 'express';
import {body, ValidationError, validationResult} from 'express-validator';

export const validateBlogsRequests = [
    body('name').trim().isString().isLength({min: 1, max:15}).withMessage('name is too long'),
    body('description').trim().isString().isLength({min: 1,max:500}).withMessage('description is too long'),
    body('websiteUrl').trim().isString().isLength({min: 1,max:100})
        .withMessage('website url is too long')
        .matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/)
        .withMessage('website url does not match the template'),
];

export const validatePostsRequests = [
    body('title').isString().isLength({min: 1,max:30}).withMessage('Invalid title value'),
    body('shortDescription').isString().isLength({min: 1,max:100}).withMessage('Invalid shortDescription value'),
    body('content').isString().isLength({min: 1,max:1000}).withMessage('Invalid content value'),
    body('blogId').isString().withMessage('Invalid blogId value'),
];

export const validateAuthorization = (req: Request, res: Response, next: NextFunction) => {
    if (req.headers.authorization !== "Basic YWRtaW46cXdlcnR5") {
        res.sendStatus(401);
    } else {
        next();
    }
};

export const validateErrorsMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const errorFormatter = ({ msg, param }: ValidationError) => {
        return {
            message: msg,
            field: param,
        };
    };

    const result = validationResult(req).formatWith(errorFormatter);

    const idFinder = result.array().find((e) => e.field === "id");
    const deviceIdFinder = result.array().find((e) => e.field === "deviceId");

    if (idFinder || deviceIdFinder) {
        res.status(404).json({ errorsMessages: result.array() });
        return;
    }

    if (!result.isEmpty()) {
        res
            .status(400)
            .json({ errorsMessages: result.array({ onlyFirstError: true }) });
    } else {
        next();
    }
};
