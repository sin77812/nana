// Vercel Serverless Function for User Registration
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

// Simple in-memory user storage (replace with database in production)
const users = new Map();

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  try {
    const { name, email, password } = req.body;
    
    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ 
        message: '모든 필드를 입력해주세요.' 
      });
    }
    
    if (password.length < 8) {
      return res.status(400).json({ 
        message: '비밀번호는 8자 이상이어야 합니다.' 
      });
    }
    
    // Check if user already exists
    if (users.has(email)) {
      return res.status(409).json({ 
        message: '이미 가입된 이메일입니다.' 
      });
    }
    
    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Create user
    const userId = uuidv4();
    const user = {
      id: userId,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      hashedPassword,
      createdAt: new Date().toISOString()
    };
    
    // Store user
    users.set(email, user);
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        name: user.name 
      },
      process.env.JWT_SECRET || 'nana-secret-key-change-in-production',
      { expiresIn: '24h' }
    );
    
    // Return user data (without password)
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt
    };
    
    res.status(201).json({
      message: '회원가입이 완료되었습니다.',
      user: userData,
      token
    });
    
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ 
      message: '회원가입 중 오류가 발생했습니다.' 
    });
  }
}