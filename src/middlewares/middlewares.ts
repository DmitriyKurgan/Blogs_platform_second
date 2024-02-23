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
    body("title")
        .exists()
        .withMessage("Title is required")
        .isString()
        .withMessage("Type of title must be string")
        .trim()
        .isLength({
            min: 1,
            max: 30,
        })
        .withMessage(
            "Title length must be more than 0 and less than or equal to 30 symbols"
        ),
    body("shortDescription")
        .exists()
        .withMessage("Short description is required")
        .isString()
        .withMessage("Type of short description must be string")
        .trim()
        .isLength({
            min: 1,
            max: 100,
        })
        .withMessage(
            "Short description length must be more than 0 and less than or equal to 100 symbols"
        ),
    body("content")
        .exists()
        .withMessage("Content is required")
        .isString()
        .withMessage("Type of content must be string")
        .trim()
        .isLength({
            min: 1,
            max: 1000,
        })
        .withMessage(
            "Short description length must be more than 0 and less than or equal to 1000 symbols"
        ),
    body("content")
        .exists()
        .withMessage("Blog ID is required")
        .isString()
        .withMessage("Type of Blog ID must be string"),
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
