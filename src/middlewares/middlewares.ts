import { Request, Response, NextFunction } from 'express';
import {body, ValidationError, validationResult} from 'express-validator';

export const validateBlogsRequests = [
    body('name').isString().isLength({max:15}).withMessage('name is too long'),
    body('description').isString().isLength({max:500}).withMessage('description is too long'),
    body('websiteUrl').isString().isLength({max:100})
        .withMessage('website url is too long')
        .matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/)
        .withMessage('website url does not match the template'),
];

export const validatePostsRequests = [
    body('title').isString().isLength({max:30}).withMessage('Invalid title value'),
    body('shortDescription').isString().isLength({max:100}).withMessage('Invalid shortDescription value'),
    body('content').isString().isLength({max:1000}).withMessage('Invalid content value'),
    body('blogId').isString().withMessage('Invalid blogId value'),
];

// export const validateAuthorization = [
//     (req: Request, res: Response, next: NextFunction) => {
//         const authHeader = req.headers.authorization;
//         if (!authHeader) {
//             return res.sendStatus(401);
//         }
//
//         const token = authHeader.split(' ')[1]; // Extract token from header
//
//         const decodedToken = Buffer.from(token, 'base64').toString('utf-8'); // Decode token from base64
//
//         if (decodedToken !== 'admin:qwerty') { // Check decoded token
//             console.log('Token: ', decodedToken);
//             return res.sendStatus(401);
//         }
//
//         next();
//     }
// ];


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
