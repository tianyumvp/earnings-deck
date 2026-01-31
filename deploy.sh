#!/bin/bash

# BriefingDeck 一键部署脚本
set -e

echo "🚀 BriefingDeck 生产部署脚本"
echo "================================"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js 未安装${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Node.js 版本: $(node -v)${NC}"

# 安装 Vercel CLI（本地）
echo ""
echo "📦 安装 Vercel CLI..."
if ! command -v npx &> /dev/null || ! npx vercel --version &> /dev/null 2>&1; then
    npm install --save-dev vercel@latest
fi
echo -e "${GREEN}✓ Vercel CLI 就绪${NC}"

# 构建检查
echo ""
echo "🔨 构建检查..."
npm run build
echo -e "${GREEN}✓ 构建成功${NC}"

# 检查环境变量文件
echo ""
echo "🔍 检查环境变量..."
if [ ! -f ".env.production" ]; then
    echo -e "${YELLOW}⚠️ 未找到 .env.production 文件${NC}"
    echo "请创建 .env.production 文件，包含以下变量："
    cat << 'EOF'

NEXT_PUBLIC_SITE_URL=https://briefingdeck.com
N8N_WEBHOOK_URL=https://tianyumvp.app.n8n.cloud/webhook/earnings-deck
PAYMENT_PROVIDER=creem
CREEM_IS_TEST=false
CREEM_API_KEY=creem_live_xxxxxxxx
CREEM_PRODUCT_ID=prod_live_xxxxxxxx
CREEM_API_BASE=https://api.creem.io
CREEM_SEND_METADATA=true
CREEM_SEND_REQUEST_ID=true

EOF
    exit 1
fi

echo -e "${GREEN}✓ 环境变量文件存在${NC}"

# 部署确认
echo ""
echo -e "${YELLOW}⚠️ 即将部署到生产环境${NC}"
read -p "确认部署? (y/N): " confirm
if [[ $confirm != [yY] && $confirm != [yY][eE][sS] ]]; then
    echo "已取消部署"
    exit 0
fi

# 执行部署
echo ""
echo "🚀 开始部署..."
npx vercel --prod

echo ""
echo -e "${GREEN}✅ 部署完成！${NC}"
echo ""
echo "📋 部署后检查清单:"
echo "   1. 访问 https://briefingdeck.com 检查页面"
echo "   2. 测试支付流程 (建议先用测试模式)"
echo "   3. 检查 n8n Webhook 是否正常工作"
echo ""
