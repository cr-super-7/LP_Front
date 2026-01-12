# Research API Documentation | توثيق API الأبحاث

## Base URL
```
http://localhost:5000/api/researches
```

---

## Endpoints Overview | نظرة عامة على الـ Endpoints

### Public Endpoints (لا تحتاج تسجيل دخول)
1. `GET /api/researches` - الحصول على جميع الأبحاث المعتمدة
2. `GET /api/researches/:id` - الحصول على بحث محدد

### Authenticated Endpoints (تحتاج تسجيل دخول)
3. `GET /api/researches/my` - الحصول على أبحاثي (student/instructor)
4. `POST /api/researches` - إنشاء بحث جديد (student/instructor)
5. `PUT /api/researches/:id` - تحديث بحث (student/instructor - المالك فقط)
6. `DELETE /api/researches/:id` - حذف بحث (student/instructor - المالك فقط)

---

## 1. Get All Researches | الحصول على جميع الأبحاث

### Endpoint
```
GET /api/researches
```

### Description
الحصول على قائمة بجميع الأبحاث المعتمدة فقط (لا يحتاج تسجيل دخول)

### Authentication
❌ لا يحتاج

### Query Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `researchType` | string | No | نوع البحث: `university` أو `others` |
| `department` | string | No | معرف القسم (للبحث عن أبحاث جامعة معينة) |
| `othersPlace` | string | No | معرف المكان الآخر (للبحث عن أبحاث أخرى) |

### Example Request
```javascript
// Get all approved researches
GET /api/researches

// Get university researches only
GET /api/researches?researchType=university

// Get researches for specific department
GET /api/researches?department=507f1f77bcf86cd799439011

// Get others researches
GET /api/researches?researchType=others&othersPlace=507f1f77bcf86cd799439012
```

### Response (200 OK)
```json
{
  "researches": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "researcherName": {
        "ar": "أحمد محمد",
        "en": "Ahmed Mohammed"
      },
      "title": {
        "ar": "عنوان البحث بالعربية",
        "en": "Research Title in English"
      },
      "description": {
        "ar": "وصف البحث بالعربية",
        "en": "Research description in English"
      },
      "file": "https://cloudinary.com/research-file.pdf",
      "researchType": "university",
      "department": {
        "_id": "507f1f77bcf86cd799439011",
        "name": {
          "ar": "قسم علوم الحاسب",
          "en": "Computer Science Department"
        },
        "college": {
          "_id": "507f1f77bcf86cd799439012",
          "name": {
            "ar": "كلية الهندسة",
            "en": "Engineering College"
          },
          "university": {
            "_id": "507f1f77bcf86cd799439013",
            "name": {
              "ar": "جامعة الملك سعود",
              "en": "King Saud University"
            }
          }
        }
      },
      "othersPlace": null,
      "createdBy": {
        "_id": "507f1f77bcf86cd799439014",
        "email": "researcher@example.com"
      },
      "isApproved": true,
      "createdAt": "2024-01-10T08:00:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

---

## 2. Get Research by ID | الحصول على بحث محدد

### Endpoint
```
GET /api/researches/:id
```

### Description
الحصول على بحث محدد بالمعرف (لا يحتاج تسجيل دخول، لكن الأبحاث غير المعتمدة لا تظهر إلا للمالك)

### Authentication
❌ لا يحتاج (لكن المالك يمكنه رؤية بحثه حتى لو لم يكن معتمداً)

### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | معرف البحث |

### Example Request
```javascript
GET /api/researches/507f1f77bcf86cd799439011
```

### Response (200 OK)
```json
{
  "research": {
    "_id": "507f1f77bcf86cd799439011",
    "researcherName": {
      "ar": "أحمد محمد",
      "en": "Ahmed Mohammed"
    },
    "title": {
      "ar": "عنوان البحث بالعربية",
      "en": "Research Title in English"
    },
    "description": {
      "ar": "وصف البحث بالعربية",
      "en": "Research description in English"
    },
    "file": "https://cloudinary.com/research-file.pdf",
    "researchType": "university",
    "department": {
      "_id": "507f1f77bcf86cd799439011",
      "name": {
        "ar": "قسم علوم الحاسب",
        "en": "Computer Science Department"
      }
    },
    "othersPlace": null,
    "createdBy": {
      "_id": "507f1f77bcf86cd799439014",
      "email": "researcher@example.com"
    },
    "isApproved": true,
    "createdAt": "2024-01-10T08:00:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### Error Response (404 Not Found)
```json
{
  "message": "Research not found"
}
```

### Error Response (403 Forbidden - للبحث غير المعتمد)
```json
{
  "message": "Research is pending approval"
}
```

---

## 3. Get My Researches | الحصول على أبحاثي

### Endpoint
```
GET /api/researches/my
```

### Description
الحصول على جميع الأبحاث التي أنشأها المدرس الحالي (بما فيها غير المعتمدة)

### Authentication
✅ Required - Bearer Token
- Roles: `student`, `instructor`

### Headers
```
Authorization: Bearer <token>
```

### Example Request
```javascript
fetch('http://localhost:5000/api/researches/my', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer <your-token>'
  }
})
.then(res => res.json())
.then(data => console.log(data));
```

### Response (200 OK)
```json
{
  "researches": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "researcherName": {
        "ar": "أحمد محمد",
        "en": "Ahmed Mohammed"
      },
      "title": {
        "ar": "عنوان البحث بالعربية",
        "en": "Research Title in English"
      },
      "description": {
        "ar": "وصف البحث بالعربية",
        "en": "Research description in English"
      },
      "file": "https://cloudinary.com/research-file.pdf",
      "researchType": "university",
      "department": {
        "_id": "507f1f77bcf86cd799439011",
        "name": {
          "ar": "قسم علوم الحاسب",
          "en": "Computer Science Department"
        },
        "college": {
          "_id": "507f1f77bcf86cd799439012",
          "name": {
            "ar": "كلية الهندسة",
            "en": "Engineering College"
          },
          "university": {
            "_id": "507f1f77bcf86cd799439013",
            "name": {
              "ar": "جامعة الملك سعود",
              "en": "King Saud University"
            }
          }
        }
      },
      "othersPlace": null,
      "createdBy": {
        "_id": "507f1f77bcf86cd799439014",
        "email": "researcher@example.com"
      },
      "isApproved": false,
      "createdAt": "2024-01-10T08:00:00.000Z",
      "updatedAt": "2024-01-10T08:00:00.000Z"
    },
    {
      "_id": "507f1f77bcf86cd799439012",
      "researcherName": {
        "ar": "أحمد محمد",
        "en": "Ahmed Mohammed"
      },
      "title": {
        "ar": "بحث آخر",
        "en": "Another Research"
      },
      "description": {
        "ar": "وصف البحث بالعربية",
        "en": "Research description in English"
      },
      "file": "https://cloudinary.com/research-file-2.pdf",
      "researchType": "others",
      "department": null,
      "othersPlace": {
        "_id": "507f1f77bcf86cd799439015",
        "name": {
          "ar": "معهد البحوث",
          "en": "Research Institute"
        }
      },
      "createdBy": {
        "_id": "507f1f77bcf86cd799439014",
        "email": "researcher@example.com"
      },
      "isApproved": true,
      "createdAt": "2024-01-05T08:00:00.000Z",
      "updatedAt": "2024-01-08T10:30:00.000Z"
    }
  ]
}
```

### Error Responses

#### 401 Unauthorized
```json
{
  "message": "No token, authorization denied"
}
```

#### 403 Forbidden
```json
{
  "message": "Forbidden"
}
```

---

## 4. Create Research | إنشاء بحث جديد

### Endpoint
```
POST /api/researches
```

### Description
إنشاء بحث جديد (يحتاج تسجيل دخول كـ student أو instructor)

### Authentication
✅ Required - Bearer Token
- Roles: `student`, `instructor`

### Headers
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

### Request Body (multipart/form-data)
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `file` | File | Yes | ملف البحث (PDF, DOC, DOCX, etc.) |
| `researcherName.ar` | string | Yes | اسم الباحث بالعربية |
| `researcherName.en` | string | Yes | اسم الباحث بالإنجليزية |
| `title.ar` | string | Yes | عنوان البحث بالعربية |
| `title.en` | string | Yes | عنوان البحث بالإنجليزية |
| `description.ar` | string | Yes | وصف البحث بالعربية |
| `description.en` | string | Yes | وصف البحث بالإنجليزية |
| `researchType` | string | Yes | نوع البحث: `university` أو `others` |
| `department` | string | Conditional | معرف القسم (مطلوب إذا `researchType = university`) |
| `othersPlace` | string | Conditional | معرف المكان الآخر (مطلوب إذا `researchType = others`) |

### Example Request (JavaScript/Fetch)
```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);
formData.append('researcherName.ar', 'أحمد محمد');
formData.append('researcherName.en', 'Ahmed Mohammed');
formData.append('title.ar', 'عنوان البحث بالعربية');
formData.append('title.en', 'Research Title in English');
formData.append('description.ar', 'وصف البحث بالعربية');
formData.append('description.en', 'Research description in English');
formData.append('researchType', 'university');
formData.append('department', '507f1f77bcf86cd799439011');

fetch('http://localhost:5000/api/researches', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <your-token>'
  },
  body: formData
})
.then(res => res.json())
.then(data => console.log(data));
```

### Example Request (cURL)
```bash
curl -X POST http://localhost:5000/api/researches \
  -H "Authorization: Bearer <token>" \
  -F "file=@research.pdf" \
  -F "researcherName.ar=أحمد محمد" \
  -F "researcherName.en=Ahmed Mohammed" \
  -F "title.ar=عنوان البحث بالعربية" \
  -F "title.en=Research Title in English" \
  -F "description.ar=وصف البحث بالعربية" \
  -F "description.en=Research description in English" \
  -F "researchType=university" \
  -F "department=507f1f77bcf86cd799439011"
```

### Response (201 Created)
```json
{
  "message": "Research created and pending approval",
  "research": {
    "_id": "507f1f77bcf86cd799439011",
    "researcherName": {
      "ar": "أحمد محمد",
      "en": "Ahmed Mohammed"
    },
    "title": {
      "ar": "عنوان البحث بالعربية",
      "en": "Research Title in English"
    },
    "description": {
      "ar": "وصف البحث بالعربية",
      "en": "Research description in English"
    },
    "file": "https://cloudinary.com/research-file.pdf",
    "researchType": "university",
    "department": "507f1f77bcf86cd799439011",
    "othersPlace": null,
    "createdBy": "507f1f77bcf86cd799439014",
    "isApproved": false,
    "createdAt": "2024-01-10T08:00:00.000Z",
    "updatedAt": "2024-01-10T08:00:00.000Z"
  }
}
```

### Error Responses

#### 400 Bad Request - Missing Required Fields
```json
{
  "message": "Missing required fields: researcherName, title, and description in both Arabic and English are required"
}
```

#### 400 Bad Request - Invalid researchType
```json
{
  "message": "researchType must be either \"university\" or \"others\""
}
```

#### 400 Bad Request - Missing Department
```json
{
  "message": "Department is required for university research"
}
```

#### 400 Bad Request - Missing OthersPlace
```json
{
  "message": "OthersPlace is required for others research"
}
```

#### 400 Bad Request - File Required
```json
{
  "message": "Research file is required"
}
```

#### 401 Unauthorized
```json
{
  "message": "No token, authorization denied"
}
```

#### 403 Forbidden
```json
{
  "message": "Forbidden"
}
```

---

## 5. Update Research | تحديث بحث

### Endpoint
```
PUT /api/researches/:id
```

### Description
تحديث بحث موجود (يحتاج تسجيل دخول، المالك فقط يمكنه التحديث)

### Authentication
✅ Required - Bearer Token
- Roles: `student`, `instructor`
- Must be the creator of the research

### Headers
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | معرف البحث |

### Request Body (multipart/form-data)
جميع الحقول اختيارية (يمكن تحديث بعض الحقول فقط)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `file` | File | No | ملف البحث الجديد |
| `researcherName.ar` | string | No | اسم الباحث بالعربية |
| `researcherName.en` | string | No | اسم الباحث بالإنجليزية |
| `title.ar` | string | No | عنوان البحث بالعربية |
| `title.en` | string | No | عنوان البحث بالإنجليزية |
| `description.ar` | string | No | وصف البحث بالعربية |
| `description.en` | string | No | وصف البحث بالإنجليزية |
| `researchType` | string | No | نوع البحث: `university` أو `others` |
| `department` | string | Conditional | معرف القسم (إذا `researchType = university`) |
| `othersPlace` | string | Conditional | معرف المكان الآخر (إذا `researchType = others`) |

**ملاحظة:** عند التحديث، يتم إعادة تعيين حالة الموافقة إلى `pending`

### Example Request
```javascript
const formData = new FormData();
formData.append('title.ar', 'عنوان محدث بالعربية');
formData.append('title.en', 'Updated Title in English');

fetch('http://localhost:5000/api/researches/507f1f77bcf86cd799439011', {
  method: 'PUT',
  headers: {
    'Authorization': 'Bearer <your-token>'
  },
  body: formData
})
.then(res => res.json())
.then(data => console.log(data));
```

### Response (200 OK)
```json
{
  "message": "Research updated",
  "research": {
    "_id": "507f1f77bcf86cd799439011",
    "researcherName": {
      "ar": "أحمد محمد",
      "en": "Ahmed Mohammed"
    },
    "title": {
      "ar": "عنوان محدث بالعربية",
      "en": "Updated Title in English"
    },
    "description": {
      "ar": "وصف البحث بالعربية",
      "en": "Research description in English"
    },
    "file": "https://cloudinary.com/research-file.pdf",
    "researchType": "university",
    "department": "507f1f77bcf86cd799439011",
    "isApproved": false,
    "createdAt": "2024-01-10T08:00:00.000Z",
    "updatedAt": "2024-01-15T12:00:00.000Z"
  }
}
```

### Error Responses

#### 403 Forbidden - Not Authorized
```json
{
  "message": "You are not authorized to update this research"
}
```

#### 404 Not Found
```json
{
  "message": "Research not found"
}
```

---

## 6. Delete Research | حذف بحث

### Endpoint
```
DELETE /api/researches/:id
```

### Description
حذف بحث (يحتاج تسجيل دخول، المالك فقط يمكنه الحذف)

### Authentication
✅ Required - Bearer Token
- Roles: `student`, `instructor`
- Must be the creator of the research

### Headers
```
Authorization: Bearer <token>
```

### Path Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | معرف البحث |

### Example Request
```javascript
fetch('http://localhost:5000/api/researches/507f1f77bcf86cd799439011', {
  method: 'DELETE',
  headers: {
    'Authorization': 'Bearer <your-token>'
  }
})
.then(res => res.json())
.then(data => console.log(data));
```

### Response (200 OK)
```json
{
  "message": "Research deleted"
}
```

### Error Responses

#### 403 Forbidden - Not Authorized
```json
{
  "message": "You are not authorized to delete this research"
}
```

#### 404 Not Found
```json
{
  "message": "Research not found"
}
```

---

## Data Models | نماذج البيانات

### Research Object
```typescript
interface Research {
  _id: string;
  researcherName: {
    ar: string;
    en: string;
  };
  title: {
    ar: string;
    en: string;
  };
  description: {
    ar: string;
    en: string;
  };
  file: string; // URL to the research file
  researchType: 'university' | 'others';
  department?: Department | string; // Required if researchType is 'university'
  othersPlace?: OthersPlace | string; // Required if researchType is 'others'
  createdBy: User | string;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## Error Codes | رموز الأخطاء

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created Successfully |
| 400 | Bad Request - Invalid input data |
| 401 | Unauthorized - Missing or invalid token |
| 403 | Forbidden - Not authorized to perform this action |
| 404 | Not Found - Resource doesn't exist |
| 500 | Internal Server Error |

---

## Notes | ملاحظات مهمة

1. **File Upload**: جميع طلبات إنشاء وتحديث البحث تستخدم `multipart/form-data` لرفع الملفات
2. **Approval System**: الأبحاث الجديدة تكون في حالة `pending` حتى يتم الموافقة عليها
3. **Update Behavior**: عند تحديث بحث معتمد، يتم إعادة تعيين حالة الموافقة إلى `pending`
4. **Research Types**:
   - `university`: يتطلب `department`
   - `others`: يتطلب `othersPlace`
5. **Language Fields**: جميع الحقول النصية يجب أن تحتوي على نسختين: عربية (`ar`) وإنجليزية (`en`)
6. **Authorization**: 
   - المستخدمون العاديون يرون فقط الأبحاث المعتمدة
   - المالك يمكنه رؤية بحثه حتى لو لم يكن معتمداً

---

## Example Integration (React/JavaScript) | مثال على التكامل

```javascript
// Create Research
const createResearch = async (formData, token) => {
  const response = await fetch('http://localhost:5000/api/researches', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });
  return await response.json();
};

// Get All Researches
const getResearches = async (filters = {}) => {
  const queryParams = new URLSearchParams(filters).toString();
  const response = await fetch(`http://localhost:5000/api/researches?${queryParams}`);
  return await response.json();
};

// Get Research by ID
const getResearchById = async (id) => {
  const response = await fetch(`http://localhost:5000/api/researches/${id}`);
  return await response.json();
};

// Get My Researches
const getMyResearches = async (token) => {
  const response = await fetch('http://localhost:5000/api/researches/my', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return await response.json();
};

// Update Research
const updateResearch = async (id, formData, token) => {
  const response = await fetch(`http://localhost:5000/api/researches/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });
  return await response.json();
};

// Delete Research
const deleteResearch = async (id, token) => {
  const response = await fetch(`http://localhost:5000/api/researches/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return await response.json();
};
```

---

**Last Updated**: 2024
**Version**: 1.0
