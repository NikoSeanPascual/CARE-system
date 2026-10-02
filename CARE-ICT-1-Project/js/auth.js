function switchTab(tab) {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const toggleLoginBtn = document.getElementById('toggleLoginBtn');
    const toggleSignupBtn = document.getElementById('toggleSignupBtn');
    const glider = document.getElementById('tabGlider');

    hideAlert();

    if (tab === 'login') {
        loginForm.classList.remove('hidden');
        signupForm.classList.add('hidden');
        toggleLoginBtn.classList.add('active');
        toggleSignupBtn.classList.remove('active');
        glider.style.transform = 'translateX(0%)';
    } else {
        signupForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
        toggleSignupBtn.classList.add('active');
        toggleLoginBtn.classList.remove('active');
        glider.style.transform = 'translateX(100%)';
    }
}

// nagdidiisplay ng alert messages
function showAlert(message, type = 'error') {
    const alertBox = document.getElementById('alertBox');
    alertBox.textContent = message;
    alertBox.className = `alert-box ${type}`;
}

function hideAlert() {
    const alertBox = document.getElementById('alertBox');
    alertBox.className = 'alert-box hidden';
}

// ito yung naghahandle ng Student Registration
function handleSignup(event) {
    event.preventDefault();

    const fullName = document.getElementById('signupFullName').value.trim();
    const studentID = document.getElementById('signupStudentID').value.trim();
    const grade = document.getElementById('signupGrade').value;
    const section = document.getElementById('signupSection').value.trim();
    const contact = document.getElementById('signupContact').value.trim();
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;

    // Password Match Check
    if (password !== confirmPassword) {
        showAlert('Passwords do not match.', 'error');
        return;
    }

    // Phone Number Validation
    const phoneRegex = /^[0-9]{11}$/;
    if (!phoneRegex.test(contact)) {
        showAlert('Please enter a valid 11-digit phone number.', 'error');
        return;
    }

    const users = JSON.parse(localStorage.getItem('care_users')) || [];

    // ito yung nagchecheck if my Duplicate
    const existingUser = users.find(u => u.identifier.toLowerCase() === studentID.toLowerCase());
    if (existingUser) {
        showAlert('An account with this Student ID already exists.', 'error');
        return;
    }

    const newUser = {
        id: `STU-${Date.now()}`,
        name: fullName,
        identifier: studentID,
        grade: grade,
        section: section,
        contact: contact,
        password: password,
        role: 'student'
    };

    users.push(newUser);
    localStorage.setItem('care_users', JSON.stringify(users));

    showAlert('Registration successful! You can now login.', 'success');
    document.getElementById('signupForm').reset();

    setTimeout(() => {
        switchTab('login');
    }, 1500);
}

// ito yung naghahandle ng Login Authentication at Routing
function handleLogin(event) {
    event.preventDefault();

    const role = document.getElementById('loginRole').value;
    const identifier = document.getElementById('loginIdentifier').value.trim();
    const password = document.getElementById('loginPassword').value;

    const users = JSON.parse(localStorage.getItem('care_users')) || [];

    // Authentication ng mga credentials and role
    const user = users.find(u =>
        u.identifier.toLowerCase() === identifier.toLowerCase() &&
        u.password === password &&
        u.role === role
    );

    if (!user) {
        showAlert('Invalid credentials or selected role mismatch.', 'error');
        return;
    }

    // Guys dito ilalagay yung pinaka active session user details
    const sessionUser = {
        id: user.id,
        name: user.name,
        identifier: user.identifier,
        role: user.role,
        grade: user.grade || '',
        section: user.section || ''
    };

    localStorage.setItem('care_session', JSON.stringify(sessionUser));

    showAlert('Login successful! Redirecting...', 'success');

    // ito yung Route based ng user role
    setTimeout(() => {
        switch (role) {
            case 'admin':
                window.location.href = 'pages/admin.html';
                break;
            case 'staff':
                window.location.href = 'pages/staff.html';
                break;
            case 'student':
            default:
                window.location.href = 'pages/student.html';
                break;
        }
    }, 1000);
}
// --- Modal Handlers ---
function openTermsModal(event) {
    if (event) event.preventDefault();
    document.getElementById('termsModal').classList.remove('hidden');
}

function closeTermsModal() {
    document.getElementById('termsModal').classList.add('hidden');
}

function closeTermsModalOnOverlay(event) {
    if (event.target.id === 'termsModal') {
        closeTermsModal();
    }
}

function acceptTermsFromModal() {
    document.getElementById('signupTerms').checked = true;
    closeTermsModal();
}

// --- Updated handleSignup with Checkbox Verification ---
function handleSignup(event) {
    event.preventDefault();

    const fullName = document.getElementById('signupFullName').value.trim();
    const studentID = document.getElementById('signupStudentID').value.trim();
    const grade = document.getElementById('signupGrade').value;
    const section = document.getElementById('signupSection').value.trim();
    const contact = document.getElementById('signupContact').value.trim();
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    const termsAccepted = document.getElementById('signupTerms').checked;

    // Check Terms Agreement
    if (!termsAccepted) {
        showAlert('You must agree to the Terms & Conditions to register.', 'error');
        return;
    }

    if (password !== confirmPassword) {
        showAlert('Passwords do not match.', 'error');
        return;
    }

    const phoneRegex = /^[0-9]{11}$/;
    if (!phoneRegex.test(contact)) {
        showAlert('Please enter a valid 11-digit phone number.', 'error');
        return;
    }

    const users = JSON.parse(localStorage.getItem('care_users')) || [];

    const existingUser = users.find(u => u.identifier.toLowerCase() === studentID.toLowerCase());
    if (existingUser) {
        showAlert('An account with this Student ID already exists.', 'error');
        return;
    }

    const newUser = {
        id: `STU-${Date.now()}`,
        name: fullName,
        identifier: studentID,
        grade: grade,
        section: section,
        contact: contact,
        password: password,
        role: 'student',
        agreedToTermsAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('care_users', JSON.stringify(users));

    showAlert('Registration successful! You can now login.', 'success');
    document.getElementById('signupForm').reset();

    setTimeout(() => {
        switchTab('login');
    }, 1500);
}