# 🚀 ตั้งค่า Google OAuth ใน 5 นาที

## ขั้นตอนที่ 1: เปิด Google Cloud Console
1. เปิดลิงก์นี้ในแท็บใหม่: https://console.cloud.google.com/
2. Login ด้วย Google Account ของคุณ

## ขั้นตอนที่ 2: สร้าง Project
1. คลิก **"Select a project"** ด้านบน
2. คลิก **"New Project"**
3. ตั้งชื่อ: `Ko Chatbot`
4. คลิก **"Create"**
5. รอ 30 วินาที แล้วเลือก project ที่สร้างใหม่

## ขั้นตอนที่ 3: Configure OAuth consent screen
1. ไปที่ **"APIs & Services"** > **"OAuth consent screen"**
2. เลือก **"External"**
3. กรอกข้อมูล:
   - **App name**: Ko Chatbot
   - **User support email**: [อีเมลของคุณ]
   - **Developer contact email**: [อีเมลของคุณ]
4. คลิก **"Save and Continue"** (ข้าม scopes, test users)

## ขั้นตอนที่ 4: สร้าง Credentials
1. ไปที่ **"APIs & Services"** > **"Credentials"**
2. คลิก **"+ Create Credentials"** > **"OAuth client ID"**
3. Application type: **"Web application"**
4. Name: `Ko Chatbot Web`
5. ใน **"Authorized redirect URIs"** เพิ่ม:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
6. คลิก **"Create"**
7. **Copy Client ID และ Client Secret**

## ขั้นตอนที่ 5: อัปเดต .env.local
แทนที่ในไฟล์ `.env.local`:
```env
GOOGLE_CLIENT_ID=your-actual-client-id-here
GOOGLE_CLIENT_SECRET=your-actual-client-secret-here
```

## ขั้นตอนที่ 6: Restart แอป
1. ใน terminal กด `Ctrl+C` เพื่อหยุดเซิร์ฟเวอร์
2. รัน `npm run dev` ใหม่
3. ทดสอบ Login ใน `http://localhost:3000`

✅ เสร็จแล้ว! คุณจะ Login ด้วย Google ได้จริง ๆ!
