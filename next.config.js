/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // 生产构建输出配置（Vercel 会自动忽略此项）
  // output: 'export', // 如需静态导出，取消注释
  // distDir: 'dist',
  
  // 图片优化配置（静态导出时需要）
  images: {
    unoptimized: true,
  },
  
  // 环境变量公开前缀
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  },
};

module.exports = nextConfig;
