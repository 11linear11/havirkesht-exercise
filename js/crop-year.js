// Crop Year Management Page
let cropYears = [];
let filteredCropYears = [];
let deleteTargetName = null;

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
    await loadCropYears();
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
    const modal = document.getElementById('cropYearModal');
    const deleteModal = document.getElementById('deleteModal');
    const form = document.getElementById('cropYearForm');
    
    document.getElementById('addCropYearBtn')?.addEventListener('click', () => {
        document.getElementById('modalTitle').textContent = 'ایجاد سال زراعی جدید';
        document.getElementById('cropYearName').value = '';
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
        await saveCropYear();
    });
    
    // Delete modal
    document.getElementById('cancelDelete')?.addEventListener('click', () => {
        deleteModal.classList.add('hidden');
        deleteModal.classList.remove('flex');
        deleteTargetName = null;
    });
    
    document.getElementById('confirmDelete')?.addEventListener('click', async () => {
        if (deleteTargetName) {
            await deleteCropYear(deleteTargetName);
        }
    });
}

function closeModal() {
    const modal = document.getElementById('cropYearModal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    searchInput?.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        if (query) {
            filteredCropYears = cropYears.filter(cy => 
                cy.crop_year_name?.toString().includes(query)
            );
        } else {
            filteredCropYears = [...cropYears];
        }
        renderTable();
    });
}

async function loadCropYears() {
    try {
        const response = await Api.getCropYears();
        cropYears = response.items || response || [];
        filteredCropYears = [...cropYears];
        
        // Fill dropdown
        const select = document.getElementById('cropYearSelect');
        select.innerHTML = '<option value="">انتخاب کنید</option>';
        cropYears.forEach(cy => {
            const option = document.createElement('option');
            option.value = cy.id;
            option.textContent = Utils.toPersianDigits(cy.crop_year_name);
            select.appendChild(option);
        });
        
        // Set current year if exists
        const currentYearId = Auth.getCropYearId();
        if (currentYearId) {
            select.value = currentYearId;
        }
        
        renderTable();
    } catch (error) {
        console.error('Error loading crop years:', error);
        showToast('خطا در بارگذاری سال‌های زراعی', 'error');
    }
}

function renderTable() {
    const tbody = document.getElementById('cropYearsTable');
    
    if (filteredCropYears.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" class="text-center text-purple-400 py-8">موردی یافت نشد</td></tr>';
        return;
    }
    
    tbody.innerHTML = filteredCropYears.map(cy => `
        <tr class="table-row border-b border-purple-500/10 transition">
            <td class="py-4 px-4">
                <span class="text-white font-medium">${Utils.toPersianDigits(cy.crop_year_name)}</span>
            </td>
            <td class="py-4 px-4 text-purple-300">${Utils.toPersianDigits(cy.created_at || '-')}</td>
            <td class="py-4 px-4 text-center">
                <button onclick="confirmDelete('${cy.crop_year_name}')" class="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition" title="حذف">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
            </td>
        </tr>
    `).join('');
}

async function saveCropYear() {
    const nameInput = document.getElementById('cropYearName');
    const name = nameInput.value.trim();
    
    if (!name) {
        showToast('لطفا نام سال زراعی را وارد کنید', 'error');
        return;
    }
    
    try {
        await Api.createCropYear({ crop_year_name: name });
        showToast('سال زراعی با موفقیت ایجاد شد', 'success');
        closeModal();
        await loadCropYears();
    } catch (error) {
        console.error('Error creating crop year:', error);
        showToast('خطا در ایجاد سال زراعی', 'error');
    }
}

function confirmDelete(name) {
    deleteTargetName = name;
    const modal = document.getElementById('deleteModal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

async function deleteCropYear(name) {
    try {
        await Api.deleteCropYear(name);
        showToast('سال زراعی با موفقیت حذف شد', 'success');
        const modal = document.getElementById('deleteModal');
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        deleteTargetName = null;
        await loadCropYears();
    } catch (error) {
        console.error('Error deleting crop year:', error);
        showToast('خطا در حذف سال زراعی', 'error');
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
