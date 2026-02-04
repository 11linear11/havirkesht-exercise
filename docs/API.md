# 🔌 مستندات API

## آدرس پایه

```
http://edu-api.havirkesht.ir
```

---

## احراز هویت (Authentication)

### ورود به سیستم

```http
POST /token
Content-Type: application/x-www-form-urlencoded
```

**پارامترها:**
| نام | نوع | توضیح |
|-----|-----|-------|
| username | string | نام کاربری |
| password | string | رمز عبور |

**پاسخ موفق (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user_id": 1,
  "role_id": 1,
  "fullname": "مدیر سیستم",
  "username": "admin"
}
```

**پاسخ خطا (401):**
```json
{
  "detail": "نام کاربری یا رمز عبور اشتباه است"
}
```

### استفاده از توکن

برای تمام درخواست‌های محافظت شده، هدر Authorization باید ارسال شود:

```http
Authorization: Bearer <access_token>
```

---

## نقش‌های کاربری

| role_id | نام نقش | دسترسی‌ها |
|---------|---------|-----------|
| 1 | ادمین | دسترسی کامل |
| 2 | پیمانکار | مدیریت قراردادها |
| 3 | کشاورز | مشاهده قراردادها |
| 4 | راننده | ثبت حمل و نقل |

---

## Endpoints

### کشاورزان (Farmers)

#### لیست کشاورزان
```http
GET /farmer/?crop_year_id={id}&sort_by=updated_at&sort_order=desc&size={size}&page={page}
Authorization: Bearer <token>
```

**پارامترهای Query:**
| نام | نوع | پیش‌فرض | توضیح |
|-----|-----|---------|-------|
| crop_year_id | integer | - | شناسه سال زراعی |
| sort_by | string | updated_at | فیلد مرتب‌سازی |
| sort_order | string | desc | ترتیب مرتب‌سازی |
| size | integer | 50 | تعداد در هر صفحه |
| page | integer | 1 | شماره صفحه |

**پاسخ:**
```json
{
  "items": [
    {
      "id": 1,
      "fullname": "علی محمدی",
      "national_code": "1234567890",
      "phone": "09121234567",
      "province_id": 1,
      "crop_year_id": 13,
      "created_at": "2026-01-15T10:30:00",
      "updated_at": "2026-01-15T10:30:00"
    }
  ],
  "total": 100,
  "page": 1,
  "size": 50,
  "pages": 2
}
```

#### دریافت کشاورز
```http
GET /farmer/{id}
Authorization: Bearer <token>
```

#### ایجاد کشاورز
```http
POST /farmer/
Authorization: Bearer <token>
Content-Type: application/json

{
  "fullname": "نام کامل",
  "national_code": "1234567890",
  "phone": "09121234567",
  "province_id": 1,
  "crop_year_id": 13
}
```

#### ویرایش کشاورز
```http
PUT /farmer/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "fullname": "نام جدید",
  "phone": "09129876543"
}
```

#### حذف کشاورز
```http
DELETE /farmer/{id}
Authorization: Bearer <token>
```

---

### استان‌ها (Provinces)

#### لیست استان‌ها
```http
GET /province/?sort_by=updated_at&sort_order=desc
Authorization: Bearer <token>
```

**پاسخ:**
```json
[
  {
    "id": 1,
    "name": "تهران",
    "code": "01",
    "created_at": "2026-01-01T00:00:00"
  }
]
```

#### ایجاد استان
```http
POST /province/
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "نام استان",
  "code": "کد"
}
```

#### ویرایش استان
```http
PUT /province/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "نام جدید"
}
```

#### حذف استان
```http
DELETE /province/{id}
Authorization: Bearer <token>
```

---

### سال زراعی (Crop Year)

#### لیست سال‌های زراعی
```http
GET /crop-year/?sort_by=updated_at&sort_order=desc
Authorization: Bearer <token>
```

**پاسخ:**
```json
[
  {
    "id": 13,
    "year": "1404-1405",
    "is_active": true,
    "start_date": "2025-03-21",
    "end_date": "2026-03-20"
  }
]
```

#### ایجاد سال زراعی
```http
POST /crop-year/
Authorization: Bearer <token>
Content-Type: application/json

{
  "year": "1405-1406",
  "start_date": "2026-03-21",
  "end_date": "2027-03-20",
  "is_active": false
}
```

---

### تعهدات (Commitments)

#### لیست تعهدات
```http
GET /commitment/?crop_year_id={id}
Authorization: Bearer <token>
```

#### ایجاد تعهد
```http
POST /commitment/
Authorization: Bearer <token>
Content-Type: application/json

{
  "farmer_id": 1,
  "crop_year_id": 13,
  "amount": 1000000,
  "description": "توضیحات"
}
```

---

### صورتحساب (Invoices)

#### لیست صورتحساب‌ها
```http
GET /invoice/?crop_year_id={id}
Authorization: Bearer <token>
```

#### ایجاد صورتحساب
```http
POST /invoice/
Authorization: Bearer <token>
Content-Type: application/json

{
  "farmer_id": 1,
  "crop_year_id": 13,
  "amount": 5000000,
  "invoice_date": "2026-02-01"
}
```

---

### گزارش‌ها (Reports)

#### گزارش کامل
```http
POST /report-full/?crop_year_id={id}
Authorization: Bearer <token>
Content-Type: application/json

{}
```

**پاسخ:**
```json
{
  "total_farmers": 150,
  "total_contracts": 120,
  "total_commitments": 80,
  "total_invoices": 45,
  "summary": {
    "total_amount": 15000000000,
    "paid_amount": 10000000000,
    "remaining": 5000000000
  }
}
```

---

### کاربران (Users)

#### لیست کاربران
```http
GET /user/
Authorization: Bearer <token>
```

#### ایجاد کاربر
```http
POST /user/
Authorization: Bearer <token>
Content-Type: application/json

{
  "username": "user1",
  "password": "password123",
  "fullname": "نام کاربر",
  "role_id": 2
}
```

#### ویرایش کاربر
```http
PUT /user/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "fullname": "نام جدید",
  "role_id": 3
}
```

#### حذف کاربر
```http
DELETE /user/{id}
Authorization: Bearer <token>
```

---

## کدهای خطا

| کد | معنی | توضیح |
|----|------|-------|
| 200 | OK | عملیات موفق |
| 201 | Created | ایجاد موفق |
| 400 | Bad Request | درخواست نامعتبر |
| 401 | Unauthorized | احراز هویت ناموفق |
| 403 | Forbidden | دسترسی غیرمجاز |
| 404 | Not Found | یافت نشد |
| 422 | Validation Error | خطای اعتبارسنجی |
| 500 | Server Error | خطای سرور |

---

## مثال کد JavaScript

```javascript
// ورود
async function login(username, password) {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);
    
    const response = await fetch('http://edu-api.havirkesht.ir/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData
    });
    
    return response.json();
}

// درخواست با توکن
async function getWithAuth(endpoint) {
    const token = localStorage.getItem('access_token');
    
    const response = await fetch(`http://edu-api.havirkesht.ir${endpoint}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    
    return response.json();
}
```

---

📅 آخرین به‌روزرسانی: فوریه ۲۰۲۶
