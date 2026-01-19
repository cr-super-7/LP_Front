## ملخص التغييرات للفرونت

هدف التحديث: إضافة عرض وفرز “الأكثر تسجيلًا/تشغيلًا” للكورسات والدروس الخصوصية والأبحاث، مع عدّادات شعبية جديدة تُحدّث تلقائيًا.

---
### الحقول الجديدة في الـ Models (تظهر في الردود)
- الكورس `Course`: `enrollCount`, `playCount`, `purchaseCount`, `popularityScore`
- الدرس `Lesson`: `playCount`
- الدرس الخصوصي `PrivateLesson`: `bookingCount`, `viewCount`, `popularityScore`
- البحث `Research`: `viewCount`, `popularityScore`

---
### أين تُحدّث العدّادات آليًا (لا يلزم تعديل من الفرونت سوى استهلاكها)
- تسجيل الطالب في كورس: `POST /api/enrollments` → يزيد `enrollCount` ويُحدّث `popularityScore`.
- إكمال الطلب إلى `completed`: `PUT /api/orders/:id/status` (status=completed) → يزيد `purchaseCount` ويُحدّث `popularityScore` للكورسات الموجودة بالطلب.
- تقدم/مشاهدة الدرس: `PUT /api/progress/lesson/:lessonId` مع أي `progress` أو `watchTime` → يرفع `playCount` للدرس والكورس ويعيد حساب `popularityScore` للكورس.
- فتح درس خصوصي بالتفاصيل: `GET /api/private-lessons/:id` → يرفع `viewCount` ويُحدّث `popularityScore`.
- فتح بحث بالتفاصيل: `GET /api/research/:id` → يرفع `viewCount` ويُحدّث `popularityScore`.

---
### الفرز بالأكثر شعبية (استخدام query param: `?sort=popular`)
- الكورسات:
  - `GET /api/courses`
  - `GET /api/courses/teacher/my` (كورسات المعلم نفسه)
  - `GET /api/courses/category/:categoryId`
- الدروس الخصوصية:
  - `GET /api/private-lessons`
- الأبحاث:
  - `GET /api/research`

الفرز يعتمد على `popularityScore` ثم العدّادات، مع fallback إلى الأحدث.

---
### قائمة الـ Endpoints المختصرة (للسياق الكامل)
#### Courses
- إنشاء كورس (معلم): `POST /api/courses`  
  - **Response:**  
    ```json
    { "message": "Course created", "course": { "_id", "title", "description", "Teacher", "category", "courseType", "department", "othersPlace", "level", "price", "currency", "durationHours", "totalLessons", "thumbnail", "isPublished", "enrollCount", "playCount", "purchaseCount", "popularityScore", "createdAt" } }
    ```
- قائمة الكورسات (تدعم `sort=popular`): `GET /api/courses`  
  - **Response:**  
    ```json
    { "courses": [ { "_id", "title", "description", "Teacher", "category", "courseType", "department", "othersPlace", "level", "price", "currency", "durationHours", "totalLessons", "thumbnail", "isPublished", "enrollCount", "playCount", "purchaseCount", "popularityScore", "createdAt", "reviews": [ { "_id", "user", "comment", "rate", "createdAt" } ], "averageRating", "totalReviews" } ] }
    ```
- كورساتي (معلم): `GET /api/courses/teacher/my` (تدعم `sort=popular`)  
  - **Response:** نفس شكل `GET /api/courses` مع حقل `courses`.
- كورسات بفئة معينة: `GET /api/courses/category/:categoryId` (تدعم `sort=popular`)  
  - **Response:**  
    ```json
    { "message", "category", "courses": [ { ...نفس شكل الكورس بالأعلى... } ] }
    ```
- تفاصيل كورس: `GET /api/courses/:id`  
  - **Response:**  
    ```json
    { "course": { ...نفس شكل عنصر الكورس مع reviews, averageRating, totalReviews... } }
    ```
- تعديل/حذف كورس: `PUT /api/courses/:id`, `DELETE /api/courses/:id`  
  - **PUT Response:** `{ "message": "Course updated", "course": { ...نفس شكل الكورس... } }`  
  - **DELETE Response:** `{ "message": "Course deleted" }`

#### Lessons
- إنشاء/تعديل/حذف درس: نفس المسارات المعتادة (لا تعديل على الـ endpoints)، لكن `PUT /api/progress/lesson/:lessonId` يرفع العدادات.
- جلب دروس كورس: `GET /api/lessons/course/:courseId` (لا فرز شعبي، لكن بيانات اللعب تظهر).  
  - **Response:**  
    ```json
    { "lessons": [ { "_id", "course", "title", "videoUrl", "duration", "isFree", "status", "createdAt", "updatedAt", "playCount", "reviews": [ { "_id", "user", "comment", "rate", "createdAt" } ], "averageRating", "totalReviews" } ] }
    ```
- تفاصيل درس: `GET /api/lessons/:id`  
  - **Response:**  
    ```json
    { "lesson": { "_id", "course", "title", "videoUrl", "duration", "isFree", "status", "createdAt", "updatedAt", "playCount", "reviews": [ ... ], "averageRating", "totalReviews" } }
    ```

#### Enrollments
- تسجيل في كورس (يرفع العدادات): `POST /api/enrollments`
  - **Response:**  
    ```json
    { "message": "Successfully enrolled in course", "enrollment": { "_id", "student", "course", "status", "enrolledAt" } }
    ```
- قائمة تسجيلاتي: `GET /api/enrollments/my`  
  - **Response:**  
    ```json
    { "message": "Enrollments retrieved successfully", "enrollments": [ { "_id", "student", "course", "status", "enrolledAt" } ] }
    ```
- تفاصيل/إلغاء تسجيل:  
  - `GET /api/enrollments/:id`  
    - **Response:** `{ "message": "Enrollment retrieved successfully", "enrollment": { ... } }`  
  - `PUT /api/enrollments/:id/cancel`  
    - **Response:** `{ "message": "Enrollment cancelled successfully", "enrollment": { ... } }`

#### Orders
- إنشاء طلب: `POST /api/orders`
  - **Response:**  
    ```json
    { "message": "Order created", "order": { "_id", "user", "courses": [ { "_id", "title", "...", "enrollCount", "playCount", "purchaseCount", "popularityScore" } ], "discount", "subtotal", "totalPayment", "status", "createdAt" } }
    ```
- طلباتي: `GET /api/orders`  
  - **Response:**  
    ```json
    { "orders": [ { ...نفس شكل الطلب بالأعلى... } ] }
    ```
- تفاصيل طلب: `GET /api/orders/:id`  
  - **Response:** `{ "order": { ...نفس شكل الطلب... } }`

> ملاحظة: مسار تحديث الحالة `PUT /api/orders/:id/status` مخصص للإدمن ولن يُستخدم من الفرونت العام.

#### Private Lessons
- إنشاء/تعديل/حذف درس خصوصي (معلم): `POST /api/private-lessons`, `PUT /api/private-lessons/:id`, `DELETE /api/private-lessons/:id`
  - **POST Response:**  
    ```json
    { "message": "Private lesson created successfully (pending approval)", "privateLesson": { "_id", "instructor", "instructorName", "locationUrl", "lessonType", "department", "lessonName", "lessonLevel", "price", "currency", "courseHours", "description", "schedule", "status", "isPublished", "bookingCount", "viewCount", "popularityScore", "createdAt", "updatedAt" } }
    ```
  - **PUT Response:** `{ "message": "Private lesson updated successfully (pending approval)", "privateLesson": { ... } }`  
  - **DELETE Response:** `{ "message": "Private lesson deleted successfully" }`
- دروسي الخصوصية (معلم): `GET /api/private-lessons/my`  
  - **Response:**  
    ```json
    { "privateLessons": [ { ...نفس شكل privateLesson مع reviews, averageRating, totalReviews... } ] }
    ```
- عامة (تدعم `sort=popular`): `GET /api/private-lessons`  
  - **Response:**  
    ```json
    { "privateLessons": [ { "_id", "instructor", "instructorName", "locationUrl", "lessonType", "department", "lessonName", "lessonLevel", "price", "currency", "courseHours", "description", "schedule", "status", "isPublished", "bookingCount", "viewCount", "popularityScore", "createdAt", "updatedAt", "reviews": [ { "_id", "user", "comment", "rate", "createdAt" } ], "averageRating", "totalReviews" } ] }
    ```
- تفاصيل درس خصوصي (يزيد view/popularity): `GET /api/private-lessons/:id`  
  - **Response:**  
    ```json
    { "privateLesson": { ...نفس الحقول مع reviews, averageRating, totalReviews, bookingCount, viewCount, popularityScore... } }
    ```

#### Research
- إنشاء/تعديل/حذف بحث (طالب/معلم): `POST /api/research`, `PUT /api/research/:id`, `DELETE /api/research/:id`
- **POST Response:**  
  ```json
  { "message": "Research created and approved | Research created and pending approval", "research": { "_id", "researcherName", "title", "description", "file", "researchType", "department", "othersPlace", "createdBy", "isApproved", "approvedBy", "approvedAt", "viewCount", "popularityScore", "createdAt", "updatedAt" } }
  ```
- أبحاثي: `GET /api/research/my`  
  - **Response:**  
    ```json
    { "researches": [ { ...نفس شكل research بالأعلى... } ] }
    ```
- عامة (تدعم `sort=popular`): `GET /api/research`  
  - **Response:**  
    ```json
    { "researches": [ { ...نفس شكل research مع viewCount, popularityScore... } ] }
    ```
- تفاصيل بحث (يزيد view/popularity): `GET /api/research/:id`  
  - **Response:**  
    ```json
    { "research": { ...نفس شكل research الكامل مع viewCount, popularityScore... } }
    ```


#### Progress (رفع عدّادات التشغيل)
- تحديث تقدّم/مشاهدة درس: `PUT /api/progress/lesson/:lessonId`  
  - **Body:** `{ "progress"?: number(0-100), "watchTime"?: number(seconds) }`  
  - **Response:**  
    ```json
    { "message": "Progress updated successfully", "progress": { "_id", "student", "course", "lesson", "enrollment", "progress", "completed", "completedAt", "lastWatchedAt", "watchTime", "createdAt", "updatedAt" } }
    ```
- تقدّم كورس: `GET /api/progress/course/:courseId`  
  - **Response:**  
    ```json
    { "message": "Course progress retrieved successfully", "course": { "_id", "title" }, "enrollment": { "enrolledAt", "status" } | null, "overallProgress", "completedLessons", "totalLessons", "lessons": [ { "lesson": { "_id", "title", "duration", "isFree" }, "progress": { "progress", "completed", "completedAt", "lastWatchedAt", "watchTime" } | null } ] }
    ```
- كل تقدمي: `GET /api/progress/my`  
  - **Response:**  
    ```json
    { "message": "Progress retrieved successfully", "progress": [ { "_id", "student", "course", "lesson", "enrollment", "progress", "completed", "completedAt", "lastWatchedAt", "watchTime", "createdAt", "updatedAt" } ] }
    ```

---
### ملاحظات للفرونت
- لإظهار “الأكثر شعبية” استخدم `sort=popular` في القوائم المدعومة.
- اعرض الحقول الإضافية في الـ cards أو التفاصيل (مثلاً: عدد المسجلين، عدد المشاهدات، عدد الشراءات).
- لا توجد تغييرات مطلوبة على الـ payload أو الـ body؛ فقط استهلاك الحقول الجديدة وخيار الفرز.
