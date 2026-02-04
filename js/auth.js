// Auth Module - Based on edu.havirkesht.ir
const Auth = {
    isAuthenticated() {
        return !!localStorage.getItem(CONFIG.STORAGE_KEYS.ACCESS_TOKEN);
    },
    
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
    
    async login(username, password) {
        const response = await Api.login(username, password);
        
        if (response.access_token) {
            localStorage.setItem(CONFIG.STORAGE_KEYS.ACCESS_TOKEN, response.access_token);
            localStorage.setItem(CONFIG.STORAGE_KEYS.REFRESH_TOKEN, response.refresh_token || '');
            
            const tokenData = this.parseJwt(response.access_token);
            if (tokenData) {
                localStorage.setItem(CONFIG.STORAGE_KEYS.USER_ID, tokenData.user_id);
                localStorage.setItem(CONFIG.STORAGE_KEYS.ROLE_ID, tokenData.role_id);
                localStorage.setItem(CONFIG.STORAGE_KEYS.FULLNAME, tokenData.fullname || '');
                localStorage.setItem(CONFIG.STORAGE_KEYS.USERNAME, tokenData.sub);
            }
            
            // Set default crop year
            if (!localStorage.getItem(CONFIG.STORAGE_KEYS.CROP_YEAR_ID)) {
                localStorage.setItem(CONFIG.STORAGE_KEYS.CROP_YEAR_ID, '13');
            }
            
            return { success: true, user: tokenData };
        }
        
        throw new Error('خطا در ورود');
    },
    
    logout() {
        Object.values(CONFIG.STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
    },
    
    getCurrentUser() {
        if (!this.isAuthenticated()) return null;
        return {
            user_id: localStorage.getItem(CONFIG.STORAGE_KEYS.USER_ID),
            role_id: parseInt(localStorage.getItem(CONFIG.STORAGE_KEYS.ROLE_ID)),
            fullname: localStorage.getItem(CONFIG.STORAGE_KEYS.FULLNAME),
            username: localStorage.getItem(CONFIG.STORAGE_KEYS.USERNAME),
        };
    },
    
    getRoleName(roleId) {
        return CONFIG.USER_ROLE_NAMES[roleId] || 'کاربر';
    },
    
    getCropYearId() {
        return localStorage.getItem(CONFIG.STORAGE_KEYS.CROP_YEAR_ID) || '13';
    },
    
    setCropYearId(id) {
        localStorage.setItem(CONFIG.STORAGE_KEYS.CROP_YEAR_ID, id);
    }
};

window.Auth = Auth;
