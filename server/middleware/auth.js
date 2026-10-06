import jwt from 'jsonwebtoken';
import { findUserById } from '../utils/db.js';

/**
 * Authentication middleware: verifies JWT token from Authorization header
 */
export async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. No token provided.',
      });
    }

    const token = authHeader.split(' ')[1];
    const jwtSecret = process.env.JWT_SECRET || 'campusfix_default_jwt_secret_panvel';

    let decoded;
    try {
      decoded = jwt.verify(token, jwtSecret);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired session token. Please log in again.',
      });
    }

    const user = await findUserById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User belonging to this token no longer exists.',
      });
    }

    // Attach user to request (omit passwordHash for security)
    const { passwordHash, ...safeUser } = user;
    req.user = safeUser;
    next();
  } catch (err) {
    console.error('[AUTH ERROR]', err);
    return res.status(500).json({
      success: false,
      message: 'Authentication verification failed.',
    });
  }
}

/**
 * Require specific role (e.g. 'admin' or 'student')
 */
export function requireRole(allowedRoles) {
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Requires ${roles.join(' or ')} privileges.`,
      });
    }

    next();
  };
}

export const requireAdmin = requireRole('admin');
export const requireStudent = requireRole('student');
