# 📚 مستندات فنی پروژه هاویرکشت
## سامانه کشت قراردادی چغندر قند

<div dir="rtl">

---

## 📋 فهرست مطالب

1. [معرفی پروژه](#معرفی-پروژه)
2. [معماری سیستم](#معماری-سیستم)
3. [ساختار پروژه](#ساختار-پروژه)
4. [تکنولوژی‌های استفاده شده](#تکنولوژیهای-استفاده-شده)
5. [سیستم احراز هویت](#سیستم-احراز-هویت)
6. [ماژول‌های JavaScript](#ماژولهای-javascript)
7. [سیستم طراحی و UI/UX](#سیستم-طراحی-و-uiux)
8. [ارتباط با سرور (API)](#ارتباط-با-سرور-api)
9. [صفحات و عملکردها](#صفحات-و-عملکردها)
10. [امنیت](#امنیت)
11. [بهینه‌سازی](#بهینهسازی)

---

## معرفی پروژه

### هدف پروژه
**هاویرکشت** یک سامانه وب‌محور برای مدیریت کشت قراردادی چغندر قند است. این سامانه به پیمانکاران کشاورزی امکان می‌دهد:
- قراردادهای کشاورزان را مدیریت کنند
- سال‌های زراعی را تعریف و پیگیری کنند
- استان‌ها، شهرها و روستاها را سازماندهی کنند
- صورتحساب‌ها و تعهدات را ثبت و پیگیری کنند
- گزارش‌های مالی و آماری تولید کنند

### نوع معماری
این پروژه یک **Single Page Application (SPA)** با معماری **Frontend-Only** است که:
- به صورت کاملاً استاتیک قابل استقرار است
- از یک API خارجی (Backend) برای داده‌ها استفاده می‌کند
- نیازی به سرور Backend ندارد (Serverless Frontend)

---

## معماری سیستم

### نمودار معماری کلی

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT SIDE                               │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │   HTML5     │  │  CSS3       │  │     JavaScript ES6+     │  │
│  │  (Pages)    │  │ (Tailwind)  │  │      (Modules)          │  │
│  └──────┬──────┘  └──────┬──────┘  └───────────┬─────────────┘  │
│         │                │                      │                │
│         └────────────────┼──────────────────────┘                │
│                          │                                       │
│                   ┌──────▼──────┐                                │
│                   │   Browser   │                                │
│                   │ localStorage│                                │
│                   └──────┬──────┘                                │
└──────────────────────────┼───────────────────────────────────────┘
                           │ HTTPS
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                        SERVER SIDE                               │
├─────────────────────────────────────────────────────────────────┤
│               https://edu-api.havirkesht.ir                      │
│                     (RESTful API)                                │
│                                                                  │
│     ┌─────────────────────────────────────────────────────┐     │
│     │              FastAPI Backend                        │     │
│     │  ┌─────────┐  ┌──────────┐  ┌─────────────────┐    │     │
│     │  │  Auth   │  │  CRUD    │  │    Reports      │    │     │
│     │  │ (JWT)   │  │ Handlers │  │   Generator     │    │     │
│     │  └────┬────┘  └────┬─────┘  └───────┬─────────┘    │     │
│     │       └────────────┼────────────────┘              │     │
│     │                    ▼                               │     │
│     │           ┌────────────────┐                       │     │
│     │           │   Database     │                       │     │
│     │           │   (PostgreSQL) │                       │     │
│     │           └────────────────┘                       │     │
│     └─────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────────┘
```

### الگوی طراحی (Design Pattern)

پروژه از الگوی **Module Pattern** استفاده می‌کند:

```javascript
// هر ماژول یک شیء global می‌سازد
const ModuleName = {
    // Properties
    property: value,
    
    // Methods
    method() {
        // implementation
    }
};

// در دسترس قرار دادن به صورت global
window.ModuleName = ModuleName;
```

---

## ساختار پروژه

```
havirkesht-exercise/
│
├── index.html                 # صفحه ورود (Login)
├── package.json               # تنظیمات npm و وابستگی‌ها
├── tailwind.config.js         # پیکربندی Tailwind CSS
├── README.md                  # راهنمای اولیه
│
├── css/
│   ├── input.css              # ورودی Tailwind (directives)
│   ├── output.css             # خروجی کامپایل شده Tailwind
│   ├── custom.css             # استایل‌های سفارشی
│   └── fonts.css              # تعریف فونت‌ها
│
├── fonts/
│   ├── Vazirmatn-Thin.woff2
│   ├── Vazirmatn-Light.woff2
│   ├── Vazirmatn-Regular.woff2
│   ├── Vazirmatn-Medium.woff2
│   ├── Vazirmatn-SemiBold.woff2
│   ├── Vazirmatn-Bold.woff2
│   ├── Vazirmatn-ExtraBold.woff2
│   └── Vazirmatn-Black.woff2
│
├── js/
│   ├── config.js              # تنظیمات مرکزی (API URL, Keys)
│   ├── api.js                 # ماژول ارتباط با API
│   ├── auth.js                # ماژول احراز هویت
│   ├── utils.js               # توابع کمکی
│   ├── sidebar.js             # کامپوننت منوی کناری
│   ├── login.js               # هندلر صفحه ورود
│   ├── dashboard.js           # هندلر داشبورد
│   ├── farmer-contracts.js    # مدیریت قراردادها
│   ├── province.js            # مدیریت استان‌ها
│   ├── crop-year.js           # مدیریت سال زراعی
│   ├── manage-users.js        # مدیریت کاربران
│   ├── commitment.js          # مدیریت تعهدات
│   ├── farmer-invoice.js      # صورتحساب کشاورزان
│   └── invoice-farmer.js      # صورتحساب (نسخه جایگزین)
│
├── pages/
│   ├── admin/
│   │   ├── dashboard.html     # داشبورد اصلی
│   │   ├── crop-year.html     # ثبت سال زراعی
│   │   ├── province.html      # ثبت استان
│   │   ├── farmer-contracts.html  # قراردادهای کشاورزان
│   │   ├── farmer-invoice.html    # صورتحساب کشاورزان
│   │   ├── manage-users.html  # مدیریت کاربران
│   │   ├── commitment.html    # تعهدات
│   │   └── invoice-farmer.html    # صورتحساب
│   └── *.html                 # صفحات قدیمی (deprecated)
│
└── docs/
    ├── README.md              # مستندات اصلی
    ├── API.md                 # مستندات API
    ├── DEVELOPMENT.md         # راهنمای توسعه
    ├── DEPLOYMENT.md          # راهنمای استقرار
    └── PROJECT_DOCUMENTATION.md  # این فایل
```

---

## تکنولوژی‌های استفاده شده

### 1. HTML5
**نسخه:** HTML5 Living Standard

**ویژگی‌های استفاده شده:**
- **Semantic Tags:** استفاده از تگ‌های معنادار (`<main>`, `<aside>`, `<nav>`, `<header>`)
- **Form Validation:** اعتبارسنجی داخلی فرم‌ها با `required`, `type`
- **Data Attributes:** ذخیره اطلاعات در DOM با `data-*`
- **RTL Support:** پشتیبانی راست‌به‌چپ با `dir="rtl"` و `lang="fa"`

```html
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>هاویرکشت - سامانه کشت قراردادی چغندر قند</title>
</head>
```

### 2. CSS3 + Tailwind CSS
**نسخه Tailwind:** 3.4.0

**چرا Tailwind CSS؟**
- **Utility-First:** طراحی سریع با کلاس‌های کاربردی
- **Customizable:** قابلیت شخصی‌سازی کامل
- **Responsive:** کلاس‌های واکنش‌گرا آماده
- **Tree-shaking:** حذف خودکار کلاس‌های بلااستفاده
- **RTL Support:** پشتیبانی از زبان‌های راست‌به‌چپ

**پیکربندی Tailwind:**
```javascript
// tailwind.config.js
module.exports = {
  content: [
    "./*.html",
    "./pages/**/*.html",
    "./js/**/*.js"
  ],
  theme: {
    extend: {
      fontFamily: {
        'vazir': ['Vazirmatn', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#faf5ff',
          500: '#a855f7',
          900: '#581c87',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'slide-in': 'slideIn 0.3s ease-out forwards',
      },
    },
  },
  plugins: [],
}
```

**استایل‌های سفارشی:**
```css
/* کلاس‌های سفارشی با @apply */
.form-input {
    @apply w-full bg-white/5 border border-green-400/30 
           rounded-xl py-3 px-4 text-white 
           placeholder-green-300/50 focus:outline-none 
           focus:border-green-400 focus:ring-2 
           focus:ring-green-400/20 transition-all;
}

.btn-primary {
    @apply bg-gradient-to-r from-green-500 to-green-700 
           hover:from-green-600 hover:to-green-800 
           text-white font-bold py-3 px-6 rounded-xl 
           transition-all duration-300 shadow-lg 
           hover:shadow-green-500/30;
}
```

### 3. JavaScript ES6+
**ویژگی‌های مدرن استفاده شده:**

| ویژگی | توضیح | مثال |
|-------|-------|------|
| Arrow Functions | توابع کوتاه‌تر | `(x) => x * 2` |
| Template Literals | رشته‌های قالبی | `` `Hello ${name}` `` |
| Async/Await | برنامه‌نویسی ناهمگام | `async function()` |
| Destructuring | تجزیه آرایه/شیء | `const {a, b} = obj` |
| Spread Operator | گسترش آرایه/شیء | `{...obj, new: val}` |
| Optional Chaining | دسترسی امن | `obj?.prop?.sub` |
| Nullish Coalescing | مقدار پیش‌فرض | `val ?? 'default'` |
| Array Methods | متدهای آرایه | `map, filter, forEach` |

### 4. فونت وزیرمتن (Vazirmatn)
**نسخه:** آخرین نسخه

**چرا وزیرمتن؟**
- **فارسی محور:** طراحی شده برای زبان فارسی
- **Variable Font:** قابلیت تنظیم وزن
- **Open Source:** متن‌باز و رایگان
- **Web Optimized:** بهینه برای وب با فرمت WOFF2

**تعریف فونت:**
```css
@font-face {
    font-family: 'Vazirmatn';
    src: url('../fonts/Vazirmatn-Regular.woff2') format('woff2');
    font-weight: 400;
    font-style: normal;
    font-display: swap;  /* بهینه‌سازی بارگذاری */
}
```

### 5. npm (Node Package Manager)
**استفاده:** مدیریت وابستگی‌ها و اسکریپت‌های build

```json
{
  "scripts": {
    "build:css": "npx tailwindcss -i ./css/input.css -o ./css/output.css",
    "watch:css": "npx tailwindcss -i ./css/input.css -o ./css/output.css --watch",
    "dev": "npx tailwindcss -i ./css/input.css -o ./css/output.css --watch"
  },
  "devDependencies": {
    "tailwindcss": "^3.4.0"
  }
}
```

---

## سیستم احراز هویت

### فلوچارت احراز هویت

```
┌─────────────────┐
│   کاربر وارد    │
│   صفحه می‌شود   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     بله    ┌─────────────────┐
│  توکن در       │───────────▶│  هدایت به       │
│ localStorage?  │            │  داشبورد        │
└────────┬────────┘            └─────────────────┘
         │ خیر
         ▼
┌─────────────────┐
│  نمایش فرم     │
│     ورود       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  ارسال به API  │
│   POST /token  │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
   موفق     خطا
    │         │
    ▼         ▼
┌─────────┐ ┌─────────────┐
│ ذخیره   │ │  نمایش     │
│ توکن   │ │  پیام خطا  │
└────┬────┘ └─────────────┘
     │
     ▼
┌─────────────────┐
│  Parse JWT     │
│  و استخراج    │
│  اطلاعات کاربر │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  هدایت به      │
│   داشبورد      │
└─────────────────┘
```

### ماژول Auth (`js/auth.js`)

```javascript
const Auth = {
    // بررسی وضعیت احراز هویت
    isAuthenticated() {
        return !!localStorage.getItem(CONFIG.STORAGE_KEYS.ACCESS_TOKEN);
    },
    
    // تجزیه JWT برای استخراج اطلاعات
    parseJwt(token) {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            return JSON.parse(decodeURIComponent(atob(base64).split('').map(c => 
                '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
            ).join('')));
        } catch (e) {
            return null;
        }
    },
    
    // ورود به سیستم
    async login(username, password) {
        const response = await Api.login(username, password);
        
        if (response.access_token) {
            // ذخیره توکن‌ها
            localStorage.setItem(CONFIG.STORAGE_KEYS.ACCESS_TOKEN, response.access_token);
            localStorage.setItem(CONFIG.STORAGE_KEYS.REFRESH_TOKEN, response.refresh_token || '');
            
            // استخراج و ذخیره اطلاعات کاربر
            const tokenData = this.parseJwt(response.access_token);
            if (tokenData) {
                localStorage.setItem(CONFIG.STORAGE_KEYS.USER_ID, tokenData.user_id);
                localStorage.setItem(CONFIG.STORAGE_KEYS.ROLE_ID, tokenData.role_id);
                localStorage.setItem(CONFIG.STORAGE_KEYS.FULLNAME, tokenData.fullname || '');
                localStorage.setItem(CONFIG.STORAGE_KEYS.USERNAME, tokenData.sub);
            }
            
            return { success: true, user: tokenData };
        }
        
        throw new Error('خطا در ورود');
    },
    
    // خروج از سیستم
    logout() {
        Object.values(CONFIG.STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
    },
    
    // دریافت اطلاعات کاربر فعلی
    getCurrentUser() {
        if (!this.isAuthenticated()) return null;
        return {
            user_id: localStorage.getItem(CONFIG.STORAGE_KEYS.USER_ID),
            role_id: parseInt(localStorage.getItem(CONFIG.STORAGE_KEYS.ROLE_ID)),
            fullname: localStorage.getItem(CONFIG.STORAGE_KEYS.FULLNAME),
            username: localStorage.getItem(CONFIG.STORAGE_KEYS.USERNAME),
        };
    }
};
```

### ساختار JWT Token

```
Header.Payload.Signature

Payload (Decoded):
{
  "user_id": 1,
  "role_id": 1,
  "fullname": "مدیر سیستم",
  "sub": "admin",
  "exp": 1738800000,
  "iat": 1738713600
}
```

### کلیدهای ذخیره‌سازی (Storage Keys)

| کلید | توضیح |
|------|-------|
| `access_token` | توکن دسترسی JWT |
| `refresh_token` | توکن تجدید (در صورت نیاز) |
| `user_id` | شناسه کاربر |
| `role_id` | شناسه نقش |
| `fullname` | نام کامل کاربر |
| `crop_year_id` | سال زراعی انتخاب شده |
| `username` | نام کاربری |

---

## ماژول‌های JavaScript

### 1. ماژول Config (`js/config.js`)
**هدف:** مرکزی‌سازی تنظیمات پروژه

```javascript
const CONFIG = {
    // آدرس پایه API
    API_BASE_URL: 'https://edu-api.havirkesht.ir',
    
    // کلیدهای localStorage
    STORAGE_KEYS: {
        ACCESS_TOKEN: 'access_token',
        REFRESH_TOKEN: 'refresh_token',
        USER_ID: 'user_id',
        ROLE_ID: 'role_id',
        FULLNAME: 'fullname',
        CROP_YEAR_ID: 'crop_year_id',
        USERNAME: 'username',
    },
    
    // نقش‌های کاربری
    USER_ROLES: { ADMIN: 1, CONTRACTOR: 2, FARMER: 3, DRIVER: 4 },
    USER_ROLE_NAMES: { 1: 'ادمین', 2: 'پیمانکار', 3: 'کشاورز', 4: 'راننده' },
};
```

### 2. ماژول API (`js/api.js`)
**هدف:** مدیریت تمام ارتباطات با سرور

**الگوی طراحی:** Singleton Pattern + Facade Pattern

```javascript
const Api = {
    baseURL: CONFIG.API_BASE_URL,
    
    // دریافت توکن از localStorage
    getToken() {
        return localStorage.getItem(CONFIG.STORAGE_KEYS.ACCESS_TOKEN);
    },
    
    // متد پایه برای همه درخواست‌ها
    async request(url, options = {}) {
        const token = this.getToken();
        const headers = {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...options.headers
        };
        
        try {
            const response = await fetch(url, { ...options, headers });
            
            // مدیریت خطای 401 (توکن منقضی)
            if (response.status === 401) {
                localStorage.clear();
                window.location.href = '/index.html';
                return null;
            }
            
            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                throw new Error(error.detail || 'خطا در ارتباط با سرور');
            }
            
            return response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },
    
    // ورود - ارسال با فرمت form-urlencoded
    async login(username, password) {
        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('password', password);
        
        const response = await fetch(`${this.baseURL}/token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData
        });
        
        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.detail || 'نام کاربری یا رمز عبور اشتباه است');
        }
        
        return response.json();
    },
    
    // CRUD Operations for each entity...
    async getFarmers(page, size, cropYearId) { /* ... */ },
    async createFarmer(data) { /* ... */ },
    async updateFarmer(id, data) { /* ... */ },
    async deleteFarmer(id) { /* ... */ },
    // ... سایر متدها
};
```

### 3. ماژول Utils (`js/utils.js`)
**هدف:** توابع کمکی عمومی

```javascript
const Utils = {
    // فرمت‌بندی اعداد با جداکننده فارسی
    formatNumber(num) {
        if (num == null) return '۰';
        return new Intl.NumberFormat('fa-IR').format(num);
    },
    
    // تبدیل اعداد انگلیسی به فارسی
    toPersianDigits(str) {
        const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
        return str.toString().replace(/[0-9]/g, d => persianDigits[d]);
    },
    
    // تبدیل اعداد فارسی به انگلیسی
    toEnglishDigits(str) {
        return str.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d));
    },
    
    // جلوگیری از XSS
    escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    },
    
    // نمایش Toast Notification
    showToast(message, type = 'info', duration = 3000) {
        const colors = {
            success: 'bg-green-500',
            error: 'bg-red-500',
            warning: 'bg-yellow-500',
            info: 'bg-blue-500'
        };
        
        const toast = document.createElement('div');
        toast.className = `fixed top-4 left-4 ${colors[type]} text-white 
                          px-6 py-3 rounded-lg shadow-lg z-50 
                          transition-all transform translate-x-[-100%]`;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        // انیمیشن ورود
        requestAnimationFrame(() => {
            toast.style.transform = 'translateX(0)';
        });
        
        // انیمیشن خروج
        setTimeout(() => {
            toast.style.transform = 'translateX(-100%)';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    },
    
    // Loading Overlay
    showLoading(message = 'در حال بارگذاری...') { /* ... */ },
    hideLoading() { /* ... */ },
    
    // دیالوگ تأیید
    confirm(title, message, onConfirm) { /* ... */ }
};
```

---

## سیستم طراحی و UI/UX

### پالت رنگ

| رنگ | HEX | کاربرد |
|-----|-----|--------|
| سبز اصلی | `#22c55e` | رنگ برند، دکمه‌های اصلی |
| سبز تیره | `#166534` | پس‌زمینه، گرادیان |
| سبز روشن | `#4ade80` | هاور، آیکون‌ها |
| بنفش | `#a78bfa` | لهجه (Accent) |
| قرمز | `#ef4444` | خطا، حذف |
| سفید | `#ffffff` | متن اصلی |
| خاکستری | `#9ca3af` | متن ثانویه |

### کامپوننت‌های UI

#### 1. کارت آمار (Stat Card)
```html
<div class="card bg-gradient-to-br from-green-600/20 to-green-800/20 
            backdrop-blur-xl rounded-2xl p-6 border border-green-400/30">
    <div class="flex items-center justify-between mb-4">
        <span class="text-green-300 font-medium">عنوان</span>
        <div class="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
            <!-- Icon -->
        </div>
    </div>
    <p class="text-3xl font-bold text-white">۱۲۳,۴۵۶</p>
    <p class="text-green-300 text-sm mt-2">توضیحات</p>
</div>
```

#### 2. جدول داده (Data Table)
```html
<table class="data-table w-full">
    <thead>
        <tr class="bg-green-500/10">
            <th class="py-3 px-4 text-right text-green-300">ردیف</th>
            <th class="py-3 px-4 text-right text-green-300">نام</th>
            <th class="py-3 px-4 text-center text-green-300">عملیات</th>
        </tr>
    </thead>
    <tbody id="tableBody">
        <!-- Dynamic Content -->
    </tbody>
</table>
```

#### 3. مودال (Modal)
```html
<div id="modal" class="fixed inset-0 bg-black/50 backdrop-blur-sm 
                       hidden items-center justify-center z-50">
    <div class="bg-gradient-to-br from-green-900/95 to-green-950/95 
                backdrop-blur-xl rounded-2xl p-6 max-w-md w-full mx-4 
                border border-green-400/20">
        <h3 class="text-white text-lg font-bold mb-4">عنوان مودال</h3>
        <!-- Content -->
        <div class="flex gap-3 mt-6">
            <button class="btn-primary flex-1">تأیید</button>
            <button class="btn-secondary flex-1">انصراف</button>
        </div>
    </div>
</div>
```

### افکت‌های ویژه

#### Glassmorphism (شیشه‌ای)
```css
.glass-effect {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.2);
}
```

#### گرادیان پس‌زمینه
```css
.gradient-bg {
    background: linear-gradient(135deg, 
        #166534 0%,    /* green-800 */
        #14532d 50%,   /* green-900 */
        #052e16 100%   /* green-950 */
    );
}
```

---

## ارتباط با سرور (API)

### آدرس پایه
```
https://edu-api.havirkesht.ir
```

### فرمت درخواست‌ها

#### احراز هویت (ورود)
```http
POST /token
Content-Type: application/x-www-form-urlencoded

username=admin&password=123456
```

#### درخواست‌های CRUD
```http
GET /farmer/?crop_year_id=13&page=1&size=50
Authorization: Bearer <access_token>
Content-Type: application/json
```

### Endpoints اصلی

| Endpoint | Method | توضیح |
|----------|--------|-------|
| `/token` | POST | ورود و دریافت توکن |
| `/farmer/` | GET, POST | لیست/ایجاد کشاورز |
| `/farmer/{id}` | GET, PUT, DELETE | جزئیات/ویرایش/حذف کشاورز |
| `/province/` | GET, POST | لیست/ایجاد استان |
| `/city/` | GET, POST | لیست/ایجاد شهر |
| `/village/` | GET, POST | لیست/ایجاد روستا |
| `/crop-year/` | GET, POST | لیست/ایجاد سال زراعی |
| `/commitment/` | GET, POST | لیست/ایجاد تعهد |
| `/farmers_invoice/` | GET | صورتحساب کشاورزان |
| `/users/` | GET | لیست کاربران |
| `/users/admin/` | POST | ایجاد کاربر (ادمین) |
| `/report-full/` | POST | گزارش کامل |

### کدهای خطا

| کد | معنی | اقدام |
|----|------|-------|
| 200 | موفق | - |
| 201 | ایجاد شد | - |
| 400 | درخواست نامعتبر | نمایش پیام خطا |
| 401 | احراز هویت نشده | هدایت به صفحه ورود |
| 403 | دسترسی ممنوع | نمایش پیام خطا |
| 404 | یافت نشد | نمایش پیام خطا |
| 422 | خطای اعتبارسنجی | نمایش جزئیات خطا |
| 500 | خطای سرور | نمایش پیام عمومی |

---

## صفحات و عملکردها

### 1. صفحه ورود (`index.html`)

**مسیر:** `/index.html`

**عملکرد:**
1. بررسی وضعیت احراز هویت (اگر وارد شده → داشبورد)
2. دریافت نام کاربری و رمز عبور
3. ارسال به API
4. ذخیره توکن و اطلاعات کاربر
5. هدایت به داشبورد

**کد کلیدی:**
```javascript
document.addEventListener('DOMContentLoaded', () => {
    // اگر قبلاً وارد شده، هدایت به داشبورد
    if (Auth.isAuthenticated()) {
        window.location.href = 'pages/admin/dashboard.html';
        return;
    }
    
    const form = document.getElementById('loginForm');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = Utils.toEnglishDigits(
            document.getElementById('username').value.trim()
        );
        const password = Utils.toEnglishDigits(
            document.getElementById('password').value
        );
        
        try {
            await Auth.login(username, password);
            Utils.showToast('ورود موفقیت‌آمیز', 'success');
            setTimeout(() => {
                window.location.href = 'pages/admin/dashboard.html';
            }, 500);
        } catch (error) {
            Utils.showToast(error.message, 'error');
        }
    });
});
```

### 2. داشبورد (`pages/admin/dashboard.html`)

**عملکرد:**
- نمایش آمار کلی سال زراعی
- مانده حساب پیمانکار
- تعداد قراردادها
- کل تناژ تحویلی
- جمع بدهی/طلب

**API Call:**
```javascript
async function loadDashboardData() {
    const cropYearId = Auth.getCropYearId();
    const data = await Api.getReportFull(cropYearId);
    
    // پر کردن کارت‌ها
    document.getElementById('contractorBalance')
        .textContent = Utils.formatNumber(data.current_contractor_remaining_balance);
    // ...
}
```

### 3. مدیریت قراردادها (`pages/admin/farmer-contracts.html`)

**عملکردها:**
- لیست قراردادها با صفحه‌بندی
- جستجو و فیلتر
- ایجاد قرارداد جدید
- ویرایش قرارداد
- حذف قرارداد

**Cascading Dropdowns:**
```javascript
// بارگذاری زنجیره‌ای: استان → شهر → روستا
async function loadProvinces() {
    provinces = await Api.getProvinces();
    // پر کردن dropdown استان
}

document.getElementById('provinceId').addEventListener('change', async (e) => {
    const provinceId = e.target.value;
    cities = await Api.getCities(provinceId);
    // پر کردن dropdown شهر
});

document.getElementById('cityId').addEventListener('change', async (e) => {
    const cityId = e.target.value;
    villages = await Api.getVillages(cityId);
    // پر کردن dropdown روستا
});
```

### 4. مدیریت کاربران (`pages/admin/manage-users.html`)

**محدودیت دسترسی:** فقط ادمین

```javascript
document.addEventListener('DOMContentLoaded', () => {
    const user = Auth.getCurrentUser();
    
    // فقط ادمین دسترسی دارد
    if (user?.role_id !== 1) {
        Utils.showToast('دسترسی غیرمجاز', 'error');
        window.location.href = 'dashboard.html';
        return;
    }
    
    initPage();
});
```

### 5. سایر صفحات

| صفحه | فایل | عملکرد |
|------|------|--------|
| سال زراعی | `crop-year.html` | ثبت و مدیریت سال‌های زراعی |
| استان | `province.html` | ثبت استان‌های جدید |
| تعهدات | `commitment.html` | مدیریت تعهدات کشاورزان |
| صورتحساب | `farmer-invoice.html` | مشاهده صورتحساب‌ها |

---

## امنیت

### 1. احراز هویت JWT
- توکن‌ها در `localStorage` ذخیره می‌شوند
- هر درخواست با هدر `Authorization: Bearer <token>` ارسال می‌شود
- توکن منقضی → هدایت خودکار به صفحه ورود

### 2. HTTPS
- تمام ارتباطات با API از طریق HTTPS انجام می‌شود
- جلوگیری از Man-in-the-Middle Attack

### 3. XSS Prevention
```javascript
// تمام محتوای کاربر قبل از نمایش escape می‌شود
Utils.escapeHtml(userInput)
```

### 4. CORS
- API با تنظیمات CORS مناسب پیکربندی شده
- فقط دامنه‌های مجاز می‌توانند درخواست ارسال کنند

### 5. Input Validation
- اعتبارسنجی سمت کلاینت با HTML5 و JavaScript
- اعتبارسنجی نهایی در سمت سرور

---

## بهینه‌سازی

### 1. بارگذاری فونت
```css
@font-face {
    font-display: swap;  /* نمایش فونت سیستم تا بارگذاری */
}
```

### 2. فشرده‌سازی CSS
```bash
npm run build:css  # تولید CSS بهینه شده
```

### 3. Lazy Loading
- بارگذاری داده‌ها به صورت صفحه‌بندی شده
- بارگذاری تنبل برای dropdown‌ها

### 4. Caching
- فایل‌های استاتیک قابل کش هستند
- پیشنهاد تنظیم سرور:

```nginx
location ~* \.(css|js|woff2)$ {
    expires 30d;
    add_header Cache-Control "public, immutable";
}
```

---

## نتیجه‌گیری

پروژه هاویرکشت یک سامانه وب مدرن با معماری frontend-only است که:

✅ از تکنولوژی‌های روز استفاده می‌کند (HTML5, CSS3, ES6+)  
✅ رابط کاربری زیبا و responsive دارد  
✅ امنیت مناسبی دارد (JWT, HTTPS, XSS Prevention)  
✅ قابلیت گسترش و نگهداری آسان دارد  
✅ مستندات کامل دارد  

### نویسندگان و مشارکت‌کنندگان

این پروژه به عنوان تمرین عملی برای درس طراحی وب توسعه داده شده است.

---

**تاریخ آخرین به‌روزرسانی:** بهمن ۱۴۰۴

</div>
