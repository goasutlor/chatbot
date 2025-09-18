# 🚀 ตั้งค่า Google OAuth สำหรับ Ko Chatbot

## ขั้นตอนที่ 1: สร้าง Google Cloud Project

1. **เปิด Google Cloud Console:**
   - ไปที่: https://console.cloud.google.com/
   - ล็อกอินด้วย Google Account ของคุณ

2. **สร้าง Project ใหม่:**
   - คลิก "Select a project" ด้านบน
   - คลิก "New Project"
   - ตั้งชื่อ: `Ko Chatbot`
   - คลิก "Create"

## ขั้นตอนที่ 2: เปิดใช้งาน APIs

1. **เปิดใช้ Google+ API:**
   - ไปที่ "APIs & Services" > "Library"
   - ค้นหา "Google+ API"
   - คลิก "Enable"

## ขั้นตอนที่ 3: สร้าง OAuth Credentials

1. **ไปที่ Credentials:**
   - เลือก "APIs & Services" > "Credentials"

2. **Configure OAuth consent screen (ครั้งแรก):**
   - คลิก "Configure Consent Screen"
   - เลือก "External" (สำหรับ personal use)
   - กรอกข้อมูล:
     - App name: `Ko Chatbot`
     - User support email: [อีเมลของคุณ]
     - Developer contact email: [อีเมลของคุณ]
   - คลิก "Save and Continue"
   - ข้าม Scopes (คลิก "Save and Continue")
   - ข้าม Test users (คลิก "Save and Continue")

3. **สร้าง OAuth Client ID:**
   - กลับไปที่ "Credentials"
   - คลิก "Create Credentials" > "OAuth client ID"
   - เลือก Application type: "Web application"
   - ตั้งชื่อ: `Ko Chatbot Web`
   - ใน "Authorized redirect URIs" เพิ่ม:
     ```
     http://localhost:3000/api/auth/callback/google
     ```
   - คลิก "Create"

4. **Copy Credentials:**
   - จดบันทึก Client ID และ Client Secret ที่ได้

## ขั้นตอนที่ 4: อัปเดต .env.local

แทนที่เนื้อหาในไฟล์ `.env.local` ด้วย:

```env
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=ko-chatbot-secret-key-2024-very-secure

# Google OAuth (แทนที่ด้วยค่าจริงจาก Google Cloud Console)
GOOGLE_CLIENT_ID=your-actual-client-id-here
GOOGLE_CLIENT_SECRET=your-actual-client-secret-here

# Database
DATABASE_URL="file:./dev.db"

# LLM API Keys (ใส่ API Keys ของคุณเมื่อพร้อม)
OPENAI_API_KEY=your-openai-key-here
GOOGLE_AI_API_KEY=your-google-ai-key-here
ANTHROPIC_API_KEY=your-anthropic-key-here
PERPLEXITY_API_KEY=your-perplexity-key-here
```

## ขั้นตอนที่ 5: Restart แอป

1. หยุดเซิร์ฟเวอร์ (Ctrl+C)
2. รัน: `npm run dev`
3. เปิด: http://localhost:3000

## ✅ เสร็จแล้ว!

ตอนนี้คุณสามารถ:
- คลิก "Continue with Google"
- เลือก Google Account ของคุณ
- Login เข้าแอปได้เลย!

หลังจาก Login แล้ว คุณสามารถใส่ API Keys ของ LLM ที่ subscribe ในหน้า Settings ได้
