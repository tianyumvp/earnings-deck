// pages/api/register.js
// 用户注册/登录 API

import { getOrCreateUser, markUserAsRegistered, getUserReports } from '../../lib/userStore';

export const config = {
  maxDuration: 10,
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET: 检查用户状态和报告历史
  if (req.method === 'GET') {
    const { email } = req.query;
    
    if (!email) {
      return res.status(400).json({ ok: false, error: 'Email required' });
    }

    const user = getOrCreateUser(email);
    
    return res.status(200).json({
      ok: true,
      user: {
        email: user.email,
        isRegistered: user.isRegistered,
        createdAt: user.createdAt,
        reportCount: user.reports.length,
      },
      reports: user.reports.slice(0, 5), // 最近5份
    });
  }

  // POST: 注册/设置密码
  if (req.method === 'POST') {
    const { email, password, action = 'register' } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ 
        ok: false, 
        error: 'Email and password required' 
      });
    }

    // 简单验证
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        ok: false, 
        error: 'Invalid email format' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        ok: false, 
        error: 'Password must be at least 6 characters' 
      });
    }

    try {
      const user = getOrCreateUser(email);

      if (action === 'register') {
        if (user.isRegistered) {
          return res.status(400).json({ 
            ok: false, 
            error: 'Account already exists. Please login.' 
          });
        }

        // 简单哈希（生产环境应该用 bcrypt）
        const passwordHash = Buffer.from(password).toString('base64');
        markUserAsRegistered(email, passwordHash);

        console.log('[Register] User registered:', email);

        return res.status(200).json({
          ok: true,
          message: 'Account created successfully!',
          user: {
            email: user.email,
            isRegistered: true,
            reportCount: user.reports.length,
          },
        });
      }

      if (action === 'login') {
        if (!user.isRegistered) {
          return res.status(400).json({ 
            ok: false, 
            error: 'Account not found. Please register.' 
          });
        }

        const passwordHash = Buffer.from(password).toString('base64');
        if (user.passwordHash !== passwordHash) {
          return res.status(401).json({ 
            ok: false, 
            error: 'Invalid password' 
          });
        }

        return res.status(200).json({
          ok: true,
          message: 'Login successful!',
          user: {
            email: user.email,
            isRegistered: true,
            reports: user.reports,
          },
        });
      }

      return res.status(400).json({ ok: false, error: 'Invalid action' });

    } catch (err) {
      console.error('[Register] Error:', err);
      return res.status(500).json({ 
        ok: false, 
        error: 'Server error' 
      });
    }
  }

  return res.status(405).json({ ok: false, error: 'Method not allowed' });
}
