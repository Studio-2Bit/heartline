import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
  user?: any;
}

export const protect = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
    console.log('DECODED:', decoded);
    req.user = { id: decoded.userId, role: decoded.role };
    console.log('USER ID:', req.user.id);
    next();
  } catch {
    res.status(401).json({ message: 'Token invalid' });
  }
};