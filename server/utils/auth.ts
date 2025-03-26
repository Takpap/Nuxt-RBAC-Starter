import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import prisma from './prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'default-jwt-secret-change-in-production';
const JWT_EXPIRES_IN = '24h';

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

export async function comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(userId: number): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): { userId: number } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: number };
  } catch (error) {
    return null;
  }
}

export async function createSession(userId: number): Promise<string> {
  // Calculate expiration date (24 hours from now)
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24);
  
  // Generate JWT token
  const token = generateToken(userId);
  
  // Store session in database
  await prisma.session.create({
    data: {
      userId,
      token,
      expiresAt,
    },
  });
  
  return token;
}

export async function validateSession(token: string): Promise<{ userId: number } | null> {
  try {
    // First verify the token structure
    const decoded = verifyToken(token);
    if (!decoded) return null;
    
    // Then check if the session exists in database
    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: true },
    });
    
    // Check if session exists and is not expired
    if (!session || new Date() > session.expiresAt || !session.user.isActive) {
      return null;
    }
    
    return { userId: session.userId };
  } catch (error) {
    return null;
  }
}

export async function revokeSession(token: string): Promise<boolean> {
  try {
    await prisma.session.delete({
      where: { token },
    });
    return true;
  } catch (error) {
    return false;
  }
} 