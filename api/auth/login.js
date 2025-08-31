// Vercel Serverless Function for User Login
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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
    const { email, password, rememberMe } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        message: '이메일과 비밀번호를 입력해주세요.' 
      });
    }
    
    // Get user from storage
    const user = users.get(email);
    
    if (!user) {
      return res.status(401).json({ 
        message: '이메일 또는 비밀번호가 올바르지 않습니다.' 
      });
    }
    
    // Check password
    const isValidPassword = await bcrypt.compare(password, user.hashedPassword);
    
    if (!isValidPassword) {
      return res.status(401).json({ 
        message: '이메일 또는 비밀번호가 올바르지 않습니다.' 
      });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        name: user.name 
      },
      process.env.JWT_SECRET || 'nana-secret-key-change-in-production',
      { expiresIn: rememberMe ? '30d' : '24h' }
    );
    
    // Return user data (without password)
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt
    };
    
    res.status(200).json({
      message: '로그인 성공',
      user: userData,
      token
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: '로그인 중 오류가 발생했습니다.' 
    });
  }
}

// Helper function to initialize some test users (remove in production)
export function initializeTestUsers() {
  if (users.size === 0) {
    // Add a test user (password: "test123")
    const testUser = {
      id: 'user_001',
      name: '테스트 사용자',
      email: 'test@nana.com',
      hashedPassword: '$2a$10$rOvHXG1q1tx1cF4Nxy4JhuOjl3p3CiH9v2MQs3aGl2YzYjCjMBgIS', // "test123"
      createdAt: new Date().toISOString()
    };
    users.set('test@nana.com', testUser);
  }
}

// Initialize test users
initializeTestUsers();