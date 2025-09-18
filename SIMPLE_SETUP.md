# 🚀 Simple Google Login Setup (2 นาที)

## วิธีการทำงาน:
1. **Login ครั้งเดียว** ด้วย Google Account
2. **ใช้ AI ได้เลย** โดยไม่ต้องใส่ API Keys
3. **ไม่ต้องตั้งค่าอะไรซับซ้อน**

## ขั้นตอนเดียว:

### 1. ตั้งค่า Google OAuth (2 นาที)
```bash
# เปิดลิงก์นี้:
https://console.cloud.google.com/

# ทำตาม 4 ขั้นตอน:
1. สร้าง Project ใหม่
2. เปิด OAuth consent screen → External
3. สร้าง OAuth Client ID → Web application
4. เพิ่ม redirect URI: http://localhost:3000/api/auth/callback/google
```

### 2. Copy Credentials
```env
# ใส่ในไฟล์ .env.local
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
```

### 3. เสร็จ!
- รีสตาร์ทแอป
- Login ด้วย Google
- ใช้ AI ได้เลย

## 💡 ข้อดี:
✅ **Login ครั้งเดียว** → ใช้ AI ทั้งหมด  
✅ **ไม่ต้องจำ API Keys**  
✅ **ใช้งานง่ายเหมือน ChatGPT**  
✅ **ปลอดภัย** → เก็บข้อมูลใน database  

## 🎯 หลังจาก Login:
- เลือก AI Model ได้ (ChatGPT/Gemini/Claude/Perplexity)
- Chat ได้เลย
- เก็บประวัติการสนทนา
- ตั้งค่าส่วนตัว
