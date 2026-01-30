# Consultation Chat (Socket.IO) — Frontend Guide

هذا الملف يشرح **شات الاستشارة (Consultation type = `chat`)** الموجود في الباكند داخل الملف:

- `src/socket/consultation.socket.js`

> ملاحظة: نفس السوكت يدعم أيضاً مكالمة WebRTC عندما يكون `consultation.type = call`، لكن هذا الملف يركّز على **الشات فقط**.

---

## 1) الاتصال (Connection)

### عنوان الاتصال
اتصل على نفس هوست الباكند (Socket.IO يقوم بالـ upgrade إلى WebSocket تلقائياً):

- `http(s)://<HOST>` (المسار الافتراضي: `/socket.io`)

> في الراوت `src/routes/socket.route.js` يتم عرض `connectionUrl` بصيغة `ws://<host>` كـ معلومات، لكن في الفرونت عادة تستخدم URL الخاص بالـ HTTP(S) مع `socket.io-client`.

### التوثيق (JWT)
الباكند يطلب JWT عند الاتصال، ويقرأه من أحد المكانين:

- `handshake.auth.token`
- أو Header: `Authorization: Bearer <token>`

إذا التوكن غير موجود/غير صحيح: ستحصل على خطأ اتصال من نوع `connect_error` على الفرونت.

### مثال اتصال (socket.io-client)

```js
import { io } from "socket.io-client";

const socket = io(process.env.NEXT_PUBLIC_API_BASE_URL, {
  transports: ["websocket"], // اختياري
  auth: {
    token: jwtToken,
  },
  // بديل:
  // extraHeaders: { Authorization: `Bearer ${jwtToken}` },
});

socket.on("connect", () => console.log("connected", socket.id));
socket.on("connect_error", (err) => console.log("connect_error", err.message));
```

---

## 2) فكرة الغُرف (Rooms)

عند الانضمام لاستشارة، السيرفر يُدخل العميل في غرفة داخلية اسمها:

- `consultation-${consultationId}`

الفرونت **لا يحتاج** لاستخدام اسم الغرفة مباشرة، فقط ينادي event `join-consultation`.

---

## 3) Events الخاصة بالشات (Consultation type = chat)

### A) `join-consultation` (Client → Server)
**الغرض**: الانضمام لغرفة الاستشارة + استلام بيانات الاستشارة + (للشات فقط) استلام تاريخ الرسائل.

**Payload**

```json
{
  "consultationId": "string"
}
```

**سلوك السيرفر**
- يتحقق أن الاستشارة موجودة.
- يتحقق من صلاحية الدخول:
  - الطالب صاحب الاستشارة، أو
  - الأستاذ المرتبط بالاستشارة (يُقارن `consultation.professor.user`)، أو
  - `admin` فقط (مسموح له الانضمام).
- يدخل العميل للغرفة، ثم:
  - يرسل للآخرين داخل الغرفة: `user-joined`
  - إذا كانت `consultation.type === "chat"`:
    - يرجع **آخر 100 رسالة** مرتبة تصاعدياً حسب `createdAt` عبر `chat-history`
  - يرسل للعميل: `joined-consultation`

**Server emits بعد الانضمام**

#### 1) `chat-history` (Server → Client) — Chat only

```json
{
  "messages": [/* ChatMessage[] */]
}
```

> الرسائل مرتبة من الأقدم للأحدث، مع `sender` populated (بدون كلمة المرور).

#### 2) `joined-consultation` (Server → Client)

```json
{
  "consultationId": "string",
  "type": "chat",
  "status": "pending|active|completed|cancelled"
}
```

#### 3) `user-joined` (Server → Others in room)

```json
{
  "userId": "string",
  "consultationId": "string"
}
```

---

### B) `leave-consultation` (Client → Server)
**الغرض**: الخروج من غرفة الاستشارة.

**Payload**

```json
{
  "consultationId": "string"
}
```

**Server emits**

#### `user-left` (Server → Others in room)

```json
{
  "userId": "string",
  "consultationId": "string"
}
```

---

### C) `send-message` (Client → Server) — Chat only
**الغرض**: إرسال رسالة داخل شات الاستشارة.

**Payload**

```json
{
  "consultationId": "string",
  "message": "string",
  "messageType": "text|image|file",
  "fileUrl": "string|null"
}
```

**ملاحظات مهمة من الكود**
- حقول مطلوبة فعلياً في الباكند:
  - `consultationId` و `message`
- حتى لو `messageType = file/image` و `fileUrl` موجود: الباكند حالياً **يرفض** إذا `message` فاضي.

**صلاحية الإرسال**
- مسموح فقط:
  - الطالب صاحب الاستشارة
  - أو الأستاذ المرتبط بالاستشارة
- **الـ admin** (حتى لو قدر يدخل الغرفة) **غير مسموح له** الإرسال حسب الكود الحالي.

**Server emits**

#### `new-message` (Server → Room)

```json
{
  "message": {/* ChatMessage populated.sender */}
}
```

**شكل ChatMessage (تقريباً)**
حسب `src/models/chatMessage.model.js`:

```json
{
  "_id": "string",
  "consultation": "string",
  "sender": {/* User (بدون password) */},
  "message": "string",
  "messageType": "text|image|file",
  "fileUrl": "string|null",
  "readAt": "date|null",
  "createdAt": "date"
}
```

---

### D) `mark-read` (Client → Server) — Chat only
**الغرض**: وضع `readAt` لرسالة معينة.

**Payload**

```json
{
  "messageId": "string"
}
```

**Server emits**

#### `message-read` (Server → Client)

```json
{
  "messageId": "string"
}
```

> ملاحظة: الباكند **لا يبث** read receipt للطرف الآخر، فقط يرد على نفس العميل الذي أرسل `mark-read`.

---

## 4) Event الأخطاء

السيرفر يستخدم event باسم `error` ويرسل:

```json
{
  "message": "string"
}
```

أمثلة للأخطاء:
- `Consultation not found`
- `Not authorized to join this consultation`
- `Missing required fields`
- `This consultation is not a chat consultation`
- `Not authorized to send messages`

> بالإضافة لذلك: أخطاء الـ JWT أثناء الاتصال تظهر غالباً كـ `connect_error` (لأنها تأتي من middleware `io.use(next(new Error(...)))`).

---

## 5) تسلسل مقترح على الفرونت (Flow)

1) إنشاء socket مع JWT
2) `emit("join-consultation", { consultationId })`
3) الاستماع:
   - `chat-history` لتحميل الرسائل
   - `new-message` لإضافة رسالة جديدة مباشرة
   - `user-joined` / `user-left` (اختياري للـ presence)
   - `error` للأخطاء
4) عند الإرسال:
   - `emit("send-message", { consultationId, message, messageType, fileUrl })`
5) عند فتح الرسالة:
   - `emit("mark-read", { messageId })`
6) عند الخروج من الشاشة:
   - `emit("leave-consultation", { consultationId })` ثم `socket.disconnect()` (حسب احتياجكم)

