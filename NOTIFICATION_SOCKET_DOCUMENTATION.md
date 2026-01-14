# Notification Socket.IO Documentation

## نظرة عامة
نظام الإشعارات في الوقت الفعلي (Real-time) عبر Socket.IO يسمح للمستخدمين بالحصول على الإشعارات فوراً عند حدوثها دون الحاجة للفحص الدوري (polling).

### الاتصال الأساسي
```javascript
import io from 'socket.io-client';

const socket = io('http://your-server-url', {
  auth: {
    token: 'your-jwt-token'
  }
});
```

### الاتصال مع Headers
```javascript
const socket = io('http://your-server-url', {
  extraHeaders: {
    Authorization: `Bearer ${token}`
  }
});
```

### معالجة الاتصال
```javascript
socket.on('connect', () => {
  console.log('Connected to notification socket');
  console.log('Socket ID:', socket.id);
});

socket.on('disconnect', (reason) => {
  console.log('Disconnected from notification socket:', reason);
  // يمكن إعادة الاتصال تلقائياً
  if (reason === 'io server disconnect') {
    socket.connect();
  }
});

socket.on('connect_error', (error) => {
  console.error('Connection error:', error.message);
  // خطأ في المصادقة أو مشكلة في الاتصال
});
```

---

## الأحداث (Events)

### 1. استقبال إشعار جديد
**Event Name:** `new-notification`

**الوصف:** يتم إرسال هذا الحدث تلقائياً عند إنشاء إشعار جديد للمستخدم المتصل.

**الاستماع:**
```javascript
socket.on('new-notification', (notification) => {
  console.log('New notification received:', notification);
  
  // تحديث قائمة الإشعارات في الواجهة
  // تحديث عداد الإشعارات غير المقروءة
  // عرض إشعار في الواجهة (Toast, Banner, etc.)
});
```

**Response Structure:**
```json
{
  "_id": "notification_id",
  "user": {
    "_id": "user_id",
    "email": "user@example.com",
    "role": "instructor"
  },
  "type": "course_approved",
  "title": {
    "ar": "تم الموافقة على الكورس",
    "en": "Course Approved"
  },
  "message": {
    "ar": "تم الموافقة على كورسك \"اسم الكورس\" من قبل الإدارة",
    "en": "Your course \"Course Name\" has been approved by the administration"
  },
  "relatedEntity": {
    "type": "course",
    "id": "course_id"
  },
  "isRead": false,
  "readAt": null,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

**مثال الاستخدام:**
```javascript
socket.on('new-notification', (notification) => {
  // إضافة الإشعار إلى قائمة الإشعارات
  setNotifications(prev => [notification, ...prev]);
  
  // تحديث العداد
  setUnreadCount(prev => prev + 1);
  
  // عرض إشعار في الواجهة
  showToast({
    title: notification.title.ar, // أو notification.title.en
    message: notification.message.ar,
    type: 'info'
  });
  
  // تشغيل صوت الإشعار (اختياري)
  playNotificationSound();
});
```

---

### 2. تحديد إشعار كمقروء
**Event Name:** `mark-notification-read`

**الوصف:** إرسال طلب لتحديد إشعار معين كمقروء.

**الإرسال:**
```javascript
socket.emit('mark-notification-read', {
  notificationId: 'notification_id'
});
```

**الاستماع للرد:**
```javascript
socket.on('notification-marked-read', (data) => {
  console.log('Notification marked as read:', data);
  // { notificationId: "...", isRead: true }
  
  // تحديث حالة الإشعار في الواجهة
  updateNotificationStatus(data.notificationId, true);
});
```

**Response Structure:**
```json
{
  "notificationId": "notification_id",
  "isRead": true
}
```

**مثال الاستخدام:**
```javascript
const markAsRead = (notificationId) => {
  socket.emit('mark-notification-read', { notificationId });
};

// الاستماع للرد
socket.on('notification-marked-read', (data) => {
  setNotifications(prev => 
    prev.map(notif => 
      notif._id === data.notificationId 
        ? { ...notif, isRead: true, readAt: new Date() }
        : notif
    )
  );
  
  // تحديث العداد
  setUnreadCount(prev => Math.max(0, prev - 1));
});
```

---

### 3. تحديد جميع الإشعارات كمقروءة
**Event Name:** `mark-all-notifications-read`

**الوصف:** إرسال طلب لتحديد جميع الإشعارات غير المقروءة كمقروءة.

**الإرسال:**
```javascript
socket.emit('mark-all-notifications-read');
```

**الاستماع للرد:**
```javascript
socket.on('all-notifications-marked-read', (data) => {
  console.log('All notifications marked as read:', data);
  // { success: true }
  
  // تحديث جميع الإشعارات في الواجهة
  markAllAsReadInUI();
});
```

**Response Structure:**
```json
{
  "success": true
}
```

**مثال الاستخدام:**
```javascript
const markAllAsRead = () => {
  socket.emit('mark-all-notifications-read');
};

// الاستماع للرد
socket.on('all-notifications-marked-read', (data) => {
  if (data.success) {
    setNotifications(prev => 
      prev.map(notif => ({ 
        ...notif, 
        isRead: true, 
        readAt: new Date() 
      }))
    );
    setUnreadCount(0);
  }
});
```

---

### 4. معالجة الأخطاء
**Event Name:** `error`

**الوصف:** يتم إرسال هذا الحدث عند حدوث خطأ في معالجة طلب Socket.

**الاستماع:**
```javascript
socket.on('error', (error) => {
  console.error('Socket error:', error);
  // { message: "Error message", error: "..." }
  
  // عرض رسالة خطأ للمستخدم
  showError(error.message);
});
```

**Response Structure:**
```json
{
  "message": "Error message",
  "error": "Detailed error information"
}
```

**مثال الاستخدام:**
```javascript
socket.on('error', (error) => {
  if (error.message.includes('mark-notification-read')) {
    console.error('Failed to mark notification as read');
  } else if (error.message.includes('mark-all-notifications-read')) {
    console.error('Failed to mark all notifications as read');
  } else {
    console.error('Unknown socket error:', error);
  }
});
```

---

## مثال كامل للاستخدام (React Hook)

```javascript
import { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';

const useNotificationSocket = (token) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!token) return;

    // إنشاء اتصال Socket
    const socket = io('http://your-server-url', {
      auth: { token },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    socketRef.current = socket;

    // معالجة الاتصال
    socket.on('connect', () => {
      console.log('Connected to notification socket');
      setIsConnected(true);
    });

    socket.on('disconnect', (reason) => {
      console.log('Disconnected:', reason);
      setIsConnected(false);
      
      if (reason === 'io server disconnect') {
        socket.connect();
      }
    });

    socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      setIsConnected(false);
    });

    // استقبال إشعار جديد
    socket.on('new-notification', (notification) => {
      console.log('New notification:', notification);
      
      // إضافة الإشعار الجديد
      setNotifications(prev => [notification, ...prev]);
      
      // تحديث العداد
      setUnreadCount(prev => prev + 1);
      
      // عرض إشعار في الواجهة (يمكن استخدام مكتبة مثل react-toastify)
      // toast.info(notification.title.ar, {
      //   description: notification.message.ar
      // });
    });

    // تأكيد تحديد إشعار كمقروء
    socket.on('notification-marked-read', (data) => {
      setNotifications(prev => 
        prev.map(notif => 
          notif._id === data.notificationId 
            ? { ...notif, isRead: true, readAt: new Date() }
            : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    });

    // تأكيد تحديد جميع الإشعارات كمقروءة
    socket.on('all-notifications-marked-read', (data) => {
      if (data.success) {
        setNotifications(prev => 
          prev.map(notif => ({ 
            ...notif, 
            isRead: true, 
            readAt: new Date() 
          }))
        );
        setUnreadCount(0);
      }
    });

    // معالجة الأخطاء
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    // تنظيف عند إلغاء التثبيت
    return () => {
      socket.disconnect();
    };
  }, [token]);

  // دالة لتحديد إشعار كمقروء
  const markAsRead = (notificationId) => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('mark-notification-read', { notificationId });
    }
  };

  // دالة لتحديد جميع الإشعارات كمقروءة
  const markAllAsRead = () => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('mark-all-notifications-read');
    }
  };

  return {
    notifications,
    unreadCount,
    isConnected,
    markAsRead,
    markAllAsRead
  };
};

export default useNotificationSocket;
```

---

## مثال كامل للاستخدام (Class Component)

```javascript
import React, { Component } from 'react';
import io from 'socket.io-client';

class NotificationSocket extends Component {
  constructor(props) {
    super(props);
    this.socket = null;
    this.state = {
      notifications: [],
      unreadCount: 0,
      isConnected: false
    };
  }

  componentDidMount() {
    this.connectSocket();
  }

  componentWillUnmount() {
    this.disconnectSocket();
  }

  connectSocket = () => {
    const { token } = this.props;

    if (!token) return;

    this.socket = io('http://your-server-url', {
      auth: { token },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    this.setupListeners();
  };

  setupListeners = () => {
    // الاتصال
    this.socket.on('connect', () => {
      console.log('Connected to notification socket');
      this.setState({ isConnected: true });
    });

    // انقطاع الاتصال
    this.socket.on('disconnect', (reason) => {
      console.log('Disconnected:', reason);
      this.setState({ isConnected: false });
      
      if (reason === 'io server disconnect') {
        this.socket.connect();
      }
    });

    // خطأ في الاتصال
    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      this.setState({ isConnected: false });
    });

    // استقبال إشعار جديد
    this.socket.on('new-notification', (notification) => {
      this.handleNewNotification(notification);
    });

    // تأكيد تحديد إشعار كمقروء
    this.socket.on('notification-marked-read', (data) => {
      this.handleNotificationMarkedRead(data);
    });

    // تأكيد تحديد جميع الإشعارات كمقروءة
    this.socket.on('all-notifications-marked-read', (data) => {
      if (data.success) {
        this.setState(prevState => ({
          notifications: prevState.notifications.map(notif => ({
            ...notif,
            isRead: true,
            readAt: new Date()
          })),
          unreadCount: 0
        }));
      }
    });

    // معالجة الأخطاء
    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  };

  handleNewNotification = (notification) => {
    this.setState(prevState => ({
      notifications: [notification, ...prevState.notifications],
      unreadCount: prevState.unreadCount + 1
    }));

    // عرض إشعار في الواجهة
    // يمكن استخدام مكتبة مثل react-toastify
  };

  handleNotificationMarkedRead = (data) => {
    this.setState(prevState => ({
      notifications: prevState.notifications.map(notif =>
        notif._id === data.notificationId
          ? { ...notif, isRead: true, readAt: new Date() }
          : notif
      ),
      unreadCount: Math.max(0, prevState.unreadCount - 1)
    }));
  };

  markAsRead = (notificationId) => {
    if (this.socket && this.socket.connected) {
      this.socket.emit('mark-notification-read', { notificationId });
    }
  };

  markAllAsRead = () => {
    if (this.socket && this.socket.connected) {
      this.socket.emit('mark-all-notifications-read');
    }
  };

  disconnectSocket = () => {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  };

  render() {
    // Render your component
    return null;
  }
}

export default NotificationSocket;
```

---

## مثال كامل للاستخدام (Vanilla JavaScript)

```javascript
class NotificationSocketManager {
  constructor(serverUrl, token) {
    this.serverUrl = serverUrl;
    this.token = token;
    this.socket = null;
    this.notifications = [];
    this.unreadCount = 0;
    this.listeners = {
      onNotification: [],
      onError: [],
      onConnect: [],
      onDisconnect: []
    };
  }

  connect() {
    this.socket = io(this.serverUrl, {
      auth: { token: this.token },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    this.setupListeners();
  }

  setupListeners() {
    // الاتصال
    this.socket.on('connect', () => {
      console.log('Connected to notification socket');
      this.listeners.onConnect.forEach(callback => callback());
    });

    // انقطاع الاتصال
    this.socket.on('disconnect', (reason) => {
      console.log('Disconnected:', reason);
      this.listeners.onDisconnect.forEach(callback => callback(reason));
      
      if (reason === 'io server disconnect') {
        this.socket.connect();
      }
    });

    // استقبال إشعار جديد
    this.socket.on('new-notification', (notification) => {
      this.notifications.unshift(notification);
      this.unreadCount++;
      
      this.listeners.onNotification.forEach(callback => {
        callback(notification, this.notifications, this.unreadCount);
      });
    });

    // تأكيد تحديد إشعار كمقروء
    this.socket.on('notification-marked-read', (data) => {
      const index = this.notifications.findIndex(n => n._id === data.notificationId);
      if (index !== -1) {
        this.notifications[index].isRead = true;
        this.notifications[index].readAt = new Date();
        this.unreadCount = Math.max(0, this.unreadCount - 1);
      }
    });

    // تأكيد تحديد جميع الإشعارات كمقروءة
    this.socket.on('all-notifications-marked-read', (data) => {
      if (data.success) {
        this.notifications.forEach(notif => {
          notif.isRead = true;
          notif.readAt = new Date();
        });
        this.unreadCount = 0;
      }
    });

    // معالجة الأخطاء
    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
      this.listeners.onError.forEach(callback => callback(error));
    });
  }

  markAsRead(notificationId) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('mark-notification-read', { notificationId });
    }
  }

  markAllAsRead() {
    if (this.socket && this.socket.connected) {
      this.socket.emit('mark-all-notifications-read');
    }
  }

  onNotification(callback) {
    this.listeners.onNotification.push(callback);
  }

  onError(callback) {
    this.listeners.onError.push(callback);
  }

  onConnect(callback) {
    this.listeners.onConnect.push(callback);
  }

  onDisconnect(callback) {
    this.listeners.onDisconnect.push(callback);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getNotifications() {
    return this.notifications;
  }

  getUnreadCount() {
    return this.unreadCount;
  }
}

// الاستخدام
const notificationManager = new NotificationSocketManager(
  'http://your-server-url',
  'your-jwt-token'
);

notificationManager.onNotification((notification, allNotifications, unreadCount) => {
  console.log('New notification:', notification);
  console.log('Total notifications:', allNotifications.length);
  console.log('Unread count:', unreadCount);
  
  // عرض إشعار في الواجهة
  showNotificationToast(notification);
});

notificationManager.onError((error) => {
  console.error('Error:', error);
});

notificationManager.connect();
```

---

## أنواع الإشعارات

جميع أنواع الإشعارات المدعومة:

### إشعارات الموافقة/الرفض من الإدارة:
- `course_approved` - تم الموافقة على الكورس
- `course_rejected` - تم رفض الكورس
- `lesson_approved` - تم الموافقة على الدرس
- `lesson_rejected` - تم رفض الدرس
- `private_lesson_approved` - تم الموافقة على الدرس الخصوصي
- `private_lesson_rejected` - تم رفض الدرس الخصوصي
- `research_approved` - تم الموافقة على البحث
- `research_rejected` - تم رفض البحث
- `advertisement_approved` - تم الموافقة على الإعلان
- `advertisement_rejected` - تم رفض الإعلان

### إشعارات من الطلاب:
- `course_review_added` - تم إضافة تقييم على الكورس
- `lesson_review_added` - تم إضافة تقييم على الدرس
- `private_lesson_booking` - تم حجز درس خصوصي/موعد
- `course_enrollment` - تم الالتحاق بكورس

### إشعارات الحجوزات:
- `booking_approved` - تم قبول الحجز (من المدرس)
- `booking_rejected` - تم رفض الحجز (من المدرس)

### إشعارات الطلبات:
- `order_created` - تم إنشاء طلب جديد
- `order_completed` - تم إكمال الطلب
- `order_cancelled` - تم إلغاء الطلب

### إشعارات الاستشارات:
- `consultation_request` - طلب استشارة جديد
- `consultation_accepted` - تم قبول الاستشارة
- `consultation_rejected` - تم رفض الاستشارة
- `consultation_started` - تم بدء الاستشارة
- `consultation_completed` - تم إكمال الاستشارة
- `consultation_cancelled` - تم إلغاء الاستشارة
- `message_received` - تم استلام رسالة في الاستشارة

### إشعارات عامة:
- `general` - إشعار عام

---

## Best Practices

### 1. إعادة الاتصال التلقائي
```javascript
const socket = io('http://your-server-url', {
  auth: { token },
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: Infinity
});
```

### 2. التحقق من حالة الاتصال
```javascript
if (socket.connected) {
  socket.emit('mark-notification-read', { notificationId });
} else {
  console.warn('Socket not connected, using REST API fallback');
  // استخدام REST API كبديل
}
```

### 3. معالجة انقطاع الاتصال
```javascript
socket.on('disconnect', (reason) => {
  if (reason === 'io server disconnect') {
    // تم قطع الاتصال من الخادم، إعادة الاتصال
    socket.connect();
  } else {
    // انقطاع طبيعي، لا حاجة لإعادة الاتصال
    console.log('Disconnected:', reason);
  }
});
```

### 4. استخدام REST API كبديل
```javascript
// إذا كان Socket غير متصل، استخدم REST API
const markAsRead = async (notificationId) => {
  if (socket.connected) {
    socket.emit('mark-notification-read', { notificationId });
  } else {
    // Fallback to REST API
    await fetch(`/api/notifications/${notificationId}/read`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` }
    });
  }
};
```

### 5. تنظيف الموارد
```javascript
useEffect(() => {
  const socket = io('http://your-server-url', { auth: { token } });
  
  // Setup listeners...
  
  return () => {
    socket.disconnect();
  };
}, [token]);
```

---

## ملاحظات مهمة

1. **المصادقة:** Socket.IO يتطلب JWT Token للمصادقة
2. **الاتصال التلقائي:** يتم إعادة الاتصال تلقائياً عند انقطاع الاتصال
3. **الإشعارات الفورية:** الإشعارات تُرسل فوراً عند إنشائها
4. **التوافق:** يمكن استخدام Socket.IO مع REST API في نفس الوقت
5. **الأداء:** Socket.IO أكثر كفاءة من Polling
6. **الموثوقية:** في حالة انقطاع Socket، يمكن استخدام REST API كبديل

---

## استكشاف الأخطاء

### المشكلة: لا يتم استقبال الإشعارات
**الحل:**
- تأكد من أن Token صحيح
- تحقق من حالة الاتصال: `socket.connected`
- تأكد من أن المستخدم متصل بالـ Socket

### المشكلة: خطأ في المصادقة
**الحل:**
- تأكد من صحة JWT Token
- تحقق من أن Token لم ينتهِ صلاحيته
- تأكد من إرسال Token بشكل صحيح

### المشكلة: انقطاع الاتصال المتكرر
**الحل:**
- تحقق من اتصال الشبكة
- تأكد من أن الخادم يعمل
- راجع إعدادات إعادة الاتصال

---

## الدعم

للمزيد من المعلومات حول Socket.IO:
- [Socket.IO Client Documentation](https://socket.io/docs/v4/client-api/)
- [Socket.IO Client Options](https://socket.io/docs/v4/client-options/)
