import { Request, Response, NextFunction } from 'express';
import { deriveSchema } from '../services/schemaService';

export const getSchema = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const schema = await deriveSchema();
    res.json(schema);
  } catch (error) {
    next(error);
  }
};
