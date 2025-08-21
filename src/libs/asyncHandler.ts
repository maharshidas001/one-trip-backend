import type { Request, Response, NextFunction, RequestHandler } from 'express';

type AsyncHandlerType = (req: Request, res: Response, next: NextFunction) => Promise<any>;

export const asyncHandler = (fn: AsyncHandlerType): RequestHandler => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};