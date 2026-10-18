let currentSelectedQueueNo = null;

const defaultInventory = [
    { name: "Paracetamol 500mg", category: "Analgesic / Fever", stock: 120, status: "In Stock" },
    { name: "Antacid Chewable", category: "Gastrointestinal", stock: 45, status: "In Stock" },
    { name: "Mefenamic Acid 500mg", category: "Pain Relief / Dysmenorrhea", stock: 18, status: "Low Stock" },
    { name: "Adhesive Bandages", category: "First Aid Supply", stock: 200, status: "In Stock" },
    { name: "Oral Rehydration Salt", category: "Hydration", stock: 30, status: "In Stock" }
];

document.addEventListener("DOMContentLoaded", () => {
    const storedUser = sessionStorage.getItem('currentUser');
    if (storedUser) {
        const currentUser = JSON.parse(storedUser);
        const nameEl = document.getElementById('navStaffName');
        if (nameEl) nameEl.textContent = currentUser.name || "Clinic Staff";
    }

    renderQueueTable();
    renderInventoryTable();
});

function renderQueueTable() {
    const tbody = document.getElementById('staffQueueTableBody');
    if (!tbody) return;

    const visitHistory = JSON.parse(sessionStorage.getItem('visitHistory')) || [];
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser')) || {};

    let pendingCount = 0;
    let restingCount = 0;
    let clearedCount = 0;

    if (visitHistory.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: #64748b; padding: 25px;">No patient check-ins found in the queue.</td></tr>`;
        updateMetrics(0, 0, 0);
        return;
    }

    tbody.innerHTML = visitHistory.map(visit => {
        if (visit.status.includes('Pending')) pendingCount++;
        else if (visit.status.includes('Rest') || visit.status.includes('Approved')) restingCount++;
        else if (visit.status.includes('Cleared')) clearedCount++;

        // Use stored student name or current user fallback
        const studentName = visit.studentName || currentUser.name || "Student Patient";

        return `
            <tr style="border-bottom: 1px solid #f1f5f9; font-size: 0.9rem; color: #1e293b;">
                <td style="padding: 14px; font-weight: bold; color: #2563eb;">${visit.queueNo}</td>
                <td style="padding: 14px;">${studentName}</td>
                <td style="padding: 14px; color: #475569;">${visit.symptoms}</td>
                <td style="padding: 14px; font-weight: 600;">${visit.rest}</td>
                <td style="padding: 14px;"><span style="padding: 4px 10px; border-radius: 4px; font-size: 0.75rem; font-weight: 600; background: #e2e8f0; color: #334155;">${visit.status}</span></td>
                <td style="padding: 14px;">
                    <button onclick="openActionModal('${visit.queueNo}')" style="background: #2563eb; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 0.8rem; font-weight: 600;">Manage</button>
                </td>
            </tr>
        `;
    }).join('');

    updateMetrics(pendingCount, restingCount, clearedCount);
}

function updateMetrics(pending, resting, cleared) {
    document.getElementById('metricPending').textContent = pending;
    document.getElementById('metricResting').textContent = resting;
    document.getElementById('metricCleared').textContent = cleared;
}

function renderInventoryTable() {
    const tbody = document.getElementById('staffInventoryTableBody');
    if (!tbody) return;

    let inventory = JSON.parse(sessionStorage.getItem('clinicInventory')) || defaultInventory;

    tbody.innerHTML = inventory.map(item => `
        <tr style="border-bottom: 1px solid #f1f5f9; font-size: 0.9rem; color: #1e293b;">
            <td style="padding: 14px; font-weight: 600;">${item.name}</td>
            <td style="padding: 14px; color: #475569;">${item.category}</td>
            <td style="padding: 14px;">${item.stock} units</td>
            <td style="padding: 14px;"><span style="color: ${item.stock < 20 ? '#dc2626' : '#16a34a'}; font-weight: 600;">${item.status}</span></td>
        </tr>
    `).join('');
}

function openActionModal(queueNo) {
    currentSelectedQueueNo = queueNo;
    document.getElementById('actionModalQueue').textContent = "Updating Ticket: " + queueNo;
    const modal = document.getElementById('actionModal');
    if (modal) modal.classList.remove('hidden');
}

function closeActionModal() {
    const modal = document.getElementById('actionModal');
    if (modal) modal.classList.add('hidden');
}

function saveVisitAction() {
    if (!currentSelectedQueueNo) return;

    const newStatus = document.getElementById('actionStatusSelect').value;
    const selectedMed = document.getElementById('actionMedSelect').value;

    let visitHistory = JSON.parse(sessionStorage.getItem('visitHistory')) || [];
    let visit = visitHistory.find(v => v.queueNo === currentSelectedQueueNo);

    if (visit) {
        visit.status = newStatus;
        if (selectedMed) {
            visit.dispensedMed = selectedMed;
            deductInventory(selectedMed);
        }
        sessionStorage.setItem('visitHistory', JSON.stringify(visitHistory));
    }

    let activeVisit = JSON.parse(sessionStorage.getItem('activeVisit'));
    if (activeVisit && activeVisit.queueNo === currentSelectedQueueNo) {
        activeVisit.status = newStatus;
        sessionStorage.setItem('activeVisit', JSON.stringify(activeVisit));
    }

    closeActionModal();
    renderQueueTable();
    renderInventoryTable();
}

function deductInventory(medName) {
    let inventory = JSON.parse(sessionStorage.getItem('clinicInventory')) || defaultInventory;
    let item = inventory.find(i => i.name.toLowerCase().includes(medName.toLowerCase()));
    if (item && item.stock > 0) {
        item.stock -= 1;
        if (item.stock < 20) item.status = "Low Stock";
        sessionStorage.setItem('clinicInventory', JSON.stringify(inventory));
    }
}

function switchStaffSection(sectionId, btnElement) {
    document.querySelectorAll('.dashboard-section').forEach(sec => sec.classList.add('hidden'));
    const target = document.getElementById('sec-' + sectionId);
    if (target) target.classList.remove('hidden');

    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.style.background = 'transparent';
        btn.style.color = '#64748b';
        btn.classList.remove('active');
    });

    if (btnElement) {
        btnElement.style.background = '#eff6ff';
        btnElement.style.color = '#2563eb';
        btnElement.classList.add('active');
    }
}

function handleLogout() {
    sessionStorage.removeItem('currentUser');
    window.location.href = '../index.html';
}

function toggleMobileSidebar() {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        sidebar.classList.toggle('mobile-open');
    }
}

document.addEventListener('click', function(event) {
    const sidebar = document.querySelector('.sidebar');
    const hamburger = document.querySelector('.hamburger-btn');

    if (window.innerWidth <= 768 && sidebar && sidebar.classList.contains('mobile-open')) {
        if (!sidebar.contains(event.target) && hamburger && !hamburger.contains(event.target)) {
            sidebar.classList.remove('mobile-open');
        }
    }
});

window.toggleMobileSidebar = toggleMobileSidebar;

window.switchStaffSection = switchStaffSection;
window.openActionModal = openActionModal;
window.closeActionModal = closeActionModal;
window.saveVisitAction = saveVisitAction;
window.handleLogout = handleLogout;