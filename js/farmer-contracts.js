// Farmer Contracts (Commitments) Management Page
let contracts = [];
let filteredContracts = [];
let currentPage = 1;
let totalPages = 1;
let pageSize = 10;
let sortField = 'updated_at';
let sortOrder = 'desc';
let deleteTargetId = null;
let editTargetId = null;
let farmers = [];
let provinces = [];
let cities = [];
let villages = [];

document.addEventListener('DOMContentLoaded', () => {
    if (!Auth.isAuthenticated()) {
        window.location.href = '../../index.html';
        return;
    }
    initPage();
});

async function initPage() {
    setupUserInfo();
    setupLogout();
    setupModal();
    setupSearch();
    setupPagination();
    setupCascadingDropdowns();
    await loadContracts();
}

function setupUserInfo() {
    const user = Auth.getCurrentUser();
    const nameEl = document.getElementById('userDisplayName');
    const roleEl = document.getElementById('userType');
    if (nameEl) nameEl.textContent = user?.fullname || user?.username || 'کاربر';
    if (roleEl) roleEl.textContent = Auth.getRoleName(user?.role_id);
}

function setupLogout() {
    document.getElementById('logoutBtn')?.addEventListener('click', () => {
        if (confirm('آیا مطمئن هستید؟')) {
            Auth.logout();
            window.location.href = '../../index.html';
        }
    });
}

function setupModal() {
    const modal = document.getElementById('contractModal');
    const deleteModal = document.getElementById('deleteModal');
    const form = document.getElementById('contractForm');
    
    document.getElementById('addContractBtn')?.addEventListener('click', async () => {
        console.log('Add contract button clicked');
        editTargetId = null;
        document.getElementById('modalTitle').textContent = 'ثبت قرارداد جدید';
        // First load data, then reset input fields only (not selects)
        console.log('Calling loadFormData...');
        await loadFormData();
        console.log('loadFormData completed');
        // Reset only input fields, not select dropdowns
        document.getElementById('commitmentNumber').value = '';
        document.getElementById('amountOfLand').value = '';
        document.getElementById('withdrawalAmount').value = '';
        document.getElementById('dateSet').value = '';
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    });
    
    document.getElementById('closeModal')?.addEventListener('click', closeModal);
    document.getElementById('cancelModal')?.addEventListener('click', closeModal);
    
    modal?.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    
    form?.addEventListener('submit', async (e) => {
        e.preventDefault();
        await saveContract();
    });
    
    // Delete modal
    document.getElementById('cancelDelete')?.addEventListener('click', () => {
        deleteModal.classList.add('hidden');
        deleteModal.classList.remove('flex');
        deleteTargetId = null;
    });
    
    document.getElementById('confirmDelete')?.addEventListener('click', async () => {
        if (deleteTargetId) {
            await deleteContract(deleteTargetId);
        }
    });
}

function closeModal() {
    const modal = document.getElementById('contractModal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    editTargetId = null;
}

function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    let searchTimeout;
    searchInput?.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            const query = e.target.value.trim().toLowerCase();
            if (query) {
                filteredContracts = contracts.filter(c => 
                    c.commitment_number?.toString().includes(query) ||
                    c.farmer_name?.toLowerCase().includes(query) ||
                    c.village_name?.toLowerCase().includes(query)
                );
            } else {
                filteredContracts = [...contracts];
            }
            renderTable();
        }, 300);
    });
}

function setupPagination() {
    document.getElementById('prevPage')?.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            loadContracts();
        }
    });
    
    document.getElementById('nextPage')?.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            loadContracts();
        }
    });
}

async function loadContracts() {
    try {
        const cropYearId = Auth.getCropYearId() || 13;
        const response = await Api.getCommitments(cropYearId, currentPage, pageSize, sortField, sortOrder);
        contracts = response.items || [];
        filteredContracts = [...contracts];
        totalPages = response.pages || 1;
        
        document.getElementById('totalCount').textContent = Utils.toPersianDigits(response.total || 0);
        
        renderTable();
        renderPagination();
    } catch (error) {
        console.error('Error loading contracts:', error);
        showToast('خطا در بارگذاری قراردادها', 'error');
    }
}

async function loadFormData() {
    // Show loading state for selects
    const farmerSelect = document.getElementById('farmerId');
    const provinceSelect = document.getElementById('provinceId');
    
    if (farmerSelect) farmerSelect.innerHTML = '<option value="">در حال بارگذاری کشاورزان...</option>';
    if (provinceSelect) provinceSelect.innerHTML = '<option value="">در حال بارگذاری استان‌ها...</option>';
    
    // Load farmers (load all pages since max size is 100)
    try {
        console.log('Loading farmers...');
        const cropYearId = Auth.getCropYearId() || 13;
        
        // First get page 1 to know total pages
        const firstPage = await Api.getFarmers(1, 100, cropYearId);
        console.log('Farmers first page:', firstPage);
        
        if (!firstPage) {
            console.error('No response from farmers API');
            if (farmerSelect) farmerSelect.innerHTML = '<option value="">خطا - لطفا دوباره وارد شوید</option>';
            return;
        }
        
        farmers = firstPage.items || [];
        const totalPages = firstPage.pages || 1;
        
        // Load remaining pages if needed
        if (totalPages > 1) {
            console.log(`Loading ${totalPages - 1} more pages of farmers...`);
            for (let page = 2; page <= Math.min(totalPages, 10); page++) { // Limit to 10 pages (1000 farmers)
                const pageData = await Api.getFarmers(page, 100, cropYearId);
                if (pageData && pageData.items) {
                    farmers = farmers.concat(pageData.items);
                }
            }
        }
        
        if (farmerSelect) {
            farmerSelect.innerHTML = '<option value="">انتخاب کشاورز...</option>';
            farmers.forEach(f => {
                const option = document.createElement('option');
                option.value = f.id;
                option.textContent = f.full_name || f.fullname || f.farmer_name || `کشاورز ${f.id}`;
                farmerSelect.appendChild(option);
            });
            console.log('Loaded', farmers.length, 'farmers');
        }
    } catch (error) {
        console.error('Error loading farmers:', error);
        if (farmerSelect) farmerSelect.innerHTML = '<option value="">خطا در بارگذاری کشاورزان</option>';
    }
    
    // Load provinces (separate try-catch so it runs even if farmers fail)
    try {
        await loadProvinces();
    } catch (error) {
        console.error('Error loading provinces:', error);
    }
    
    // Reset city and village dropdowns
    const citySelect = document.getElementById('cityId');
    const villageSelect = document.getElementById('villageId');
    if (citySelect) citySelect.innerHTML = '<option value="">ابتدا استان را انتخاب کنید...</option>';
    if (villageSelect) villageSelect.innerHTML = '<option value="">ابتدا شهر را انتخاب کنید...</option>';
}

// Load provinces dropdown
async function loadProvinces() {
    const provinceSelect = document.getElementById('provinceId');
    if (!provinceSelect) {
        console.error('Province select element not found');
        return;
    }
    
    try {
        console.log('Loading provinces...');
        const response = await Api.getProvinces();
        console.log('Provinces response:', response);
        provinces = response.items || response || [];
        provinceSelect.innerHTML = '<option value="">انتخاب استان...</option>';
        provinces.forEach(p => {
            const option = document.createElement('option');
            option.value = p.id;
            option.textContent = p.province || p.province_name || `استان ${p.id}`;
            provinceSelect.appendChild(option);
        });
        console.log('Loaded', provinces.length, 'provinces');
    } catch (error) {
        console.error('Error loading provinces:', error);
        provinceSelect.innerHTML = '<option value="">خطا در بارگذاری استان‌ها</option>';
    }
}

// Load cities when province is selected
async function loadCities(provinceId) {
    const citySelect = document.getElementById('cityId');
    const villageSelect = document.getElementById('villageId');
    
    // Reset city and village
    citySelect.innerHTML = '<option value="">در حال بارگذاری...</option>';
    villageSelect.innerHTML = '<option value="">ابتدا شهر را انتخاب کنید...</option>';
    
    if (!provinceId) {
        citySelect.innerHTML = '<option value="">ابتدا استان را انتخاب کنید...</option>';
        return;
    }
    
    try {
        const response = await Api.getCities(provinceId);
        cities = response.items || response || [];
        citySelect.innerHTML = '<option value="">انتخاب شهر...</option>';
        cities.forEach(c => {
            const option = document.createElement('option');
            option.value = c.id;
            option.textContent = c.city || c.city_name || `شهر ${c.id}`;
            citySelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading cities:', error);
        citySelect.innerHTML = '<option value="">خطا در بارگذاری</option>';
    }
}

// Load villages when city is selected
async function loadVillages(cityId) {
    const villageSelect = document.getElementById('villageId');
    
    if (!cityId) {
        villageSelect.innerHTML = '<option value="">ابتدا شهر را انتخاب کنید...</option>';
        return;
    }
    
    villageSelect.innerHTML = '<option value="">در حال بارگذاری...</option>';
    
    try {
        const cropYearId = Auth.getCropYearId() || 13;
        const response = await Api.getVillages(cityId, cropYearId);
        villages = response.items || response || [];
        villageSelect.innerHTML = '<option value="">انتخاب روستا...</option>';
        villages.forEach(v => {
            const option = document.createElement('option');
            option.value = v.id;
            option.textContent = v.village || v.village_name || `روستا ${v.id}`;
            villageSelect.appendChild(option);
        });
        
        if (villages.length === 0) {
            villageSelect.innerHTML = '<option value="">روستایی یافت نشد</option>';
        }
    } catch (error) {
        console.error('Error loading villages:', error);
        villageSelect.innerHTML = '<option value="">خطا در بارگذاری</option>';
    }
}

// Setup cascading dropdown events
function setupCascadingDropdowns() {
    const provinceSelect = document.getElementById('provinceId');
    const citySelect = document.getElementById('cityId');
    
    provinceSelect?.addEventListener('change', (e) => {
        loadCities(e.target.value);
    });
    
    citySelect?.addEventListener('change', (e) => {
        loadVillages(e.target.value);
    });
}

function renderTable() {
    const tbody = document.getElementById('contractsTable');
    
    if (filteredContracts.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center text-purple-400 py-8">موردی یافت نشد</td></tr>';
        return;
    }
    
    tbody.innerHTML = filteredContracts.map(c => `
        <tr class="table-row border-b border-purple-500/10 transition">
            <td class="py-4 px-4">
                <div class="flex items-center gap-2">
                    <button onclick="viewContract(${c.id})" class="w-7 h-7 bg-purple-500/30 rounded-full flex items-center justify-center text-purple-300 hover:bg-purple-500/50 transition">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                    </button>
                    <span class="text-white font-medium">${Utils.toPersianDigits(c.commitment_number || '-')}</span>
                </div>
            </td>
            <td class="py-4 px-4 text-purple-300">${Utils.toPersianDigits(c.crop_year_name || '-')}</td>
            <td class="py-4 px-4 text-white">${Utils.escapeHtml(c.farmer_name || '-')}</td>
            <td class="py-4 px-4 text-purple-300">${Utils.escapeHtml(c.village_name || '-')}</td>
            <td class="py-4 px-4 text-purple-300">${Utils.toPersianDigits(c.amount_of_land || '0')}</td>
            <td class="py-4 px-4 text-emerald-400 font-medium">${Utils.toPersianDigits(c.withdrawal_amount || '0')}</td>
            <td class="py-4 px-4 text-center">
                <div class="flex items-center justify-center gap-2">
                    <button onclick="editContract(${c.id})" class="p-2 text-purple-400 hover:text-purple-300 hover:bg-purple-500/20 rounded-lg transition" title="ویرایش">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                    </button>
                    <button onclick="confirmDelete(${c.id})" class="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition" title="حذف">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function renderPagination() {
    const container = document.getElementById('paginationNumbers');
    container.innerHTML = '';
    
    // Previous button state
    document.getElementById('prevPage').disabled = currentPage >= totalPages;
    document.getElementById('nextPage').disabled = currentPage <= 1;
    
    // Show page numbers
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);
    
    if (startPage > 1) {
        container.innerHTML += `<button onclick="goToPage(1)" class="w-10 h-10 rounded-lg bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transition">۱</button>`;
        if (startPage > 2) {
            container.innerHTML += `<span class="text-purple-400 px-2">...</span>`;
        }
    }
    
    for (let i = startPage; i <= endPage; i++) {
        const isActive = i === currentPage;
        container.innerHTML += `<button onclick="goToPage(${i})" class="w-10 h-10 rounded-lg ${isActive ? 'bg-purple-500 text-white' : 'bg-purple-500/20 text-purple-300 hover:bg-purple-500/30'} transition">${Utils.toPersianDigits(i)}</button>`;
    }
    
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            container.innerHTML += `<span class="text-purple-400 px-2">...</span>`;
        }
        container.innerHTML += `<button onclick="goToPage(${totalPages})" class="w-10 h-10 rounded-lg bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transition">${Utils.toPersianDigits(totalPages)}</button>`;
    }
}

function goToPage(page) {
    currentPage = page;
    loadContracts();
}

function sortBy(field) {
    if (sortField === field) {
        sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
        sortField = field;
        sortOrder = 'desc';
    }
    currentPage = 1;
    loadContracts();
}

async function editContract(id) {
    try {
        const contract = await Api.getCommitment(id);
        editTargetId = id;
        
        document.getElementById('modalTitle').textContent = 'ویرایش قرارداد';
        await loadFormData();
        
        document.getElementById('commitmentNumber').value = contract.commitment_number || '';
        document.getElementById('farmerId').value = contract.farmer_id || '';
        document.getElementById('amountOfLand').value = contract.amount_of_land || '';
        document.getElementById('withdrawalAmount').value = contract.withdrawal_amount || '';
        document.getElementById('dateSet').value = contract.date_set || '';
        
        // Try to set cascading dropdowns if we have province/city info
        if (contract.province_id) {
            document.getElementById('provinceId').value = contract.province_id;
            await loadCities(contract.province_id);
            
            if (contract.city_id) {
                document.getElementById('cityId').value = contract.city_id;
                await loadVillages(contract.city_id);
                
                if (contract.village_id) {
                    document.getElementById('villageId').value = contract.village_id;
                }
            }
        } else if (contract.village_id) {
            // If we only have village_id, we need to find its city and province
            // For now, just note that the user will need to reselect
            showToast('برای ویرایش، لطفا استان و شهر را مجددا انتخاب کنید', 'info');
        }
        
        const modal = document.getElementById('contractModal');
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    } catch (error) {
        console.error('Error loading contract:', error);
        showToast('خطا در بارگذاری اطلاعات قرارداد', 'error');
    }
}

function viewContract(id) {
    // For now, just edit - can be expanded to show details
    editContract(id);
}

async function saveContract() {
    const cropYearId = Auth.getCropYearId() || 13;
    
    const data = {
        commitment_number: document.getElementById('commitmentNumber').value.trim(),
        farmer_id: parseInt(document.getElementById('farmerId').value),
        village_id: parseInt(document.getElementById('villageId').value),
        amount_of_land: parseFloat(document.getElementById('amountOfLand').value),
        withdrawal_amount: parseFloat(document.getElementById('withdrawalAmount').value),
        date_set: document.getElementById('dateSet').value || null,
        crop_year_id: cropYearId
    };
    
    if (!data.commitment_number || !data.farmer_id || !data.village_id) {
        showToast('لطفا فیلدهای اجباری را پر کنید', 'error');
        return;
    }
    
    try {
        if (editTargetId) {
            await Api.updateCommitment(editTargetId, data);
            showToast('قرارداد با موفقیت ویرایش شد', 'success');
        } else {
            await Api.createCommitment(data);
            showToast('قرارداد با موفقیت ثبت شد', 'success');
        }
        closeModal();
        await loadContracts();
    } catch (error) {
        console.error('Error saving contract:', error);
        showToast('خطا در ذخیره قرارداد', 'error');
    }
}

function confirmDelete(id) {
    deleteTargetId = id;
    const modal = document.getElementById('deleteModal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

async function deleteContract(id) {
    try {
        await Api.deleteCommitment(id);
        showToast('قرارداد با موفقیت حذف شد', 'success');
        const modal = document.getElementById('deleteModal');
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        deleteTargetId = null;
        await loadContracts();
    } catch (error) {
        console.error('Error deleting contract:', error);
        showToast('خطا در حذف قرارداد', 'error');
    }
}

function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `fixed bottom-4 left-4 px-6 py-3 rounded-xl shadow-lg transform transition-all z-50 ${
        type === 'error' ? 'bg-red-500' : type === 'success' ? 'bg-green-500' : 'bg-purple-600'
    } text-white`;
    toast.style.transform = 'translateY(0)';
    toast.style.opacity = '1';
    
    setTimeout(() => {
        toast.style.transform = 'translateY(20px)';
        toast.style.opacity = '0';
    }, 3000);
}
