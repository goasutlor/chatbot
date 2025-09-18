# 🏢 Ko Chatbot Enterprise Setup

## 🎯 เป้าหมาย: ทำงานเหมือน ChatGPT/Gemini
- **Single Sign-On (SSO)** ด้วย Google Workspace
- **Auto inherit Google Account** ของทีม
- **ไม่ต้องใส่ API Keys** สำหรับ end users
- **Deploy แล้วใช้งานได้เลย**

## 🔧 Architecture สำหรับทีม:

### 1. Google Workspace SSO
```
ทีมของคุณ → Google Account → Ko Chatbot → AI APIs
```

### 2. Server-side API Management
- **Admin ตั้งค่า API Keys ครั้งเดียว**
- **ทีมใช้งานผ่าน Google Account**
- **ไม่ต้องจัดการ credentials เอง**

### 3. Usage Tracking & Limits
- **Track การใช้งานของแต่ละคน**
- **ตั้งค่า limits ต่อ user/วัน**
- **Report การใช้งาน**

## 🚀 Setup สำหรับ Enterprise:

### Step 1: Google Workspace OAuth
```bash
# ใน Google Cloud Console:
1. เลือก Organization domain ของบริษัท
2. ตั้งค่า Internal app (แทน External)
3. เพิ่ม authorized domains: your-company.com
4. Configure user consent
```

### Step 2: Environment Variables
```env
# Admin API Keys (ตั้งครั้งเดียว)
OPENAI_API_KEY=sk-your-company-key
ANTHROPIC_API_KEY=sk-ant-your-company-key
GOOGLE_AI_API_KEY=your-company-google-key
PERPLEXITY_API_KEY=pplx-your-company-key

# Google OAuth (Company)
GOOGLE_CLIENT_ID=your-company-oauth-id
GOOGLE_CLIENT_SECRET=your-company-oauth-secret

# Security
NEXTAUTH_SECRET=your-super-secure-secret
NEXTAUTH_URL=https://your-domain.com

# Usage Limits
DAILY_LIMIT_PER_USER=100
MONTHLY_BUDGET_USD=1000
```

### Step 3: Database Schema Enhancement
```sql
-- เพิ่ม tables สำหรับ enterprise
UserUsage (userId, date, model, requests, tokens)
AdminSettings (key, value)
ApiLimits (userId, model, dailyLimit, monthlyLimit)
```

### Step 4: Admin Dashboard
- **Monitor usage** ของทั้งทีม
- **Set limits** ต่อ user
- **Manage API costs**
- **View analytics**

## 🔐 Security Features:

### 1. Domain Restriction
```javascript
// เฉพาะ email @your-company.com เท่านั้น
const allowedDomains = ['your-company.com']
```

### 2. Role-based Access
```javascript
// Admin, User, Guest roles
const userRoles = {
  admin: ['manage_users', 'view_analytics', 'set_limits'],
  user: ['use_ai', 'view_history'],
  guest: ['limited_ai_access']
}
```

### 3. Audit Logging
```javascript
// Log ทุก action
AuditLog: { user, action, timestamp, details }
```

## 🚀 Deployment Options:

### 1. Vercel (Recommended)
```bash
# Enterprise plan with custom domain
vercel --prod
# your-chatbot.your-company.com
```

### 2. Docker + Cloud Run
```dockerfile
# Scale automatically
# Handle enterprise load
```

### 3. On-premises
```bash
# Full control
# Company network only
```

## 💡 User Experience:

### 1. Auto Login Flow:
```
User visits → Google SSO → Auto authenticated → Start chatting
```

### 2. No Setup Required:
- **ไม่ต้องสมัคร API Keys**
- **ไม่ต้องตั้งค่าอะไร**
- **แค่เข้าด้วย company email**

### 3. Usage Transparency:
- **แสดงการใช้งานส่วนตัว**
- **Quota remaining**
- **Monthly usage**

## 📊 Admin Features:

### 1. Dashboard:
- **Total requests/day**
- **Cost per model**
- **Top users**
- **Error rates**

### 2. Controls:
- **Set daily limits**
- **Disable models**
- **Block users**
- **Export data**

## 🎯 ขั้นตอนสำหรับคุณ:

1. **Setup Google Workspace OAuth** (15 นาที)
2. **Deploy to production** (30 นาที)
3. **Configure admin settings** (10 นาที)
4. **Invite team members** (5 นาที)

**ต้องการให้ผมช่วยตั้งค่าแบบไหนครับ?**
