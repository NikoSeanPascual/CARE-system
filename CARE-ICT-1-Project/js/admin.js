document.addEventListener("DOMContentLoaded", () => {
    const storedUser = sessionStorage.getItem('currentUser');
    if (storedUser) {
        const currentUser = JSON.parse(storedUser);
        const nameEl = document.getElementById('navAdminName');
        if (nameEl) nameEl.textContent = currentUser.name || "Head Nurse Admin";
    }

    loadAdminAnalytics();
    loadAdminRecords();
    loadAdminInventory();
});

function loadAdminAnalytics() {
    // Read from localStorage so data persists across logouts
    const visitHistory = JSON.parse(localStorage.getItem('visitHistory')) || [];

    let totalVisitors = visitHistory.length;
    let activePatients = visitHistory.filter(v => v.status && (v.status.includes('Pending') || v.status.includes('Rest'))).length;
    let medsDispensed = visitHistory.filter(v => v.dispensedMed).length;

    document.getElementById('adminVisitorTotal').textContent = totalVisitors;
    document.getElementById('adminActiveTotal').textContent = activePatients;
    document.getElementById('adminMedsDispensed').textContent = medsDispensed;

    // Calculate frequent symptoms
    let symptomCounts = {};
    visitHistory.forEach(v => {
        if (v.symptoms) {
            v.symptoms.split(',').forEach(s => {
                let cleanSymptom = s.trim();
                symptomCounts[cleanSymptom] = (symptomCounts[cleanSymptom] || 0) + 1;
            });
        }
    });

    const analyticsContainer = document.getElementById('symptomAnalyticsList');
    const sortedSymptoms = Object.entries(symptomCounts).sort((a, b) => b[1] - a[1]);

    if (sortedSymptoms.length === 0) {
        analyticsContainer.innerHTML = `<p style="color: #64748b; font-style: italic; font-size: 0.85rem;">No symptom logs recorded yet today.</p>`;
        return;
    }

    analyticsContainer.innerHTML = sortedSymptoms.map(([symptom, count]) => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px;">
            <span style="font-weight: 600; font-size: 0.9rem; color: #1e293b;">${symptom}</span>
            <span style="background: #eff6ff; color: #2563eb; padding: 3px 10px; border-radius: 12px; font-size: 0.8rem; font-weight: 700;">${count} reported case(s)</span>
        </div>
    `).join('');
}

function loadAdminRecords() {
    const tbody = document.getElementById('adminRecordsTableBody');
    if (!tbody) return;

    // Read from localStorage so data persists across logouts
    const visitHistory = JSON.parse(localStorage.getItem('visitHistory')) || [];
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser')) || {};

    if (visitHistory.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: #64748b; padding: 25px;">No student records found.</td></tr>`;
        return;
    }

    tbody.innerHTML = visitHistory.map(visit => `
        <tr>
            <td>${visit.time}</td>
            <td><strong>${visit.queueNo}</strong></td>
            <td>${visit.studentName || currentUser.name || 'Student Patient'}</td>
            <td>${visit.symptoms}</td>
            <td>${visit.rest}</td>
            <td><span class="status-pill ${visit.status.includes('Cleared') ? 'cleared' : 'pending'}">${visit.status}</span></td>
        </tr>
    `).join('');
}

function loadAdminInventory() {
    const tbody = document.getElementById('adminInventoryTableBody');
    if (!tbody) return;

    const defaultInventory = [
        { name: "Paracetamol 500mg", category: "Analgesic / Fever", stock: 120, status: "In Stock" },
        { name: "Antacid Chewable", category: "Gastrointestinal", stock: 45, status: "In Stock" },
        { name: "Mefenamic Acid 500mg", category: "Pain Relief / Dysmenorrhea", stock: 18, status: "Low Stock" },
        { name: "Adhesive Bandages", category: "First Aid Supply", stock: 200, status: "In Stock" },
        { name: "Oral Rehydration Salt", category: "Hydration", stock: 30, status: "In Stock" }
    ];

    // Read from localStorage so inventory adjustments persist across logouts
    let inventory = JSON.parse(localStorage.getItem('clinicInventory')) || defaultInventory;

    tbody.innerHTML = inventory.map(item => `
        <tr>
            <td style="font-weight: 600;">${item.name}</td>
            <td style="color: #475569;">${item.category}</td>
            <td>${item.stock} units</td>
            <td><span style="color: ${item.stock < 20 ? '#dc2626' : '#16a34a'}; font-weight: 600;">${item.status}</span></td>
        </tr>
    `).join('');
}

function switchAdminSection(sectionId, btnElement) {
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

    if (sectionId === 'dashboard') loadAdminAnalytics();
    if (sectionId === 'records') loadAdminRecords();
    if (sectionId === 'inventory') loadAdminInventory();
}

function handleLogout() {
    sessionStorage.removeItem('currentUser');
    window.location.href = '../index.html';
}

window.switchAdminSection = switchAdminSection;
window.handleLogout = handleLogout;