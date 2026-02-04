// Login Page Handler
document.addEventListener('DOMContentLoaded', () => {
    if (Auth.isAuthenticated()) {
        window.location.href = 'pages/admin/dashboard.html';
        return;
    }
    
    const form = document.getElementById('loginForm');
    const btn = document.getElementById('loginBtn');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = Utils.toEnglishDigits(document.getElementById('username').value.trim());
        const password = Utils.toEnglishDigits(document.getElementById('password').value);
        
        if (!username || !password) {
            Utils.showToast('لطفاً نام کاربری و رمز عبور را وارد کنید', 'warning');
            return;
        }
        
        btn.disabled = true;
        btn.innerHTML = '<span class="animate-spin inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full mr-2"></span>در حال ورود...';
        
        try {
            await Auth.login(username, password);
            Utils.showToast('ورود موفقیت‌آمیز', 'success');
            setTimeout(() => window.location.href = 'pages/admin/dashboard.html', 500);
        } catch (error) {
            Utils.showToast(error.message || 'خطا در ورود', 'error');
            btn.disabled = false;
            btn.innerHTML = 'ورود به سیستم';
        }
    });
    
    // Toggle password visibility
    const toggleBtn = document.getElementById('togglePassword');
    const passInput = document.getElementById('password');
    if (toggleBtn && passInput) {
        toggleBtn.addEventListener('click', () => {
            passInput.type = passInput.type === 'password' ? 'text' : 'password';
        });
    }
});
