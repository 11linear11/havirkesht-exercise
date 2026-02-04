// Manage Users Page - Based on edu.havirkesht.ir/manageUser
let currentPage = 1;
let totalPages = 1;

document.addEventListener('DOMContentLoaded', () => {
    if (!Auth.isAuthenticated()) {
        window.location.href = '../../index.html';
        return;
    }
    
    // Check if admin
    const user = Auth.getCurrentUser();
    if (user?.role_id !== 1) {
        Utils.showToast('دسترسی غیرمجاز', 'error');
        window.location.href = 'dashboard.html';
        return;
    }
    
    initPage();
});

async function initPage() {
    setupUserInfo();
    setupLogout();
    setupSidebar();
    setupModal();
    await loadUsers();
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
        Utils.confirm('خروج', 'آیا مطمئن هستید؟', () => {
            Auth.logout();
            window.location.href = '../../index.html';
        });
    });
}

function setupSidebar() {
    const toggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    toggle?.addEventListener('click', () => {
        sidebar?.classList.toggle('open');
        overlay?.classList.toggle('hidden');
    });
    
    overlay?.addEventListener('click', () => {
        sidebar?.classList.remove('open');
        overlay?.classList.add('hidden');
    });
}

function setupModal() {
    const modal = document.getElementById('userModal');
    const form = document.getElementById('userForm');
    
    document.getElementById('addUserBtn')?.addEventListener('click', () => openModal());
    document.getElementById('closeModal')?.addEventListener('click', closeModal);
    document.getElementById('cancelModal')?.addEventListener('click', closeModal);
    
    modal?.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    
    form?.addEventListener('submit', async (e) => {
        e.preventDefault();
        await saveUser();
    });
}

async function loadUsers(page = 1) {
    const tbody = document.getElementById('usersTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '<tr><td colspan="7" class="text-center py-8 text-purple-300">در حال بارگذاری...</td></tr>';
    
    try {
        const data = await Api.getUsers(page, 50);
        const users = data.items || [];
        totalPages = data.pages || 1;
        currentPage = page;
        
        if (users.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center py-8 text-purple-300">کاربری یافت نشد</td></tr>';
            return;
        }
        
        tbody.innerHTML = users.map((u, i) => `
            <tr class="border-b border-purple-400/10 hover:bg-white/5">
                <td class="py-3 px-4 text-purple-200">${Utils.toPersianDigits(String((page-1)*50 + i + 1))}</td>
                <td class="py-3 px-4 text-white">${Utils.escapeHtml(u.username || '-')}</td>
                <td class="py-3 px-4 text-purple-200">${Utils.escapeHtml(u.fullname || '-')}</td>
                <td class="py-3 px-4 text-purple-200">${getRoleBadge(u.role_id)}</td>
                <td class="py-3 px-4 text-purple-200">${Utils.escapeHtml(u.phone_number || '-')}</td>
                <td class="py-3 px-4">
                    <span class="${u.is_active ? 'text-green-400' : 'text-red-400'}">${u.is_active ? 'فعال' : 'غیرفعال'}</span>
                </td>
                <td class="py-3 px-4">
                    <button onclick="editUser(${u.id})" class="text-purple-400 hover:text-purple-300 ml-2"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></button>
                    <button onclick="deleteUser(${u.id})" class="text-red-400 hover:text-red-300"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>
                </td>
            </tr>
        `).join('');
        
        updatePagination();
    } catch (error) {
        console.error('Error loading users:', error);
        tbody.innerHTML = '<tr><td colspan="7" class="text-center py-8 text-red-300">خطا در بارگذاری</td></tr>';
    }
}

function getRoleBadge(roleId) {
    const roles = {
        1: { name: 'مدیر', color: 'bg-purple-500' },
        2: { name: 'پیمانکار', color: 'bg-blue-500' },
        3: { name: 'کشاورز', color: 'bg-green-500' },
        4: { name: 'راننده', color: 'bg-orange-500' }
    };
    const role = roles[roleId] || { name: 'نامشخص', color: 'bg-gray-500' };
    return `<span class="px-2 py-1 rounded-full text-xs ${role.color} text-white">${role.name}</span>`;
}

function updatePagination() {
    const container = document.getElementById('pagination');
    if (!container) return;
    
    container.innerHTML = `
        <button onclick="loadUsers(${currentPage - 1})" ${currentPage <= 1 ? 'disabled' : ''} class="px-3 py-1 rounded bg-white/10 text-white disabled:opacity-50">قبلی</button>
        <span class="text-purple-200">صفحه ${Utils.toPersianDigits(String(currentPage))} از ${Utils.toPersianDigits(String(totalPages))}</span>
        <button onclick="loadUsers(${currentPage + 1})" ${currentPage >= totalPages ? 'disabled' : ''} class="px-3 py-1 rounded bg-white/10 text-white disabled:opacity-50">بعدی</button>
    `;
}

function openModal(user = null) {
    const modal = document.getElementById('userModal');
    const title = document.getElementById('modalTitle');
    const form = document.getElementById('userForm');
    const passwordField = document.getElementById('passwordField');
    
    form.reset();
    document.getElementById('userId').value = user?.id || '';
    title.textContent = user ? 'ویرایش کاربر' : 'افزودن کاربر';
    
    // Show/hide password field for new users
    passwordField.classList.toggle('hidden', !!user);
    
    if (user) {
        document.getElementById('userUsername').value = user.username || '';
        document.getElementById('userFullname').value = user.fullname || '';
        document.getElementById('userRole').value = user.role_id || '';
        document.getElementById('userPhone').value = user.phone_number || '';
        document.getElementById('userActive').checked = user.is_active !== false;
    }
    
    modal.classList.remove('hidden');
}

function closeModal() {
    document.getElementById('userModal').classList.add('hidden');
}

async function saveUser() {
    const id = document.getElementById('userId').value;
    const data = {
        username: document.getElementById('userUsername').value,
        fullname: document.getElementById('userFullname').value,
        role_id: parseInt(document.getElementById('userRole').value),
        phone_number: document.getElementById('userPhone').value,
        is_active: document.getElementById('userActive').checked,
    };
    
    // Only include password for new users
    if (!id) {
        const password = document.getElementById('userPassword').value;
        if (!password) {
            Utils.showToast('رمز عبور الزامی است', 'error');
            return;
        }
        data.password = password;
    }
    
    Utils.showLoading('در حال ذخیره...');
    
    try {
        if (id) {
            await Api.updateUser(id, data);
            Utils.showToast('کاربر ویرایش شد', 'success');
        } else {
            await Api.createUser(data);
            Utils.showToast('کاربر اضافه شد', 'success');
        }
        closeModal();
        await loadUsers(currentPage);
    } catch (error) {
        Utils.showToast(error.message || 'خطا در ذخیره', 'error');
    } finally {
        Utils.hideLoading();
    }
}

window.editUser = async function(id) {
    Utils.showLoading('در حال بارگذاری...');
    try {
        const user = await Api.getUser(id);
        openModal(user);
    } catch (error) {
        Utils.showToast('خطا در بارگذاری', 'error');
    } finally {
        Utils.hideLoading();
    }
};

window.deleteUser = function(id) {
    const currentUser = Auth.getCurrentUser();
    if (currentUser?.id === id) {
        Utils.showToast('نمی‌توانید خودتان را حذف کنید', 'error');
        return;
    }
    
    Utils.confirm('حذف کاربر', 'آیا مطمئن هستید؟', async () => {
        Utils.showLoading('در حال حذف...');
        try {
            await Api.deleteUser(id);
            Utils.showToast('کاربر حذف شد', 'success');
            await loadUsers(currentPage);
        } catch (error) {
            Utils.showToast(error.message || 'خطا در حذف', 'error');
        } finally {
            Utils.hideLoading();
        }
    });
};

// Search
window.searchUsers = function(query) {
    // For simple search, reload with filter
    loadUsers(1);
};
