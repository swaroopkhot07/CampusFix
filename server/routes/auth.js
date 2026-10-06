import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { 
  findUserByEmail, 
  findUserByEnrollment, 
  findAdminByUsernameOrEmail, 
  createStudentUser 
} from '../utils/db.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

function generateToken(user) {
  const secret = process.env.JWT_SECRET || 'campusfix_default_jwt_secret_panvel';
  return jwt.sign(
    {
      userId: user.id,
      role: user.role,
      email: user.email,
    },
    secret,
    { expiresIn: '7d' }
  );
}

/**
 * POST /api/auth/register
 * Student registration endpoint
 */
router.post('/register', async (req, res) => {
  try {
    const { name, email, enrollmentNumber, password, confirmPassword, department, year } = req.body;

    // Validate required fields
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Full name is required.' });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: 'College email is required.' });
    }
    if (!enrollmentNumber || !enrollmentNumber.trim()) {
      return res.status(400).json({ success: false, message: 'Enrollment number is required.' });
    }
    if (!password) {
      return res.status(400).json({ success: false, message: 'Password is required.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Password and confirmation password do not match.' });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
    }

    // Check duplicate email
    const existingEmail = await findUserByEmail(email);
    if (existingEmail) {
      return res.status(409).json({ success: false, message: 'A student account with this email already exists.' });
    }

    // Check duplicate enrollment number
    const existingEnrollment = await findUserByEnrollment(enrollmentNumber);
    if (existingEnrollment) {
      return res.status(409).json({ success: false, message: 'A student account with this enrollment number already exists.' });
    }

    // Hash password with bcryptjs
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create student record
    const newStudent = await createStudentUser({
      name,
      email,
      enrollmentNumber,
      passwordHash,
      department: department || 'General Engineering / Arts / Science',
      year: year || '1st Year',
    });

    const token = generateToken(newStudent);

    const { passwordHash: _, ...safeUser } = newStudent;

    return res.status(201).json({
      success: true,
      message: 'Student account created successfully.',
      token,
      user: safeUser,
    });
  } catch (err) {
    console.error('[REGISTER ERROR]', err);
    return res.status(500).json({
      success: false,
      message: 'Server error during student registration. Please try again.',
    });
  }
});

/**
 * POST /api/auth/login
 * Student login endpoint
 */
router.post('/login', async (req, res) => {
  try {
    const { email, enrollmentNumber, password } = req.body;

    if (!password) {
      return res.status(400).json({ success: false, message: 'Password is required.' });
    }

    if (!email && !enrollmentNumber) {
      return res.status(400).json({
        success: false,
        message: 'Please provide either your college email or enrollment number.',
      });
    }

    let user = null;
    if (email) {
      user = await findUserByEmail(email);
    } else if (enrollmentNumber) {
      user = await findUserByEnrollment(enrollmentNumber);
    }

    if (!user || user.role !== 'student') {
      return res.status(401).json({
        success: false,
        message: 'Invalid student credentials. Please verify your email or enrollment number.',
      });
    }

    // Compare bcrypt password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please verify your password.',
      });
    }

    const token = generateToken(user);
    const { passwordHash: _, ...safeUser } = user;

    return res.json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      token,
      user: safeUser,
    });
  } catch (err) {
    console.error('[STUDENT LOGIN ERROR]', err);
    return res.status(500).json({
      success: false,
      message: 'Server error during student login.',
    });
  }
});

/**
 * POST /api/auth/admin-login
 * Admin login endpoint
 */
router.post('/admin-login', async (req, res) => {
  try {
    const { username, email, identifier, password } = req.body;
    const loginId = identifier || username || email;

    if (!loginId || !loginId.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Administrator username or email is required.',
      });
    }
    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Administrator password is required.',
      });
    }

    const admin = await findAdminByUsernameOrEmail(loginId);
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid administrative credentials.',
      });
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid administrative credentials.',
      });
    }

    const token = generateToken(admin);
    const { passwordHash: _, ...safeAdmin } = admin;

    return res.json({
      success: true,
      message: `Administrator access granted for ${admin.name}.`,
      token,
      user: safeAdmin,
    });
  } catch (err) {
    console.error('[ADMIN LOGIN ERROR]', err);
    return res.status(500).json({
      success: false,
      message: 'Server error during administrative login.',
    });
  }
});

/**
 * GET /api/auth/me
 * Retrieves current authenticated user profile
 */
router.get('/me', authenticate, async (req, res) => {
  return res.json({
    success: true,
    user: req.user,
  });
});

export default router;
