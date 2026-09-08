import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env';
import { UserRole } from '../models/User';

export interface AuthPayload {
  userId: string;
  email: string;
  role: UserRole;
  registrationNo?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  try {
    let token: string | undefined;

    // Check Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Authentication required. No token provided.',
      });
      return;
    }

    const decoded = jwt.verify(token, ENV.JWT_ACCESS_SECRET) as AuthPayload;
    req.user = decoded;
    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      res.status(401).json({
        success: false,
        message: 'Token expired. Please refresh your token or login again.',
        code: 'TOKEN_EXPIRED',
      });
      return;
    }
    res.status(401).json({
      success: false,
      message: 'Invalid authentication token.',
    });
  }
};

export const authorizeRoles = (roles: UserRole[] | UserRole, ...extraRoles: UserRole[]) => {
  const allowed = Array.isArray(roles) ? roles : [roles, ...extraRoles];
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized. User authentication required.',
      });
      return;
    }

    if (!allowed.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `Forbidden. Role '${req.user.role}' does not have access to this resource. Required roles: ${allowed.join(', ')}`,
      });
      return;
    }

    next();
  };
};
