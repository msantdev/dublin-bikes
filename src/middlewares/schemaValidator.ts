import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const validateSchema =
  (schema: Joi.ObjectSchema) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      res.status(400).json({
        message: 'Validation error',
        errors: error.details.map((err) => err.message),
      });
    } else {
      next();
    }
  };
