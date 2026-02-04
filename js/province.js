// Province Management Page
let provinces = [];
let filteredProvinces = [];
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
    await loadProvinces();
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
    const modal = document.getElementById('provinceModal');
    const deleteModal = document.getElementById('deleteModal');
    const form = document.getElementById('provinceForm');
    
    document.getElementById('addProvinceBtn')?.addEventListener('click', () => {
        document.getElementById('modalTitle').textContent = 'ثبت استان جدید';
        document.getElementById('provinceName').value = '';
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
        await saveProvince();
    });
    
    // Delete modal
    document.getElementById('cancelDelete')?.addEventListener('click', () => {
        deleteModal.classList.add('hidden');
        deleteModal.classList.remove('flex');
        deleteTargetName = null;
    });
    
    document.getElementById('confirmDelete')?.addEventListener('click', async () => {
        if (deleteTargetName) {
            await deleteProvince(deleteTargetName);
        }
    });
}

function closeModal() {
    const modal = document.getElementById('provinceModal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    searchInput?.addEventListener('input', (e) => {
        const query = e.target.value.trim().toLowerCase();
        if (query) {
            filteredProvinces = provinces.filter(p => 
                p.province?.toLowerCase().includes(query)
            );
        } else {
            filteredProvinces = [...provinces];
        }
        renderTable();
        updateCount();
    });
}

async function loadProvinces() {
    try {
        const response = await Api.getProvinces();
        provinces = response.items || response || [];
        filteredProvinces = [...provinces];
        renderTable();
        updateCount();
    } catch (error) {
        console.error('Error loading provinces:', error);
        showToast('خطا در بارگذاری استان‌ها', 'error');
    }
}

function updateCount() {
    const countEl = document.getElementById('totalCount');
    if (countEl) {
        countEl.textContent = Utils.toPersianDigits(filteredProvinces.length);
    }
}

function renderTable() {
    const tbody = document.getElementById('provincesTable');
    
    if (filteredProvinces.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" class="text-center text-purple-400 py-8">موردی یافت نشد</td></tr>';
        return;
    }
    
    tbody.innerHTML = filteredProvinces.map(p => `
        <tr class="table-row border-b border-purple-500/10 transition">
            <td class="py-4 px-4">
                <span class="text-white font-medium">${Utils.escapeHtml(p.province)}</span>
            </td>
            <td class="py-4 px-4 text-purple-300">${Utils.toPersianDigits(p.created_at || '-')}</td>
            <td class="py-4 px-4 text-center">
                <button onclick="confirmDelete('${p.province.replace(/'/g, "\\'")}')" class="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition" title="حذف">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
            </td>
        </tr>
    `).join('');
}

async function saveProvince() {
    const nameInput = document.getElementById('provinceName');
    const name = nameInput.value.trim();
    
    if (!name) {
        showToast('لطفا نام استان را وارد کنید', 'error');
        return;
    }
    
    try {
        await Api.createProvince({ province: name });
        showToast('استان با موفقیت ثبت شد', 'success');
        closeModal();
        await loadProvinces();
    } catch (error) {
        console.error('Error creating province:', error);
        showToast('خطا در ثبت استان', 'error');
    }
}

function confirmDelete(name) {
    deleteTargetName = name;
    const modal = document.getElementById('deleteModal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

async function deleteProvince(name) {
    try {
        await Api.deleteProvince(name);
        showToast('استان با موفقیت حذف شد', 'success');
        const modal = document.getElementById('deleteModal');
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        deleteTargetName = null;
        await loadProvinces();
    } catch (error) {
        console.error('Error deleting province:', error);
        showToast('خطا در حذف استان', 'error');
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
