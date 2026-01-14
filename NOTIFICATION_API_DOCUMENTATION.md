# Notification API Documentation

## نظرة عامة
نظام الإشعارات يسمح للمستخدمين بالحصول على إشعارات حول الأحداث المختلفة في النظام مثل:
- موافقة/رفض الإدارة على الكورسات، الدروس الخصوصية، الأبحاث، والإعلانات
- إضافة تقييمات من الطلاب على الكورسات والدروس
- حجز دروس خصوصية أو مواعيد
- الالتحاق بكورسات

## Base URL
```
/api/notifications
```

## Authentication
جميع endpoints تتطلب مصادقة باستخدام Bearer Token في header:
```
Authorization: Bearer <token>
```

---

## Endpoints

### 1. الحصول على جميع إشعاراتي
**GET** `/api/notifications`

#### Query Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `isRead` | boolean | No | - | فلترة حسب حالة القراءة (true للقراءة، false لغير المقروءة) |
| `limit` | integer | No | 50 | عدد الإشعارات المراد استرجاعها |
| `skip` | integer | No | 0 | عدد الإشعارات المراد تخطيها (للتنقل بين الصفحات) |

#### Response
```json
{
  "notifications": [
    {
      "_id": "notification_id",
      "user": "user_id",
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
  ],
  "total": 10,
  "unreadCount": 5,
  "hasMore": false
}
```

#### Example Request
```javascript
const response = await fetch('/api/notifications?isRead=false&limit=20&skip=0', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

---

### 2. الحصول على عدد الإشعارات غير المقروءة
**GET** `/api/notifications/unread-count`

#### Response
```json
{
  "unreadCount": 5
}
```

#### Example Request
```javascript
const response = await fetch('/api/notifications/unread-count', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const data = await response.json();
console.log(data.unreadCount); // 5
```

---

### 3. تحديد إشعار كمقروء
**PUT** `/api/notifications/:id/read`

#### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | معرف الإشعار |

#### Response
```json
{
  "message": "Notification marked as read",
  "notification": {
    "_id": "notification_id",
    "isRead": true,
    "readAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Example Request
```javascript
const response = await fetch('/api/notifications/notification_id/read', {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

---

### 4. تحديد جميع الإشعارات كمقروءة
**PUT** `/api/notifications/all/read`

#### Response
```json
{
  "message": "All notifications marked as read"
}
```

#### Example Request
```javascript
const response = await fetch('/api/notifications/all/read', {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

---

### 5. حذف إشعار
**DELETE** `/api/notifications/:id`

#### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | معرف الإشعار |

#### Response
```json
{
  "message": "Notification deleted"
}
```

#### Example Request
```javascript
const response = await fetch('/api/notifications/notification_id', {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

---

### 6. حذف جميع الإشعارات
**DELETE** `/api/notifications`

#### Response
```json
{
  "message": "All notifications deleted"
}
```

#### Example Request
```javascript
const response = await fetch('/api/notifications', {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

---

## أنواع الإشعارات

### أنواع الإشعارات المتاحة:

#### إشعارات الموافقة/الرفض من الإدارة:
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

#### إشعارات من الطلاب:
- `course_review_added` - تم إضافة تقييم على الكورس
- `lesson_review_added` - تم إضافة تقييم على الدرس
- `private_lesson_booking` - تم حجز درس خصوصي/موعد
- `course_enrollment` - تم الالتحاق بكورس

#### إشعارات الحجوزات:
- `booking_approved` - تم قبول الحجز (من المدرس)
- `booking_rejected` - تم رفض الحجز (من المدرس)

#### إشعارات الطلبات:
- `order_created` - تم إنشاء طلب جديد
- `order_completed` - تم إكمال الطلب
- `order_cancelled` - تم إلغاء الطلب

#### إشعارات الاستشارات:
- `consultation_request` - طلب استشارة جديد
- `consultation_accepted` - تم قبول الاستشارة
- `consultation_rejected` - تم رفض الاستشارة
- `consultation_started` - تم بدء الاستشارة
- `consultation_completed` - تم إكمال الاستشارة
- `consultation_cancelled` - تم إلغاء الاستشارة
- `message_received` - تم استلام رسالة في الاستشارة

#### إشعارات عامة:
- `general` - إشعار عام

---

## Data Models

### Notification Object
```typescript
interface Notification {
  _id: string;
  user: string; // User ID
  type: NotificationType;
  title: {
    ar: string;
    en: string;
  };
  message: {
    ar: string;
    en: string;
  };
    relatedEntity?: {
      type: 'course' | 'lesson' | 'privateLesson' | 'research' | 'advertisement' | 'review' | 'booking' | 'enrollment' | 'consultation' | 'message' | 'order';
      id: string;
    };
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
}
```

---

## Error Responses

### 401 Unauthorized
```json
{
  "message": "Unauthorized"
}
```

### 404 Not Found
```json
{
  "message": "Notification not found"
}
```

### 500 Server Error
```json
{
  "message": "Server error",
  "error": "Error message"
}
```

---

## Example Integration

### React Hook Example
```javascript
import { useState, useEffect } from 'react';

const useNotifications = (token) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
    
    // Poll for new notifications every 30 seconds
    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 30000);

    return () => clearInterval(interval);
  }, [token]);

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications?limit=50', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await fetch('/api/notifications/unread-count', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setUnreadCount(data.unreadCount);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch('/api/notifications/all/read', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      fetchNotifications();
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      fetchNotifications();
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refresh: fetchNotifications
  };
};

export default useNotifications;
```

---

## Notes
- جميع الإشعارات تحتوي على نص بالعربية والإنجليزية
- يمكن ربط الإشعار بكيان معين (كورس، درس، إلخ) عبر `relatedEntity`
- الإشعارات مرتبة حسب تاريخ الإنشاء (الأحدث أولاً)
- يمكن استخدام `skip` و `limit` للتنقل بين الصفحات
- يوصى بفحص عدد الإشعارات غير المقروءة بشكل دوري لتحديث العداد في الواجهة
