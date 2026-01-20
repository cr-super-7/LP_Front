# Progress API Documentation

دليل شامل لجميع الـ Endpoints الخاصة بتتبع تقدم الطالب في الدروس والكورسات.

---

## نظرة عامة

نظام تتبع التقدم يسمح للطالب بـ:
- تحديث تقدمه في كل درس
- عرض تقدمه في درس معين
- عرض تقدمه في كورس كامل
- عرض ملخص شامل لتقدمه في جميع الكورسات المسجل فيها

---

## Base URL
```
/api/progress
```

---

## الـ Endpoints

### 1. تحديث تقدم الطالب في درس

```
PUT /api/progress/lesson/:lessonId
```

**الوصف:** تحديث نسبة التقدم ووقت المشاهدة لدرس معين. عند وصول التقدم إلى 100% يتم تعليم الدرس كمكتمل تلقائياً.

**المتطلبات:**
- تسجيل الدخول كـ `student`
- يجب أن يكون الطالب مسجلاً في الكورس

**Parameters:**
| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| lessonId | string | path | Yes | معرف الدرس |

**Request Body:**
```json
{
  "progress": 75,
  "watchTime": 300
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| progress | number | No | نسبة التقدم (0-100) |
| watchTime | number | No | وقت المشاهدة بالثواني |

**Response (200):**
```json
{
  "message": "Progress updated successfully",
  "progress": {
    "_id": "65f1234567890abcdef12345",
    "student": {
      "_id": "65f1234567890abcdef12346",
      "firstName": "أحمد",
      "lastName": "محمد",
      "email": "ahmed@example.com"
    },
    "course": "65f1234567890abcdef12347",
    "lesson": {
      "_id": "65f1234567890abcdef12348",
      "title": "مقدمة في البرمجة",
      "course": {
        "_id": "65f1234567890abcdef12347",
        "title": "أساسيات البرمجة"
      }
    },
    "enrollment": "65f1234567890abcdef12349",
    "progress": 75,
    "completed": false,
    "completedAt": null,
    "lastWatchedAt": "2024-01-15T10:30:00.000Z",
    "watchTime": 300,
    "createdAt": "2024-01-15T09:00:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Errors:**
| Status | Message |
|--------|---------|
| 400 | Progress must be between 0 and 100 |
| 403 | You must be enrolled in this course to track progress |
| 404 | Lesson not found |

---

### 2. عرض تقدم الطالب في درس معين

```
GET /api/progress/lesson/:lessonId
```

**الوصف:** جلب تفاصيل تقدم الطالب في درس محدد، بما في ذلك نسبة التقدم ووقت المشاهدة وحالة الإكمال.

**المتطلبات:**
- تسجيل الدخول كـ `student`
- يجب أن يكون الطالب مسجلاً في الكورس

**Parameters:**
| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| lessonId | string | path | Yes | معرف الدرس |

**Response (200):**
```json
{
  "message": "Lesson progress retrieved successfully",
  "data": {
    "lesson": {
      "_id": "65f1234567890abcdef12348",
      "title": "مقدمة في البرمجة",
      "duration": 1800,
      "order": 1,
      "course": {
        "_id": "65f1234567890abcdef12347",
        "title": "أساسيات البرمجة",
        "thumbnail": "https://example.com/thumbnail.jpg"
      }
    },
    "progress": {
      "_id": "65f1234567890abcdef12345",
      "progress": 75,
      "completed": false,
      "completedAt": null,
      "watchTime": 300,
      "watchTimeFormatted": "5m",
      "lastWatchedAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

**Response إذا لم يبدأ الدرس بعد:**
```json
{
  "message": "Lesson progress retrieved successfully",
  "data": {
    "lesson": {
      "_id": "65f1234567890abcdef12348",
      "title": "مقدمة في البرمجة",
      "duration": 1800,
      "order": 1,
      "course": {
        "_id": "65f1234567890abcdef12347",
        "title": "أساسيات البرمجة",
        "thumbnail": "https://example.com/thumbnail.jpg"
      }
    },
    "progress": {
      "progress": 0,
      "completed": false,
      "completedAt": null,
      "watchTime": 0,
      "watchTimeFormatted": "0s",
      "lastWatchedAt": null
    }
  }
}
```

**Errors:**
| Status | Message |
|--------|---------|
| 403 | You must be enrolled in this course to view progress |
| 404 | Lesson not found |

---

### 3. عرض تقدم الطالب في كورس معين

```
GET /api/progress/course/:courseId
```

**الوصف:** جلب تقدم الطالب الكامل في كورس محدد، بما في ذلك التقدم الإجمالي وتفاصيل كل درس.

**المتطلبات:**
- تسجيل الدخول
- يجب أن يكون الطالب مسجلاً في الكورس (أو admin)

**Parameters:**
| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| courseId | string | path | Yes | معرف الكورس |

**Response (200):**
```json
{
  "message": "Course progress retrieved successfully",
  "course": {
    "_id": "65f1234567890abcdef12347",
    "title": "أساسيات البرمجة"
  },
  "enrollment": {
    "enrolledAt": "2024-01-10T08:00:00.000Z",
    "status": "active"
  },
  "overallProgress": 45,
  "completedLessons": 3,
  "totalLessons": 10,
  "lessons": [
    {
      "lesson": {
        "_id": "65f1234567890abcdef12348",
        "title": "مقدمة في البرمجة",
        "duration": 1800,
        "isFree": true
      },
      "progress": {
        "progress": 100,
        "completed": true,
        "completedAt": "2024-01-12T15:00:00.000Z",
        "lastWatchedAt": "2024-01-12T15:00:00.000Z",
        "watchTime": 1800
      }
    },
    {
      "lesson": {
        "_id": "65f1234567890abcdef12349",
        "title": "المتغيرات والثوابت",
        "duration": 2400,
        "isFree": false
      },
      "progress": {
        "progress": 50,
        "completed": false,
        "completedAt": null,
        "lastWatchedAt": "2024-01-14T10:30:00.000Z",
        "watchTime": 1200
      }
    },
    {
      "lesson": {
        "_id": "65f1234567890abcdef12350",
        "title": "الحلقات التكرارية",
        "duration": 3000,
        "isFree": false
      },
      "progress": null
    }
  ]
}
```

**ملاحظة:** إذا كان `progress: null` فهذا يعني أن الطالب لم يبدأ هذا الدرس بعد.

**Errors:**
| Status | Message |
|--------|---------|
| 403 | You must be enrolled in this course to view progress |
| 404 | Course not found |

---

### 4. عرض جميع سجلات التقدم للطالب

```
GET /api/progress/my
```

**الوصف:** جلب جميع سجلات التقدم للطالب الحالي. يمكن تصفيتها حسب الكورس.

**المتطلبات:**
- تسجيل الدخول كـ `student`

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| courseId | string | No | تصفية حسب كورس معين |

**Response (200):**
```json
{
  "message": "Progress retrieved successfully",
  "progress": [
    {
      "_id": "65f1234567890abcdef12345",
      "student": "65f1234567890abcdef12346",
      "course": {
        "_id": "65f1234567890abcdef12347",
        "title": "أساسيات البرمجة",
        "thumbnail": "https://example.com/thumbnail.jpg"
      },
      "lesson": {
        "_id": "65f1234567890abcdef12348",
        "title": "مقدمة في البرمجة",
        "course": {
          "_id": "65f1234567890abcdef12347",
          "title": "أساسيات البرمجة"
        }
      },
      "enrollment": "65f1234567890abcdef12349",
      "progress": 75,
      "completed": false,
      "completedAt": null,
      "lastWatchedAt": "2024-01-15T10:30:00.000Z",
      "watchTime": 300,
      "createdAt": "2024-01-15T09:00:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

---

### 5. عرض ملخص التقدم الشامل للطالب

```
GET /api/progress/my/overall
```

**الوصف:** جلب ملخص شامل لتقدم الطالب في جميع الكورسات المسجل فيها، مع إحصائيات تفصيلية.

**المتطلبات:**
- تسجيل الدخول كـ `student`

**Response (200):**
```json
{
  "message": "Overall progress retrieved successfully",
  "data": {
    "summary": {
      "totalEnrolledCourses": 5,
      "completedCourses": 1,
      "inProgressCourses": 3,
      "notStartedCourses": 1,
      "totalLessons": 45,
      "totalCompletedLessons": 18,
      "overallProgress": 40,
      "totalWatchTime": 32400,
      "totalWatchTimeFormatted": "9h"
    },
    "courses": [
      {
        "course": {
          "_id": "65f1234567890abcdef12347",
          "title": "أساسيات البرمجة",
          "thumbnail": "https://example.com/thumbnail1.jpg",
          "category": "65f1234567890abcdef12360"
        },
        "enrolledAt": "2024-01-10T08:00:00.000Z",
        "progress": 80,
        "totalLessons": 10,
        "completedLessons": 8,
        "lessonsInProgress": 1,
        "notStartedLessons": 1,
        "watchTime": 14400,
        "watchTimeFormatted": "4h",
        "lastWatchedAt": "2024-01-15T10:30:00.000Z",
        "isCompleted": false
      },
      {
        "course": {
          "_id": "65f1234567890abcdef12351",
          "title": "تطوير تطبيقات الويب",
          "thumbnail": "https://example.com/thumbnail2.jpg",
          "category": "65f1234567890abcdef12361"
        },
        "enrolledAt": "2024-01-05T08:00:00.000Z",
        "progress": 100,
        "totalLessons": 8,
        "completedLessons": 8,
        "lessonsInProgress": 0,
        "notStartedLessons": 0,
        "watchTime": 10800,
        "watchTimeFormatted": "3h",
        "lastWatchedAt": "2024-01-08T16:00:00.000Z",
        "isCompleted": true
      },
      {
        "course": {
          "_id": "65f1234567890abcdef12352",
          "title": "قواعد البيانات",
          "thumbnail": "https://example.com/thumbnail3.jpg",
          "category": "65f1234567890abcdef12360"
        },
        "enrolledAt": "2024-01-12T08:00:00.000Z",
        "progress": 0,
        "totalLessons": 12,
        "completedLessons": 0,
        "lessonsInProgress": 0,
        "notStartedLessons": 12,
        "watchTime": 0,
        "watchTimeFormatted": "0s",
        "lastWatchedAt": null,
        "isCompleted": false
      }
    ]
  }
}
```

**شرح حقول الـ Summary:**
| Field | Description |
|-------|-------------|
| totalEnrolledCourses | إجمالي عدد الكورسات المسجل فيها |
| completedCourses | عدد الكورسات المكتملة بالكامل |
| inProgressCourses | عدد الكورسات قيد التقدم (بدأت ولم تكتمل) |
| notStartedCourses | عدد الكورسات التي لم تبدأ بعد |
| totalLessons | إجمالي عدد الدروس في جميع الكورسات |
| totalCompletedLessons | إجمالي عدد الدروس المكتملة |
| overallProgress | نسبة التقدم الإجمالية (%) |
| totalWatchTime | إجمالي وقت المشاهدة بالثواني |
| totalWatchTimeFormatted | إجمالي وقت المشاهدة بصيغة مقروءة |

**شرح حقول كل Course:**
| Field | Description |
|-------|-------------|
| course | معلومات الكورس (الاسم، الصورة، التصنيف) |
| enrolledAt | تاريخ التسجيل في الكورس |
| progress | نسبة التقدم في الكورس (%) |
| totalLessons | إجمالي دروس الكورس |
| completedLessons | الدروس المكتملة |
| lessonsInProgress | الدروس قيد التقدم |
| notStartedLessons | الدروس التي لم تبدأ |
| watchTime | وقت المشاهدة بالثواني |
| watchTimeFormatted | وقت المشاهدة بصيغة مقروءة |
| lastWatchedAt | تاريخ آخر مشاهدة |
| isCompleted | هل الكورس مكتمل بالكامل |

---

## تنسيق وقت المشاهدة

وقت المشاهدة يُعرض بصيغتين:
- `watchTime`: بالثواني (number)
- `watchTimeFormatted`: صيغة مقروءة (string)

أمثلة:
| Seconds | Formatted |
|---------|-----------|
| 45 | "45s" |
| 300 | "5m" |
| 3600 | "1h" |
| 5400 | "1h 30m" |
| 7265 | "2h 1m" |

---

## سيناريوهات الاستخدام في الفرونت

### 1. صفحة مشاهدة الدرس (Video Player)
```javascript
// عند بدء المشاهدة - جلب التقدم الحالي
GET /api/progress/lesson/:lessonId

// أثناء المشاهدة - تحديث التقدم كل 30 ثانية مثلاً
PUT /api/progress/lesson/:lessonId
Body: { "progress": currentProgress, "watchTime": totalWatchTime }

// عند إكمال الدرس
PUT /api/progress/lesson/:lessonId
Body: { "progress": 100 }
```

### 2. صفحة الكورس (Course Details)
```javascript
// جلب تقدم الطالب في الكورس مع تفاصيل كل درس
GET /api/progress/course/:courseId

// عرض:
// - نسبة التقدم الإجمالية (overallProgress)
// - عدد الدروس المكتملة / الإجمالي (completedLessons / totalLessons)
// - حالة كل درس (مكتمل ✓ / قيد التقدم ○ / لم يبدأ ○)
```

### 3. صفحة "دوراتي" أو Dashboard
```javascript
// جلب ملخص شامل لجميع الكورسات
GET /api/progress/my/overall

// عرض:
// - إحصائيات عامة (summary)
// - قائمة الكورسات مع نسبة التقدم لكل واحد
// - ترتيب حسب آخر نشاط
```

### 4. Continue Learning Widget
```javascript
// جلب آخر الدروس التي شاهدها الطالب
GET /api/progress/my

// عرض آخر درس لم يكتمل للمتابعة
```

---

## ملاحظات مهمة للفرونت

1. **حساب نسبة التقدم:**
   - يتم حساب `overallProgress` للكورس كمتوسط نسب تقدم جميع الدروس
   - الدروس التي لم تبدأ تُحسب كـ 0%

2. **تحديث التقدم:**
   - يُفضل إرسال تحديث التقدم كل 30 ثانية أثناء المشاهدة
   - أرسل `progress` كنسبة مئوية من الفيديو (currentTime / duration * 100)
   - أرسل `watchTime` كإجمالي الثواني التي شاهدها الطالب

3. **حالة الإكمال:**
   - عندما يصل `progress` إلى 100، يتم تعليم الدرس كـ `completed: true` تلقائياً
   - `completedAt` يُسجل تاريخ الإكمال

4. **الترتيب:**
   - في `/my/overall`، الكورسات مرتبة حسب `lastWatchedAt` (الأحدث أولاً)
   - في `/my`، السجلات مرتبة حسب `lastWatchedAt` (الأحدث أولاً)

5. **Headers المطلوبة:**
   ```
   Authorization: Bearer <token>
   Content-Type: application/json
   ```

---

## أكواد الأخطاء

| Status Code | Description |
|-------------|-------------|
| 200 | نجاح |
| 400 | خطأ في البيانات المدخلة |
| 401 | غير مصرح (Token مفقود أو منتهي) |
| 403 | ممنوع (غير مسجل في الكورس) |
| 404 | الدرس/الكورس غير موجود |
| 500 | خطأ في السيرفر |
