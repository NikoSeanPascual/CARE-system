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

    // Ensure modal is hidden initially on load
    const modal = document.getElementById('actionModal');
    if (modal) {
        modal.classList.add('hidden');
        modal.style.display = 'none';
    }

    renderQueueTable();
    renderInventoryTable();
});

function renderQueueTable() {
    const tbody = document.getElementById('staffQueueTableBody');
    if (!tbody) return;

    const visitHistory = JSON.parse(localStorage.getItem('visitHistory')) || [];
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser')) || {};

    let pendingCount = 0;
    let restingCount = 0;
    let clearedCount = 0;

    if (visitHistory.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted, #64748b); padding: 25px;">No patient check-ins found in the queue.</td></tr>`;
        updateMetrics(0, 0, 0);
        return;
    }

    tbody.innerHTML = visitHistory.map(visit => {
        if (visit.status && visit.status.includes('Pending')) pendingCount++;
        else if (visit.status && (visit.status.includes('Rest') || visit.status.includes('Approved'))) restingCount++;
        else if (visit.status && visit.status.includes('Cleared')) clearedCount++;

        const studentName = visit.studentName || currentUser.name || "Student Patient";

        return `
            <tr>
                <td style="font-weight: bold; color: #2563eb;">${visit.queueNo}</td>
                <td>${studentName}</td>
                <td>${visit.symptoms}</td>
                <td style="font-weight: 600;">${visit.rest}</td>
                <td><span class="status-pill pending">${visit.status}</span></td>
                <td>
                    <button class="btn-primary-sm" onclick="openActionModal('${visit.queueNo}')">Manage</button>
                </td>
            </tr>
        `;
    }).join('');

    updateMetrics(pendingCount, restingCount, clearedCount);
}

function updateMetrics(pending, resting, cleared) {
    const pEl = document.getElementById('metricPending');
    const rEl = document.getElementById('metricResting');
    const cEl = document.getElementById('metricCleared');

    if (pEl) pEl.textContent = pending;
    if (rEl) rEl.textContent = resting;
    if (cEl) cEl.textContent = cleared;
}

function renderInventoryTable() {
    const tbody = document.getElementById('staffInventoryTableBody');
    if (!tbody) return;

    let inventory = JSON.parse(localStorage.getItem('clinicInventory')) || defaultInventory;

    tbody.innerHTML = inventory.map(item => `
        <tr>
            <td style="font-weight: 600;">${item.name}</td>
            <td>${item.category}</td>
            <td>${item.stock} units</td>
            <td><span style="color: ${item.stock < 20 ? '#ef4444' : '#10b981'}; font-weight: 600;">${item.status}</span></td>
        </tr>
    `).join('');
}

function openActionModal(queueNo) {
    currentSelectedQueueNo = queueNo;
    const queueDisplay = document.getElementById('actionModalQueue');
    if (queueDisplay) queueDisplay.textContent = "Updating Ticket: " + queueNo;

    const modal = document.getElementById('actionModal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
    }
}

function closeActionModal() {
    const modal = document.getElementById('actionModal');
    if (modal) {
        modal.classList.add('hidden');
        modal.style.display = 'none';
    }
}

function saveVisitAction() {
    if (!currentSelectedQueueNo) return;

    const statusSelect = document.getElementById('actionStatusSelect');
    const medSelect = document.getElementById('actionMedSelect');

    const newStatus = statusSelect ? statusSelect.value : 'Updated';
    const selectedMed = medSelect ? medSelect.value : '';

    let visitHistory = JSON.parse(localStorage.getItem('visitHistory')) || [];
    let visit = visitHistory.find(v => v.queueNo === currentSelectedQueueNo);

    if (visit) {
        visit.status = newStatus;
        if (selectedMed) {
            visit.dispensedMed = selectedMed;
            deductInventory(selectedMed);
        }
        localStorage.setItem('visitHistory', JSON.stringify(visitHistory));
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
    let inventory = JSON.parse(localStorage.getItem('clinicInventory')) || defaultInventory;
    let item = inventory.find(i => i.name.toLowerCase().includes(medName.toLowerCase()));
    if (item && item.stock > 0) {
        item.stock -= 1;
        if (item.stock < 20) item.status = "Low Stock";
        localStorage.setItem('clinicInventory', JSON.stringify(inventory));
    }
}

function switchStaffSection(sectionId, btnElement) {
    document.querySelectorAll('.dashboard-section').forEach(sec => sec.classList.add('hidden'));
    const target = document.getElementById('sec-' + sectionId);
    if (target) target.classList.remove('hidden');

    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.classList.remove('active');
    });

    if (btnElement) {
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