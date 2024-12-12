import { Request, Response } from 'express';

interface CustomError extends Error {
  statusCode?: number;
}

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response
): void => {
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? 'Internal Server Error' : err.message;

  console.error(`[${req.method}] ${req.path} - ${message}`);
  res.status(statusCode).json({ error: message });
};
