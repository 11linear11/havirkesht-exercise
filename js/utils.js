// Utility Functions
const Utils = {
    formatNumber(num) {
        if (num == null) return '۰';
        return new Intl.NumberFormat('fa-IR').format(num);
    },
    
    toPersianDigits(str) {
        if (!str) return '';
        const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
        return str.toString().replace(/[0-9]/g, d => persianDigits[d]);
    },
    
    toEnglishDigits(str) {
        if (!str) return '';
        return str.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d));
    },
    
    escapeHtml(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    },
    
    showToast(message, type = 'info', duration = 3000) {
        const colors = {
            success: 'bg-green-500',
            error: 'bg-red-500',
            warning: 'bg-yellow-500',
            info: 'bg-blue-500'
        };
        
        const toast = document.createElement('div');
        toast.className = `fixed top-4 left-4 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all transform translate-x-[-100%]`;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        requestAnimationFrame(() => {
            toast.style.transform = 'translateX(0)';
        });
        
        setTimeout(() => {
            toast.style.transform = 'translateX(-100%)';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    },
    
    showLoading(message = 'در حال بارگذاری...') {
        let overlay = document.getElementById('loadingOverlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'loadingOverlay';
            overlay.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50';
            overlay.innerHTML = `
                <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center">
                    <div class="w-12 h-12 border-4 border-purple-400/30 border-t-purple-400 rounded-full animate-spin mx-auto mb-4"></div>
                    <p class="text-white" id="loadingMessage">${message}</p>
                </div>
            `;
            document.body.appendChild(overlay);
        } else {
            overlay.classList.remove('hidden');
            const msg = overlay.querySelector('#loadingMessage');
            if (msg) msg.textContent = message;
        }
    },
    
    hideLoading() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) overlay.classList.add('hidden');
    },
    
    confirm(title, message, onConfirm) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-purple-900/90 backdrop-blur-lg rounded-2xl p-6 max-w-sm w-full mx-4 border border-purple-400/20">
                <h3 class="text-white text-lg font-bold mb-2">${title}</h3>
                <p class="text-purple-200 mb-6">${message}</p>
                <div class="flex gap-3">
                    <button id="confirmYes" class="flex-1 bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-lg transition-colors">بله</button>
                    <button id="confirmNo" class="flex-1 bg-white/10 hover:bg-white/20 text-white py-2 px-4 rounded-lg transition-colors">خیر</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        modal.querySelector('#confirmYes').onclick = () => {
            modal.remove();
            onConfirm();
        };
        modal.querySelector('#confirmNo').onclick = () => modal.remove();
        modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
    }
};

window.Utils = Utils;
