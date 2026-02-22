// lib/userStore.js
// 轻量级用户存储（基于邮箱）

// 使用 Vercel KV 或简单内存存储（生产环境建议用 KV）
// 这里使用内存存储作为示例，生产环境应该使用 Redis/Vercel KV

const users = new Map(); // email -> user data

export function getOrCreateUser(email) {
  const normalizedEmail = email.toLowerCase().trim();
  
  if (!users.has(normalizedEmail)) {
    const user = {
      id: generateUserId(),
      email: normalizedEmail,
      createdAt: new Date().toISOString(),
      reports: [],
      isRegistered: false, // 是否设置了密码
    };
    users.set(normalizedEmail, user);
    console.log('[UserStore] Created user:', normalizedEmail);
  }
  
  return users.get(normalizedEmail);
}

export function getUser(email) {
  return users.get(email.toLowerCase().trim());
}

export function addReportToUser(email, report) {
  const user = getOrCreateUser(email);
  user.reports.unshift({
    ...report,
    createdAt: new Date().toISOString(),
  });
  // 只保留最近 10 份报告
  user.reports = user.reports.slice(0, 10);
  return user;
}

export function getUserReports(email) {
  const user = getUser(email);
  return user ? user.reports : [];
}

export function markUserAsRegistered(email, passwordHash) {
  const user = getUser(email);
  if (user) {
    user.isRegistered = true;
    user.passwordHash = passwordHash;
    user.registeredAt = new Date().toISOString();
  }
  return user;
}

function generateUserId() {
  return 'usr_' + Math.random().toString(36).substring(2, 15);
}

// 统计信息（用于分析）
export function getStats() {
  return {
    totalUsers: users.size,
    registeredUsers: Array.from(users.values()).filter(u => u.isRegistered).length,
    totalReports: Array.from(users.values()).reduce((sum, u) => sum + u.reports.length, 0),
  };
}
