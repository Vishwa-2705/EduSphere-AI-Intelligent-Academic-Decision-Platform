import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { User, UserRole } from '../models/User';
import { Profile } from '../models/Profile';
import { ENV } from '../config/env';

const loginSchema = z.object({
  email: z.string().email('Invalid email address format'),
  password: z.string().min(1, 'Password is required'),
  role: z.enum(['STUDENT', 'FACULTY', 'MENTOR', 'ADMIN']).optional(),
});

const generateTokens = (userId: string, email: string, role: UserRole) => {
  const accessToken = jwt.sign(
    { userId, email, role },
    ENV.JWT_ACCESS_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { userId, email, role },
    ENV.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password, role } = loginSchema.parse(req.body);
    const cleanEmail = email.trim().toLowerCase();

    console.log(`[Auth] Login attempt for email: "${cleanEmail}", expected role: "${role || 'ANY'}"`);

    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      console.warn(`[Auth] User not found with email: "${cleanEmail}"`);
      res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
      return;
    }

    if (!user.isActive) {
      res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact campus administration.',
      });
      return;
    }

    // Role validation: if specific portal role was requested, ensure user role matches
    if (role && user.role !== role) {
      console.warn(`[Auth] Role mismatch for ${cleanEmail}: Account is ${user.role}, tried logging into ${role} portal.`);
      res.status(403).json({
        success: false,
        message: `Role mismatch: This account is registered as ${user.role}, not ${role}. Please select the ${user.role} tab.`,
      });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.warn(`[Auth] Password mismatch for email: "${cleanEmail}"`);
      res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
      return;
    }

    const { accessToken, refreshToken } = generateTokens(
      user._id.toString(),
      user.email,
      user.role
    );

    // Save refresh token & update last login
    user.refreshToken = refreshToken;
    user.lastLogin = new Date();
    await user.save();

    // Fetch user profile with department populated
    let profile = await Profile.findOne({ user: user._id }).populate('department');

    // Create fallback profile if missing
    if (!profile) {
      profile = await Profile.create({
        user: user._id,
        firstName: user.email.split('@')[0],
        lastName: '',
        registrationNo: `${user.role.substring(0, 3)}-${Date.now().toString().slice(-4)}`,
      });
    }

    // Set HTTP-only cookie for refresh token
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: ENV.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    console.log(`[Auth] Login successful: ${cleanEmail} (${user.role})`);

    res.status(200).json({
      success: true,
      message: `Successfully authenticated as ${user.role}`,
      data: {
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          lastLogin: user.lastLogin,
        },
        profile,
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    const profile = await Profile.findOne({ user: user._id }).populate('department');

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt,
        },
        profile: profile || null,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.body.refreshToken || req.cookies.refreshToken;

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Refresh token is required',
      });
      return;
    }

    const decoded = jwt.verify(token, ENV.JWT_REFRESH_SECRET) as {
      userId: string;
      email: string;
      role: UserRole;
    };

    const user = await User.findById(decoded.userId);
    if (!user || user.refreshToken !== token) {
      res.status(403).json({
        success: false,
        message: 'Invalid or revoked refresh token',
      });
      return;
    }

    const tokens = generateTokens(user._id.toString(), user.email, user.role);
    user.refreshToken = tokens.refreshToken;
    await user.save();

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: ENV.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      data: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
    });
  } catch (error: any) {
    res.status(403).json({
      success: false,
      message: 'Invalid or expired refresh token',
    });
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (req.user) {
      await User.findByIdAndUpdate(req.user.userId, { refreshToken: null });
    }

    res.clearCookie('refreshToken');
    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
};
