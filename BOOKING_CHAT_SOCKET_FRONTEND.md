# Booking Chat (Student ↔ Teacher) — Backend Contract for Frontend

هذا الملف مخصص للفرونت فقط لتطبيق الشات الخاص بالحجز (Booking) عبر REST + Socket.IO.

## 1) الصلاحيات (Authorization)
- **مسموح** فقط لـ:
  - الطالب صاحب الحجز
  - المدرس صاحب الحجز (Teacher profile المرتبط بالحجز)
  - `admin` و `super_admin`
- **غير مسموح** لأي مستخدم آخر (سيظهر `403` في REST أو event `error` في Socket).

## 2) REST Endpoints
### 2.1) جلب الرسائل
- **GET** `GET /api/bookings/:bookingId/chat/messages?limit=100`
- **Headers**
  - `Authorization: Bearer <JWT>`
- **Query**
  - `limit` (اختياري) أقصى حد 200، الافتراضي 100
- **Response**
  - `{ messages: BookingChatMessage[] }` (مرتبة تصاعدياً حسب الوقت)

### 2.2) إرسال رسالة (REST)
- **POST** `POST /api/bookings/:bookingId/chat/messages`
- **Headers**
  - `Authorization: Bearer <JWT>`
  - `Content-Type: application/json`
- **Body**
  - `message` (string) مطلوب (حالياً)
  - `messageType` (اختياري) `'text' | 'image' | 'file'` (الافتراضي: `text`)
  - `fileUrl` (اختياري) رابط الملف/الصورة
- **Response**
  - `{ message: "Message sent", chatMessage: BookingChatMessage }`

> ملاحظة: الإرسال عبر Socket هو الأفضل للـ realtime، لكن REST مفيد كـ fallback أو لو احتجت إرسال بدون سوكت.

## 3) Socket.IO Connection
### 3.1) الاتصال
الاتصال هو نفس Socket.IO الأساسي في المشروع (نفس الذي يستخدم للاستشارات/الإشعارات).

**Frontend example (JS):**
```js
import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  transports: ["websocket"],
  auth: {
    token: JWT_TOKEN, // نفس JWT المستخدم في REST
  },
});

socket.on("connect", () => {
  console.log("socket connected", socket.id);
});

socket.on("connect_error", (err) => {
  console.error("socket connect_error", err.message);
});
```

### 3.2) غرف الشات (Rooms)
الغرفة مرتبطة بـ `bookingId`:
- Room internally: `booking-<bookingId>`

الفرونت لا يحتاج يعرف اسم الغرفة، فقط يستخدم events التالية.

## 4) Socket Events (Booking Chat)
### 4.1) الانضمام للشات
**Client → Server**
- Event: `join-booking-chat`
- Payload:
```js
{ bookingId: "BOOKING_ID" }
```

**Server → Client**
- Event: `joined-booking-chat`
```js
{ bookingId: "BOOKING_ID" }
```

- Event: `booking-chat-history` (آخر 100 رسالة)
```js
{ bookingId: "BOOKING_ID", messages: BookingChatMessage[] }
```

- Event: `booking-user-joined` (للطرف الآخر داخل الغرفة)
```js
{ userId: "USER_ID", bookingId: "BOOKING_ID" }
```

### 4.2) إرسال رسالة (Socket)
**Client → Server**
- Event: `booking-send-message`
- Payload:
```js
{
  bookingId: "BOOKING_ID",
  message: "Hello",
  messageType: "text",      // optional
  fileUrl: null             // optional
}
```

**Server → All in room**
- Event: `booking-new-message`
- Payload:
```js
{
  bookingId: "BOOKING_ID",
  message: BookingChatMessage
}
```

### 4.3) مغادرة الشات
**Client → Server**
- Event: `leave-booking-chat`
- Payload:
```js
{ bookingId: "BOOKING_ID" } // optional (لو لم تُرسلها سيتم استخدام آخر غرفة دخلتها)
```

**Server → Others**
- Event: `booking-user-left`
```js
{ userId: "USER_ID", bookingId: "BOOKING_ID" }
```

### 4.4) تحديد رسالة كمقروءة (اختياري)
> ملاحظة: read receipt هنا بسيط (يحفظ `readAt` بدون تتبع لكل مستخدم).

**Client → Server**
- Event: `booking-mark-read`
```js
{ messageId: "MESSAGE_ID" }
```

**Server → Client**
- Event: `booking-message-read`
```js
{ messageId: "MESSAGE_ID" }
```

### 4.5) الأخطاء
**Server → Client**
- Event: `error`
```js
{ message: "..." }
```

## 5) شكل الرسالة (BookingChatMessage)
كل رسالة ترجع بالشكل التالي تقريباً:
```js
{
  _id: "MESSAGE_ID",
  booking: "BOOKING_ID",
  sender: {
    _id: "USER_ID",
    email: "...",
    role: "student|instructor|admin|super_admin",
    // ... بقية بيانات المستخدم (بدون password)
  },
  message: "text",
  messageType: "text|image|file",
  fileUrl: null,
  readAt: null,
  createdAt: "2026-01-29T12:00:00.000Z"
}
```

## 6) Flow مقترح للفرونت
عند فتح شاشة الشات الخاصة بحجز:
1) `GET /api/bookings/:bookingId/chat/messages` لتحميل الرسائل (اختياري لو بتعتمد على history من socket).
2) اتصال Socket (مرة واحدة على مستوى التطبيق).
3) `socket.emit('join-booking-chat', { bookingId })`
4) استقبل:
   - `booking-chat-history` (history)
   - `booking-new-message` (realtime)
5) عند الإرسال:
   - `socket.emit('booking-send-message', { bookingId, message })`
6) عند الخروج من الشاشة:
   - `socket.emit('leave-booking-chat', { bookingId })`

