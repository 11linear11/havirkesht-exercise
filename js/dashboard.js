// Dashboard Page - Based on edu.havirkesht.ir/DashBoard
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
    setupSidebar();
    await loadDashboardData();
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
        Auth.logout();
        window.location.href = '../../index.html';
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

async function loadDashboardData() {
    try {
        const cropYearId = Auth.getCropYearId();
        const data = await Api.getReportFull(cropYearId);
        
        // سال زراعی
        document.getElementById('cropYearName').textContent = Utils.toPersianDigits(data.crop_year_name || '1404');
        
        // مانده فعلی در حساب پیمانکار
        document.getElementById('contractorBalance').textContent = Utils.formatNumber(data.current_contractor_remaining_balance || 0);
        
        // تعداد قرارداد کشاورزان
        document.getElementById('farmersCommitmentCount').textContent = Utils.toPersianDigits(String(data.farmers_commitment_count || 0));
        
        // کل تناژ تحویلی کشاورزان
        document.getElementById('totalDeliveredTonnage').textContent = Utils.formatNumber(data.total_delivered_tonnage || 0);
        
        // جمع بدهی به کشاورزان
        document.getElementById('totalFarmersDebt').textContent = Utils.formatNumber(data.total_farmers_debt || 0);
        
        // جمع طلب از کشاورزان
        document.getElementById('totalFarmersReceivable').textContent = Utils.formatNumber(data.total_farmers_receivable || 0);
        
        // مانده تا تسویه کشاورزان
        document.getElementById('farmersRemainingSettlement').textContent = Utils.formatNumber(data.farmers_remaining_settlement || 0);
        
        // کارمزد پیمانکار (یک درصد)
        document.getElementById('contractorFee').textContent = Utils.formatNumber(data.contractor_fee || 0);
        
        // سود پیمانکار از بذر
        document.getElementById('contractorSeedProfit').textContent = Utils.formatNumber(data.contractor_seed_profit || 0);
        
        // سود پیمانکار از سم
        document.getElementById('contractorPesticideProfit').textContent = Utils.formatNumber(data.contractor_pesticide_profit || 0);
        
        // وضعیت کلی پیمانکار
        document.getElementById('overallContractorStatus').textContent = Utils.formatNumber(data.overall_contractor_status || 0);
        
        // تاریخ گزارش
        document.getElementById('reportGeneratedAt').textContent = Utils.toPersianDigits(data.report_generated_at || '-');
        
    } catch (error) {
        console.error('Error loading dashboard:', error);
        Utils.showToast('خطا در بارگذاری داشبورد', 'error');
    }
}
