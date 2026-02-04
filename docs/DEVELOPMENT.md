# 💻 راهنمای توسعه (Development Guide)

## محیط توسعه

### پیش‌نیازها

- **Node.js** نسخه 18 یا بالاتر
- **npm** یا **yarn**
- **VS Code** (پیشنهادی)
- **Live Server** اکستنشن VS Code

### نصب و راه‌اندازی

```bash
# کلون پروژه
git clone <repository-url>
cd WebFinalProject

# نصب وابستگی‌ها
npm install

# شروع watch mode برای CSS
npm run dev
```

---

## ساختار کد

### فایل‌های اصلی JavaScript

#### `js/config.js`
تنظیمات اصلی پروژه:

```javascript
const CONFIG = {
    API_BASE_URL: 'http://edu-api.havirkesht.ir',
    STORAGE_KEYS: {
        ACCESS_TOKEN: 'access_token',
        REFRESH_TOKEN: 'refresh_token',
        USER_ID: 'user_id',
        ROLE_ID: 'role_id',
        FULLNAME: 'fullname',
        CROP_YEAR_ID: 'crop_year_id',
        USERNAME: 'username',
    },
    USER_ROLES: { ADMIN: 1, CONTRACTOR: 2, FARMER: 3, DRIVER: 4 },
    USER_ROLE_NAMES: { 1: 'ادمین', 2: 'پیمانکار', 3: 'کشاورز', 4: 'راننده' },
};
```

#### `js/api.js`
ماژول ارتباط با API:

```javascript
const Api = {
    baseURL: CONFIG.API_BASE_URL,
    
    getToken() {
        return localStorage.getItem(CONFIG.STORAGE_KEYS.ACCESS_TOKEN);
    },
    
    async request(url, options = {}) {
        const token = this.getToken();
        const headers = {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...options.headers
        };
        
        const response = await fetch(url, { ...options, headers });
        
        if (response.status === 401) {
            localStorage.clear();
            window.location.href = '/index.html';
            return null;
        }
        
        return response.json();
    },
    
    // متدهای CRUD
    async getFarmers(page, size, cropYearId) { ... },
    async createFarmer(data) { ... },
    async updateFarmer(id, data) { ... },
    async deleteFarmer(id) { ... },
};
```

#### `js/auth.js`
مدیریت احراز هویت:

```javascript
const Auth = {
    isAuthenticated() {
        return !!localStorage.getItem(CONFIG.STORAGE_KEYS.ACCESS_TOKEN);
    },
    
    getUserRole() {
        return parseInt(localStorage.getItem(CONFIG.STORAGE_KEYS.ROLE_ID));
    },
    
    logout() {
        localStorage.clear();
        window.location.href = '/index.html';
    }
};
```

#### `js/utils.js`
توابع کمکی:

```javascript
const Utils = {
    // نمایش Toast
    showToast(message, type = 'info') { ... },
    
    // فرمت اعداد
    formatNumber(num) {
        return num.toLocaleString('fa-IR');
    },
    
    // تبدیل تاریخ
    formatDate(date) {
        return new Date(date).toLocaleDateString('fa-IR');
    },
    
    // اعتبارسنجی کد ملی
    validateNationalCode(code) { ... }
};
```

---

## الگوهای کد

### ساختار صفحه جدید

```javascript
// my-page.js

document.addEventListener('DOMContentLoaded', function() {
    // 1. بررسی احراز هویت
    if (!Auth.isAuthenticated()) {
        window.location.href = '/index.html';
        return;
    }
    
    // 2. مقداردهی اولیه
    init();
});

// متغیرهای سراسری
let currentData = [];
let currentPage = 1;

async function init() {
    setupEventListeners();
    await loadData();
}

function setupEventListeners() {
    // فرم‌ها
    document.getElementById('myForm')?.addEventListener('submit', handleSubmit);
    
    // دکمه‌ها
    document.getElementById('addBtn')?.addEventListener('click', openModal);
    document.getElementById('closeModal')?.addEventListener('click', closeModal);
}

async function loadData() {
    try {
        showLoading();
        const data = await Api.getMyData();
        currentData = data;
        renderTable(data);
    } catch (error) {
        Utils.showToast('خطا در دریافت داده‌ها', 'error');
    } finally {
        hideLoading();
    }
}

function renderTable(data) {
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = data.map(item => `
        <tr class="border-b border-green-500/10 hover:bg-green-500/5 transition">
            <td class="p-4">${item.id}</td>
            <td class="p-4">${item.name}</td>
            <td class="p-4">
                <button onclick="editItem(${item.id})" class="text-green-400 hover:text-green-300">
                    ویرایش
                </button>
                <button onclick="deleteItem(${item.id})" class="text-red-400 hover:text-red-300 mr-2">
                    حذف
                </button>
            </td>
        </tr>
    `).join('');
}

async function handleSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    try {
        await Api.createItem(data);
        Utils.showToast('با موفقیت ذخیره شد', 'success');
        closeModal();
        await loadData();
    } catch (error) {
        Utils.showToast('خطا در ذخیره', 'error');
    }
}

// Modal functions
function openModal() {
    document.getElementById('modal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('modal').classList.add('hidden');
    document.getElementById('myForm').reset();
}

// Loading
function showLoading() {
    document.getElementById('loading')?.classList.remove('hidden');
}

function hideLoading() {
    document.getElementById('loading')?.classList.add('hidden');
}
```

---

## استایل‌ها

### کلاس‌های Tailwind سفارشی

فایل `css/custom.css`:

```css
/* فرم‌ها */
.form-input {
    @apply w-full bg-white/5 border border-green-400/30 rounded-xl py-3 px-4 
           text-white placeholder-green-300/50 focus:outline-none 
           focus:border-green-400 focus:ring-2 focus:ring-green-400/20 
           transition-all;
}

.form-label {
    @apply block text-green-200 text-sm mb-2 font-medium;
}

.form-select {
    @apply w-full bg-white/5 border border-green-400/30 rounded-xl py-3 px-4 
           text-white focus:outline-none focus:border-green-400 
           focus:ring-2 focus:ring-green-400/20 transition-all 
           appearance-none cursor-pointer;
}

/* دکمه‌ها */
.btn-primary {
    @apply bg-gradient-to-r from-green-500 to-green-700 
           hover:from-green-600 hover:to-green-800 
           text-white font-bold py-3 px-6 rounded-xl 
           transition-all duration-300 shadow-lg 
           hover:shadow-green-500/30 flex items-center justify-center gap-2;
}

.btn-secondary {
    @apply bg-white/10 hover:bg-white/20 text-white font-medium 
           py-3 px-6 rounded-xl transition-all duration-300 
           border border-green-400/30 hover:border-green-400/50;
}

.btn-danger {
    @apply bg-gradient-to-r from-red-500 to-red-700 
           hover:from-red-600 hover:to-red-800 
           text-white font-bold py-3 px-6 rounded-xl;
}

/* Badge ها */
.badge-success { @apply bg-green-500/20 text-green-300 border border-green-400/30; }
.badge-warning { @apply bg-yellow-500/20 text-yellow-300 border border-yellow-400/30; }
.badge-danger { @apply bg-red-500/20 text-red-300 border border-red-400/30; }
.badge-info { @apply bg-blue-500/20 text-blue-300 border border-blue-400/30; }
```

---

## اضافه کردن قابلیت جدید

### 1. ایجاد صفحه جدید

```bash
# 1. ایجاد فایل HTML
touch pages/admin/new-page.html

# 2. ایجاد فایل JS
touch js/new-page.js
```

### 2. قالب HTML

```html
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>هاویرکشت - صفحه جدید</title>
    <link rel="stylesheet" href="../../css/output.css">
    <link rel="stylesheet" href="../../css/custom.css">
</head>
<body class="bg-gradient-to-br from-green-950 via-green-900 to-green-950 min-h-screen font-vazir">
    <div class="flex min-h-screen">
        <!-- Sidebar -->
        <aside class="w-72 bg-black/30 backdrop-blur-xl border-l border-green-500/20 flex flex-col">
            <!-- محتوای سایدبار -->
        </aside>
        
        <!-- Main Content -->
        <main class="flex-1 p-8">
            <!-- هدر -->
            <div class="mb-8">
                <h1 class="text-3xl font-bold text-white">عنوان صفحه</h1>
                <p class="text-green-300 mt-2">توضیحات صفحه</p>
            </div>
            
            <!-- محتوای اصلی -->
            <div class="bg-black/20 backdrop-blur-lg rounded-2xl border border-green-500/20 p-6">
                <!-- محتوا -->
            </div>
        </main>
    </div>
    
    <script src="../../js/config.js"></script>
    <script src="../../js/api.js"></script>
    <script src="../../js/auth.js"></script>
    <script src="../../js/utils.js"></script>
    <script src="../../js/new-page.js"></script>
</body>
</html>
```

### 3. اضافه کردن به سایدبار

در همه فایل‌های HTML صفحات ادمین، لینک جدید را اضافه کنید:

```html
<a href="new-page.html" class="flex items-center gap-3 px-4 py-3 rounded-xl text-green-200 hover:bg-green-500/20 transition">
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <!-- آیکون -->
    </svg>
    <span>صفحه جدید</span>
</a>
```

---

## تست و دیباگ

### اجرای محلی

```bash
# با Python
python3 -m http.server 3000

# با Node.js
npx serve .

# با Live Server در VS Code
# کلیک راست روی index.html > Open with Live Server
```

### دیباگ API

```javascript
// اضافه کردن لاگ به api.js
async request(url, options = {}) {
    console.log('API Request:', url, options);
    
    const response = await fetch(url, { ...options, headers });
    
    console.log('API Response:', response.status);
    
    const data = await response.json();
    console.log('API Data:', data);
    
    return data;
}
```

### بررسی خطاها

```javascript
try {
    const data = await Api.getMyData();
} catch (error) {
    console.error('Error details:', {
        message: error.message,
        stack: error.stack
    });
    Utils.showToast('خطا: ' + error.message, 'error');
}
```

---

## بهترین شیوه‌ها

### 1. نام‌گذاری

- فایل‌ها: `kebab-case.js`
- توابع: `camelCase`
- کلاس‌ها: `PascalCase`
- ثابت‌ها: `UPPER_SNAKE_CASE`

### 2. ساختار توابع

```javascript
// ✅ خوب - توابع کوچک و با یک مسئولیت
async function loadFarmers() { ... }
function renderFarmersTable(farmers) { ... }
function validateFarmerForm(data) { ... }

// ❌ بد - تابع بزرگ با چند مسئولیت
async function loadAndRenderAndValidateFarmers() { ... }
```

### 3. مدیریت خطا

```javascript
// همیشه خطاها را مدیریت کنید
try {
    await riskyOperation();
} catch (error) {
    // لاگ برای توسعه‌دهنده
    console.error(error);
    
    // پیام برای کاربر
    Utils.showToast('عملیات با خطا مواجه شد', 'error');
}
```

---

## منابع مفید

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [MDN Web Docs](https://developer.mozilla.org)
- [JavaScript.info](https://javascript.info)

---

📅 آخرین به‌روزرسانی: فوریه ۲۰۲۶
