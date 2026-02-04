// API Module - Exactly like edu.havirkesht.ir
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
        
        try {
            const response = await fetch(url, { ...options, headers });
            
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
    
    // Login - POST form data
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
    
    // GET Report Full - POST method (like original)
    async getReportFull(cropYearId) {
        return this.request(`${this.baseURL}/report-full/?crop_year_id=${cropYearId}`, {
            method: 'POST',
            body: JSON.stringify({})
        });
    },
    
    // GET Farmers
    async getFarmers(page = 1, size = 50, cropYearId = null) {
        const yearId = cropYearId || 13;
        return this.request(`${this.baseURL}/farmer/?crop_year_id=${yearId}&sort_by=updated_at&sort_order=desc&size=${size}&page=${page}`);
    },
    
    // GET Farmer by ID
    async getFarmer(id) {
        return this.request(`${this.baseURL}/farmer/${id}`);
    },
    
    // CREATE Farmer
    async createFarmer(data) {
        return this.request(`${this.baseURL}/farmer/`, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },
    
    // UPDATE Farmer
    async updateFarmer(id, data) {
        return this.request(`${this.baseURL}/farmer/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },
    
    // DELETE Farmer
    async deleteFarmer(id) {
        return this.request(`${this.baseURL}/farmer/${id}`, { method: 'DELETE' });
    },
    
    // GET Provinces
    async getProvinces() {
        return this.request(`${this.baseURL}/province/?sort_by=updated_at&sort_order=desc`);
    },
    
    // CREATE Province
    async createProvince(data) {
        return this.request(`${this.baseURL}/province/`, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },
    
    // UPDATE Province
    async updateProvince(id, data) {
        return this.request(`${this.baseURL}/province/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },
    
    // DELETE Province
    async deleteProvince(name) {
        return this.request(`${this.baseURL}/province/${encodeURIComponent(name)}`, { method: 'DELETE' });
    },
    
    // GET Cities
    async getCities(provinceId) {
        return this.request(`${this.baseURL}/city/?province_id=${provinceId}&sort_by=updated_at&sort_order=desc`);
    },
    
    // CREATE City
    async createCity(data) {
        return this.request(`${this.baseURL}/city/`, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },
    
    // UPDATE City
    async updateCity(id, data) {
        return this.request(`${this.baseURL}/city/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },
    
    // DELETE City
    async deleteCity(id) {
        return this.request(`${this.baseURL}/city/${id}`, { method: 'DELETE' });
    },
    
    // GET Villages
    async getVillages(cityId, cropYearId = 13) {
        return this.request(`${this.baseURL}/village/?city_id=${cityId}&sort_by=updated_at&sort_order=desc&crop_year_id=${cropYearId}`);
    },
    
    // CREATE Village
    async createVillage(data) {
        return this.request(`${this.baseURL}/village/`, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },
    
    // UPDATE Village
    async updateVillage(id, data) {
        return this.request(`${this.baseURL}/village/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },
    
    // DELETE Village
    async deleteVillage(id) {
        return this.request(`${this.baseURL}/village/${id}`, { method: 'DELETE' });
    },
    
    // GET Crop Years
    async getCropYears() {
        return this.request(`${this.baseURL}/crop-year/?sort_by=updated_at&sort_order=desc`);
    },
    
    // CREATE Crop Year
    async createCropYear(data) {
        return this.request(`${this.baseURL}/crop-year/`, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },
    
    // DELETE Crop Year
    async deleteCropYear(name) {
        return this.request(`${this.baseURL}/crop-year/${encodeURIComponent(name)}`, { method: 'DELETE' });
    },
    
    // GET Commitments
    async getCommitments(cropYearId, page = 1, size = 50, sortBy = 'updated_at', sortOrder = 'desc') {
        return this.request(`${this.baseURL}/commitment/?crop_year_id=${cropYearId}&sort_by=${sortBy}&sort_order=${sortOrder}&page=${page}&size=${size}`);
    },
    
    // GET Commitment by ID
    async getCommitment(id) {
        return this.request(`${this.baseURL}/commitment/${id}`);
    },
    
    // CREATE Commitment
    async createCommitment(data) {
        return this.request(`${this.baseURL}/commitment/`, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },
    
    // UPDATE Commitment
    async updateCommitment(id, data) {
        return this.request(`${this.baseURL}/commitment/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },
    
    // DELETE Commitment
    async deleteCommitment(id) {
        return this.request(`${this.baseURL}/commitment/${id}`, { method: 'DELETE' });
    },
    
    // GET Farmers Invoice
    async getFarmersInvoices(cropYearId, page = 1, size = 50) {
        return this.request(`${this.baseURL}/farmers_invoice/?page=${page}&size=${size}&crop_year_id=${cropYearId}`);
    },
    
    // GET Users
    async getUsers(page = 1, size = 50) {
        return this.request(`${this.baseURL}/users/?sort_by=updated_at&size=${size}&page=${page}&sort_order=desc`);
    },
    
    // GET User by ID
    async getUser(id) {
        return this.request(`${this.baseURL}/users/${id}`);
    },
    
    // CREATE User (Admin)
    async createUser(data) {
        return this.request(`${this.baseURL}/users/admin/`, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },
    
    // UPDATE User
    async updateUser(id, data) {
        return this.request(`${this.baseURL}/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },
    
    // DELETE User
    async deleteUser(id) {
        return this.request(`${this.baseURL}/users/${id}`, { method: 'DELETE' });
    },
};

window.Api = Api;
