// Configuration - Based on edu.havirkesht.ir
const CONFIG = {
    API_BASE_URL: 'https://edu-api.havirkesht.ir',
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
window.CONFIG = CONFIG;
