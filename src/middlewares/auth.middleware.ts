import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (typeof decoded !== 'string' && 'id' in decoded) {
      res.locals.user = (decoded as JwtPayload).id
      next()
    } else {
      res.status(401).json({ message: 'Invalid token' })
    }
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' })
  }
};
