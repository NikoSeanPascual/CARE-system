document.addEventListener('DOMContentLoaded', () => {
    initSession();
    setupModalListeners();
});

function initSession() {
    if (typeof userDatabase !== 'undefined' && Array.isArray(userDatabase)) {
        currentUser = userDatabase.find(u => u.role === 'student') || userDatabase[0];
    } else {
        currentUser = { name: 'Niko Sean Pascual', identifier: '102-48324', grade: 'Grade 11', section: 'ICT-1' };
    }

    const nameEl = document.getElementById('navStudentName');
    const idEl = document.getElementById('navStudentID');

    if (nameEl) nameEl.textContent = currentUser.name || 'Student';
    if (idEl) idEl.textContent = currentUser.identifier || '---';

    document.querySelectorAll('input[name="symptoms"]').forEach(checkbox => {
        checkbox.addEventListener('change', calculateRestTime);
    });

    renderActiveQueueStatus();
    renderVisitHistory();
}

function setupModalListeners() {
    const closeBtn = document.getElementById('closePassModalBtn');
    const modal = document.getElementById('passModal');

    if (closeBtn) {
        closeBtn.onclick = closePassModal;
    }

    if (modal) {
        modal.onclick = (e) => {
            if (e.target === modal) {
                closePassModal();
            }
        };
    }
}

function closePassModal() {
    const modal = document.getElementById('passModal');
    if (modal) {
        modal.classList.add('hidden');
        modal.style.display = 'none';
    }
}

function openPassModal(visit) {
    if (!visit) return;

    const elQueue = document.getElementById('modalQueueNo');
    const elName = document.getElementById('modalStudentName');
    const elID = document.getElementById('modalStudentID');
    const elGrade = document.getElementById('modalStudentGrade');
    const elTime = document.getElementById('modalVisitTime');
    const elSymptoms = document.getElementById('modalSymptoms');
    const elComplaint = document.getElementById('modalComplaint');
    const elRest = document.getElementById('modalRestDuration');
    const elStatus = document.getElementById('modalStatus');

    if (elQueue) elQueue.textContent = visit.queueNo || '#Q-000';
    if (elName) elName.textContent = visit.studentName || '---';
    if (elID) elID.textContent = visit.studentID || '---';
    if (elGrade) elGrade.textContent = visit.gradeSection || '---';
    if (elTime) elTime.textContent = visit.timestamp || '---';
    if (elSymptoms) elSymptoms.textContent = Array.isArray(visit.symptoms) ? visit.symptoms.join(', ') : (visit.symptoms || 'None');
    if (elComplaint) elComplaint.textContent = visit.complaint || 'N/A';
    if (elRest) elRest.textContent = visit.restDuration || '0 Mins';
    if (elStatus) elStatus.textContent = visit.status || 'Pending Triage';

    const modal = document.getElementById('passModal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
    }
}

function openPassModalById(visitId) {
    if (typeof clinicVisits !== 'undefined') {
        const visit = clinicVisits.find(v => v.id === visitId);
        if (visit) openPassModal(visit);
    }
}

function switchSection(sectionId, element) {
    document.querySelectorAll('.dashboard-section').forEach(sec => sec.classList.add('hidden'));
    document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));

    const target = document.getElementById(`sec-${sectionId}`);
    if (target) target.classList.remove('hidden');
    if (element) element.classList.add('active');
}

function calculateRestTime() {
    const checked = document.querySelectorAll('input[name="symptoms"]:checked');
    let maxRest = 0;
    let hasHigh = false;
    let hasMedium = false;

    checked.forEach(cb => {
        const rest = parseInt(cb.dataset.rest, 10) || 0;
        const severity = cb.dataset.severity;

        if (rest > maxRest) maxRest = rest;
        if (severity === 'high') hasHigh = true;
        if (severity === 'medium') hasMedium = true;
    });

    const display = document.getElementById('calculatedRestDisplay');
    const badge = document.getElementById('severityDisplay');

    if (display) display.textContent = `${maxRest} Minutes`;

    if (badge) {
        if (hasHigh) {
            badge.textContent = 'High Severity (Priority)';
            badge.style.background = '#fef2f2';
            badge.style.color = '#ef4444';
        } else if (hasMedium) {
            badge.textContent = 'Moderate Concern';
            badge.style.background = '#fffbe2';
            badge.style.color = '#b45309';
        } else {
            badge.textContent = 'Standard / Low Severity';
            badge.style.background = '#e2e8f0';
            badge.style.color = '#475569';
        }
    }
}

function handleVisitSubmit(event) {
    event.preventDefault();

    const selectedSymptoms = Array.from(document.querySelectorAll('input[name="symptoms"]:checked')).map(cb => cb.value);
    const chiefComplaint = document.getElementById('chiefComplaint').value.trim();
    const restDuration = document.getElementById('calculatedRestDisplay') ? document.getElementById('calculatedRestDisplay').textContent : '0 Minutes';

    if (selectedSymptoms.length === 0) {
        alert('Please select at least one symptom.');
        return;
    }

    const queueCount = (typeof clinicVisits !== 'undefined') ? clinicVisits.length : 0;
    const queueNumber = `Q-${String(queueCount + 1).padStart(3, '0')}`;

    const newVisit = {
        id: `VISIT-${Date.now()}`,
        queueNo: queueNumber,
        studentID: currentUser.identifier,
        studentName: currentUser.name,
        gradeSection: `${currentUser.grade || ''} ${currentUser.section || ''}`.trim() || 'N/A',
        symptoms: selectedSymptoms,
        complaint: chiefComplaint,
        restDuration: restDuration,
        status: 'Pending Triage',
        timestamp: new Date().toLocaleString()
    };

    if (typeof clinicVisits !== 'undefined') {
        clinicVisits.push(newVisit);
    }

    const form = document.getElementById('visitForm');
    if (form) form.reset();

    calculateRestTime();

    openPassModal(newVisit);
    renderActiveQueueStatus();
    renderVisitHistory();
}

function renderActiveQueueStatus() {
    if (typeof clinicVisits === 'undefined') return;

    const studentId = currentUser.identifier;
    const activeVisit = clinicVisits.slice().reverse().find(v => v.studentID === studentId && v.status === 'Pending Triage');

    const container = document.getElementById('queueStatusContent');
    if (!container) return;

    if (activeVisit) {
        container.innerHTML = `
            <div class="queue-badge-box">
                <span class="queue-num">${activeVisit.queueNo}</span>
                <span class="queue-status">In Queue • ${activeVisit.status}</span>
                <button type="button" class="btn-primary-sm mt-20" style="width:100%" onclick="openPassModalById('${activeVisit.id}')">View Health Slip</button>
            </div>
        `;
    } else {
        container.innerHTML = `<p class="no-queue">No active clinic visit currently pending.</p>`;
    }
}

function renderVisitHistory() {
    const tbody = document.getElementById('historyTableBody');
    if (!tbody || typeof clinicVisits === 'undefined') return;

    const userVisits = clinicVisits.filter(v => v.studentID === currentUser.identifier);

    if (userVisits.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:#94a3b8;">No medical visits recorded yet.</td></tr>`;
        return;
    }

    tbody.innerHTML = userVisits.map(v => `
        <tr>
            <td>${v.timestamp}</td>
            <td><strong>${v.queueNo}</strong></td>
            <td>${v.symptoms.join(', ')}</td>
            <td>${v.restDuration}</td>
            <td><span class="status-pill ${v.status === 'Cleared' ? 'cleared' : 'pending'}">${v.status}</span></td>
            <td><button type="button" class="btn-secondary" onclick="openPassModalById('${v.id}')">Slip</button></td>
        </tr>
    `).join('');
}

function handleLogout() {
    window.location.href = '../index.html';
}

window.closePassModal = closePassModal;
window.openPassModalById = openPassModalById;
window.switchSection = switchSection;
window.handleVisitSubmit = handleVisitSubmit;
window.handleLogout = handleLogout;