// Farmer Invoice Page - صورتحساب کشاورزان
let invoices = [];
let filteredInvoices = [];
let currentPage = 1;
let totalPages = 1;
let pageSize = 50;

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
    setupSearch();
    setupPagination();
    await loadInvoices();
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

function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    let searchTimeout;
    searchInput?.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            const query = e.target.value.trim().toLowerCase();
            if (query) {
                filteredInvoices = invoices.filter(inv => 
                    inv.farmer_name?.toLowerCase().includes(query)
                );
            } else {
                filteredInvoices = [...invoices];
            }
            renderTable();
        }, 300);
    });
}

function setupPagination() {
    document.getElementById('prevPage')?.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            loadInvoices();
        }
    });
    
    document.getElementById('nextPage')?.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            loadInvoices();
        }
    });
}

async function loadInvoices() {
    try {
        const cropYearId = Auth.getCropYearId() || 13;
        const response = await Api.getFarmersInvoices(cropYearId, currentPage, pageSize);
        invoices = response.items || [];
        filteredInvoices = [...invoices];
        totalPages = response.pages || 1;
        
        // Update summary cards
        document.getElementById('totalCount').textContent = Utils.toPersianDigits(response.total || 0);
        document.getElementById('totalReceivable').textContent = Utils.formatNumber(response.total_farmers_receivable || 0);
        document.getElementById('totalWeight').textContent = Utils.formatNumber(response.total_delivered_beet_weight || 0);
        document.getElementById('totalLoadPrice').textContent = Utils.formatNumber(response.total_load_price || 0);
        
        renderTable();
        renderPagination();
    } catch (error) {
        console.error('Error loading invoices:', error);
        showToast('خطا در بارگذاری صورتحساب‌ها', 'error');
    }
}

function renderTable() {
    const tbody = document.getElementById('invoicesTable');
    
    if (filteredInvoices.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" class="text-center text-purple-400 py-8">موردی یافت نشد</td></tr>';
        return;
    }
    
    tbody.innerHTML = filteredInvoices.map(inv => {
        const balance = inv.remaining_receivable_payable_balance || 0;
        const balanceClass = balance >= 0 ? 'text-emerald-400' : 'text-red-400';
        const statusClass = inv.payed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400';
        const statusText = inv.payed ? 'تسویه شده' : 'در انتظار';
        
        return `
            <tr class="table-row border-b border-purple-500/10 transition">
                <td class="py-4 px-4 text-white font-medium">${Utils.escapeHtml(inv.farmer_name || '-')}</td>
                <td class="py-4 px-4 text-purple-300">${Utils.toPersianDigits(inv.total_weight || 0)}</td>
                <td class="py-4 px-4 text-purple-300">${Utils.formatNumber(inv.total_seed_cost || 0)}</td>
                <td class="py-4 px-4 text-purple-300">${Utils.formatNumber(inv.total_pesticide_cost || 0)}</td>
                <td class="py-4 px-4 text-purple-300">${Utils.formatNumber(inv.one_percent_deduction || 0)}</td>
                <td class="py-4 px-4 text-blue-400">${Utils.formatNumber(inv.pure_payable || 0)}</td>
                <td class="py-4 px-4 ${balanceClass} font-medium">${Utils.formatNumber(balance)}</td>
                <td class="py-4 px-4 text-purple-300">${inv.newest_date || '-'}</td>
                <td class="py-4 px-4 text-center">
                    <span class="px-3 py-1 rounded-full text-xs font-medium ${statusClass}">${statusText}</span>
                </td>
            </tr>
        `;
    }).join('');
}

function renderPagination() {
    const container = document.getElementById('paginationNumbers');
    container.innerHTML = '';
    
    document.getElementById('prevPage').disabled = currentPage >= totalPages;
    document.getElementById('nextPage').disabled = currentPage <= 1;
    
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
    loadInvoices();
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
