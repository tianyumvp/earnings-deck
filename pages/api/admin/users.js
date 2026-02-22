// pages/api/admin/users.js
// 获取注册用户列表

import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  try {
    const sql = neon(process.env.POSTGRES_URL);
    const rows = await sql`
      SELECT 
        id, 
        email, 
        name, 
        image,
        created_at,
        updated_at
      FROM users 
      ORDER BY created_at DESC
    `;
    
    return res.status(200).json({ 
      success: true, 
      count: rows.length,
      users: rows 
    });
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch users',
      message: error.message 
    });
  }
}
