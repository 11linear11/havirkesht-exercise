// Sidebar Template - مشترک برای همه صفحات
function getSidebarHTML(activePage = '') {
    return `
        <aside class="w-72 bg-black/30 backdrop-blur-xl border-l border-purple-500/20 flex flex-col">
            <div class="p-6 border-b border-purple-500/20">
                <div class="flex items-center gap-4">
                    <div class="w-14 h-14 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl shadow-purple-500/30">
                        <svg class="w-9 h-9 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C9.5 2 7.5 4 7.5 6.5c0 1.5.7 2.8 1.8 3.7C8.5 11.5 8 13.2 8 15c0 4 2 7 4 7s4-3 4-7c0-1.8-.5-3.5-1.3-4.8 1.1-.9 1.8-2.2 1.8-3.7C16.5 4 14.5 2 12 2z"/></svg>
                    </div>
                    <div>
                        <h1 class="text-white font-bold text-xl">هاویرکشت</h1>
                        <p class="text-purple-300 text-sm">کشت قراردادی چغندر</p>
                    </div>
                </div>
            </div>
            <nav class="flex-1 p-4 space-y-2 overflow-y-auto">
                <!-- داشبورد -->
                <a href="dashboard.html" class="flex items-center gap-3 px-4 py-3 rounded-xl ${activePage === 'dashboard' ? 'bg-purple-500/30 text-white border border-purple-400/40' : 'text-purple-200 hover:bg-purple-500/20'} transition">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                    <span>داشبورد</span>
                </a>
                
                <!-- داده های اولیه -->
                <div class="pt-2">
                    <button onclick="toggleSubmenu('baseDataMenu')" class="w-full flex items-center justify-between px-4 py-3 rounded-xl text-purple-200 hover:bg-purple-500/20 transition">
                        <div class="flex items-center gap-3">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"></path></svg>
                            <span>داده های اولیه</span>
                        </div>
                        <svg id="baseDataArrow" class="w-4 h-4 transition-transform ${['crop-year', 'province'].includes(activePage) ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                    </button>
                    <div id="baseDataMenu" class="${['crop-year', 'province'].includes(activePage) ? '' : 'hidden'} mt-1 mr-4 space-y-1 border-r border-purple-500/30 pr-2">
                        <a href="crop-year.html" class="flex items-center gap-3 px-4 py-2 rounded-lg ${activePage === 'crop-year' ? 'bg-purple-500/30 text-white border border-purple-400/40' : 'text-purple-300 hover:bg-purple-500/20 hover:text-white'} transition text-sm">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            <span>ثبت سال زراعی</span>
                        </a>
                        <a href="province.html" class="flex items-center gap-3 px-4 py-2 rounded-lg ${activePage === 'province' ? 'bg-purple-500/30 text-white border border-purple-400/40' : 'text-purple-300 hover:bg-purple-500/20 hover:text-white'} transition text-sm">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
                            <span>ثبت استان</span>
                        </a>
                    </div>
                </div>
                
                <!-- عملیات کشاورز -->
                <div class="pt-2">
                    <button onclick="toggleSubmenu('farmerOpsMenu')" class="w-full flex items-center justify-between px-4 py-3 rounded-xl text-purple-200 hover:bg-purple-500/20 transition">
                        <div class="flex items-center gap-3">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                            <span>عملیات کشاورز</span>
                        </div>
                        <svg id="farmerOpsArrow" class="w-4 h-4 transition-transform ${['farmer-contracts', 'farmer-invoice'].includes(activePage) ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                    </button>
                    <div id="farmerOpsMenu" class="${['farmer-contracts', 'farmer-invoice'].includes(activePage) ? '' : 'hidden'} mt-1 mr-4 space-y-1 border-r border-purple-500/30 pr-2">
                        <a href="farmer-contracts.html" class="flex items-center gap-3 px-4 py-2 rounded-lg ${activePage === 'farmer-contracts' ? 'bg-purple-500/30 text-white border border-purple-400/40' : 'text-purple-300 hover:bg-purple-500/20 hover:text-white'} transition text-sm">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                            <span>ثبت قرارداد کشاورزان</span>
                        </a>
                        <a href="farmer-invoice.html" class="flex items-center gap-3 px-4 py-2 rounded-lg ${activePage === 'farmer-invoice' ? 'bg-purple-500/30 text-white border border-purple-400/40' : 'text-purple-300 hover:bg-purple-500/20 hover:text-white'} transition text-sm">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                            <span>صورتحساب کشاورزان</span>
                        </a>
                    </div>
                </div>
                
                <!-- مدیریت کاربران -->
                <a href="manage-users.html" class="flex items-center gap-3 px-4 py-3 rounded-xl ${activePage === 'manage-users' ? 'bg-purple-500/30 text-white border border-purple-400/40' : 'text-purple-200 hover:bg-purple-500/20'} transition">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                    <span>مدیریت کاربران</span>
                </a>
            </nav>
            <div class="p-4 border-t border-purple-500/20">
                <div class="flex items-center gap-3 mb-4 p-3 bg-purple-500/10 rounded-xl">
                    <div class="w-12 h-12 bg-purple-500/30 rounded-full flex items-center justify-center">
                        <svg class="w-6 h-6 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                    </div>
                    <div>
                        <p id="userDisplayName" class="text-white font-medium">کاربر</p>
                        <p id="userType" class="text-purple-300 text-sm">پیمانکار</p>
                    </div>
                </div>
                <button id="logoutBtn" class="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-500/20 text-red-300 hover:bg-red-500/30 transition font-medium">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                    <span>خروج از حساب</span>
                </button>
            </div>
        </aside>
    `;
}

function toggleSubmenu(id) {
    const menu = document.getElementById(id);
    const arrowId = id.replace('Menu', 'Arrow');
    const arrow = document.getElementById(arrowId);
    menu.classList.toggle('hidden');
    if (arrow) {
        if (!menu.classList.contains('hidden')) {
            arrow.style.transform = 'rotate(180deg)';
        } else {
            arrow.style.transform = 'rotate(0deg)';
        }
    }
}

window.getSidebarHTML = getSidebarHTML;
window.toggleSubmenu = toggleSubmenu;
