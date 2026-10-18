document.addEventListener('change', function(event) {
    if (event.target.name === 'symptoms') {
        updateRestPreview();
    }
});

function updateRestPreview() {
    const checkboxes = document.querySelectorAll('input[name="symptoms"]:checked');
    let maxRest = 0;
    let maxSeverity = 'Low';
    let severityRank = { 'low': 1, 'medium': 2, 'high': 3 };

    checkboxes.forEach(cb => {
        const rest = parseInt(cb.getAttribute('data-rest')) || 0;
        const severity = cb.getAttribute('data-severity') || 'low';

        // kinukuha yung maximum rest time sa halip na iadd sila lahat
        if (rest > maxRest) {
            maxRest = rest;
        }

        if (severityRank[severity] > severityRank[maxSeverity.toLowerCase()]) {
            maxSeverity = severity.charAt(0).toUpperCase() + severity.slice(1);
        }
    });

    if (checkboxes.length === 0) {
        maxRest = 0;
        maxSeverity = 'Low';
    }

    const restDisplay = document.getElementById('calculatedRestDisplay');
    const severityDisplay = document.getElementById('severityDisplay');

    if (restDisplay) restDisplay.textContent = maxRest + ' Minutes';
    if (severityDisplay) {
        severityDisplay.textContent = maxSeverity + ' Severity';
        severityDisplay.className = `severity-badge ${maxSeverity.toLowerCase()}`;
    }
}

// yung naghahandle ng mga  Visit Form Submission at Queue Generation
function handleVisitSubmit(event) {
    event.preventDefault();

    const checkboxes = document.querySelectorAll('input[name="symptoms"]:checked');
    if (checkboxes.length === 0) {
        alert("Please select at least one symptom.");
        return;
    }

    const complaint = document.getElementById('chiefComplaint').value.trim();
    if (!complaint) {
        alert("Please describe your chief complaint or symptoms.");
        return;
    }

    let maxRest = 0;
    let maxSeverity = 'Low';
    let symptomList = [];
    let severityRank = { 'low': 1, 'medium': 2, 'high': 3 };

    checkboxes.forEach(cb => {
        const rest = parseInt(cb.getAttribute('data-rest')) || 0;
        if (rest > maxRest) {
            maxRest = rest;
        }

        const sev = cb.getAttribute('data-severity') || 'low';
        if (severityRank[sev] > severityRank[maxSeverity.toLowerCase()]) {
            maxSeverity = sev.charAt(0).toUpperCase() + sev.slice(1);
        }
        symptomList.push(cb.value);
    });

    const currentUser = JSON.parse(sessionStorage.getItem('currentUser')) || {
        name: "Student Patient",
        identifier: "2024-0000",
        grade: "Grade 11",
        section: "ICT-1"
    };

    const queueNo = "#Q-" + Math.floor(100 + Math.random() * 900);
    const visitTime = new Date().toLocaleString();

    document.getElementById('modalQueueNo').textContent = queueNo;
    document.getElementById('modalStudentName').textContent = currentUser.name;
    document.getElementById('modalStudentID').textContent = currentUser.identifier;
    document.getElementById('modalStudentGrade').textContent = (currentUser.grade || '') + ' ' + (currentUser.section || '');
    document.getElementById('modalVisitTime').textContent = visitTime;
    document.getElementById('modalSymptoms').textContent = symptomList.join(', ');
    document.getElementById('modalComplaint').textContent = complaint;
    document.getElementById('modalRestDuration').textContent = maxRest + ' Mins';

    const statusEl = document.getElementById('modalStatus');
    statusEl.textContent = 'Pending Triage (' + maxSeverity + ')';
    statusEl.className = 'status-pill pending';

    const activeVisit = {
        queueNo: queueNo,
        symptoms: symptomList.join(', '),
        rest: maxRest + ' Mins',
        status: 'Pending Triage',
        time: visitTime,
        complaint: complaint,
        severity: maxSeverity
    };
    sessionStorage.setItem('activeVisit', JSON.stringify(activeVisit));

    let visitHistory = JSON.parse(sessionStorage.getItem('visitHistory')) || [];
    visitHistory.unshift(activeVisit);
    sessionStorage.setItem('visitHistory', JSON.stringify(visitHistory));

    updateActiveQueueDisplay(activeVisit);
    loadVisitHistory();

    const modal = document.getElementById('passModal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
    }
}

function loadVisitHistory() {
    const tbody = document.getElementById('historyTableBody');
    if (!tbody) return;

    const visitHistory = JSON.parse(sessionStorage.getItem('visitHistory')) || [];

    if (visitHistory.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); font-style: italic; padding: 20px;">No past clinic visits recorded yet.</td></tr>`;
        return;
    }

    tbody.innerHTML = visitHistory.map(v => `
        <tr>
            <td>${v.time}</td>
            <td><strong>${v.queueNo}</strong></td>
            <td>${v.symptoms}</td>
            <td>${v.rest}</td>
            <td><span class="status-pill pending">${v.status}</span></td>
            <td><button class="btn-secondary" style="padding: 4px 10px; font-size: 0.75rem; cursor: pointer;" onclick="viewPassModal('${v.queueNo}')">View Slip</button></td>
        </tr>
    `).join('');
}

function viewPassModal(queueNo) {
    const visitHistory = JSON.parse(sessionStorage.getItem('visitHistory')) || [];
    const visit = visitHistory.find(v => v.queueNo === queueNo);
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser')) || {};

    if (!visit) return;

    document.getElementById('modalQueueNo').textContent = visit.queueNo;
    document.getElementById('modalStudentName').textContent = currentUser.name || 'Student';
    document.getElementById('modalStudentID').textContent = currentUser.identifier || '---';
    document.getElementById('modalStudentGrade').textContent = (currentUser.grade || '') + ' ' + (currentUser.section || '');
    document.getElementById('modalVisitTime').textContent = visit.time;
    document.getElementById('modalSymptoms').textContent = visit.symptoms;
    document.getElementById('modalComplaint').textContent = visit.complaint || 'N/A';
    document.getElementById('modalRestDuration').textContent = visit.rest;

    const statusEl = document.getElementById('modalStatus');
    statusEl.textContent = visit.status;
    statusEl.className = 'status-pill pending';

    const modal = document.getElementById('passModal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
    }
}

function updateActiveQueueDisplay(visit) {
    const queueContainer = document.getElementById('queueStatusContent');
    if (queueContainer) {
        queueContainer.innerHTML = `
            <div class="queue-badge-box">
                <span class="queue-num">${visit.queueNo}</span>
                <span class="queue-status">${visit.status}</span>
            </div>
            <p style="font-size: 0.8rem; margin-top: 8px; color: var(--text-muted);">Rest Time: <strong>${visit.rest}</strong></p>
        `;
    }
}

function closePassModal() {
    const modal = document.getElementById('passModal');
    if (modal) {
        modal.classList.add('hidden');
        modal.style.display = 'none';
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const storedUser = sessionStorage.getItem('currentUser');
    if (storedUser) {
        const currentUser = JSON.parse(storedUser);
        const nameEl = document.getElementById('navStudentName');
        const idEl = document.getElementById('navStudentID');

        if (nameEl) nameEl.textContent = currentUser.name;
        if (idEl) idEl.textContent = currentUser.identifier;
    }

    const savedVisit = sessionStorage.getItem('activeVisit');
    if (savedVisit) {
        updateActiveQueueDisplay(JSON.parse(savedVisit));
    }

    loadVisitHistory();
});

function switchSection(sectionId, btnElement) {
    const sections = document.querySelectorAll('.dashboard-section');
    sections.forEach(sec => sec.classList.add('hidden'));

    const targetSection = document.getElementById('sec-' + sectionId);
    if (targetSection) {
        targetSection.classList.remove('hidden');
    }

    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));
    if (btnElement) {
        btnElement.classList.add('active');
    }

    if (sectionId === 'my-history') {
        loadVisitHistory();
    }
}

function handleLogout() {
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('activeVisit');
    sessionStorage.removeItem('visitHistory');
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
window.switchSection = switchSection;
window.handleVisitSubmit = handleVisitSubmit;
window.closePassModal = closePassModal;
window.handleLogout = handleLogout;
window.viewPassModal = viewPassModal;
