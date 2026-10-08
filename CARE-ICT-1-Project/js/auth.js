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
        if (glider) glider.style.transform = 'translateX(0%)';
    } else {
        signupForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
        toggleSignupBtn.classList.add('active');
        toggleLoginBtn.classList.remove('active');
        if (glider) glider.style.transform = 'translateX(100%)';
    }
}

// nagdidiisplay ng alert messages
function showAlert(message, type = 'error') {
    const alertBox = document.getElementById('alertBox');
    if (alertBox) {
        alertBox.textContent = message;
        alertBox.className = `alert-box ${type}`;
    }
}

function hideAlert() {
    const alertBox = document.getElementById('alertBox');
    if (alertBox) {
        alertBox.className = 'alert-box hidden';
    }
}

function openTermsModal(event) {
    if (event) event.preventDefault();
    const modal = document.getElementById('termsModal');
    if (modal) modal.classList.remove('hidden');
}

function closeTermsModal() {
    const modal = document.getElementById('termsModal');
    if (modal) modal.classList.add('hidden');
}

function closeTermsModalOnOverlay(event) {
    if (event.target.id === 'termsModal') {
        closeTermsModal();
    }
}

function acceptTermsFromModal() {
    const termsCheck = document.getElementById('signupTerms');
    if (termsCheck) termsCheck.checked = true;
    closeTermsModal();
}

function handleSignup(event) {
    event.preventDefault();

    const fullNameInput = document.getElementById('signupFullName').value.trim();
    const studentIDInput = document.getElementById('signupStudentID').value.trim();
    const gradeInput = document.getElementById('signupGrade').value;
    const sectionInput = document.getElementById('signupSection').value.trim();
    const contactInput = document.getElementById('signupContact').value.trim();
    const passwordInput = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    const termsCheck = document.getElementById('signupTerms').checked;
    const alertBox = document.getElementById('alertBox');

    function showAlert(message, type) {
        if (!alertBox) return;
        alertBox.innerText = message;
        alertBox.className = `alert-box ${type}`;
        alertBox.classList.remove('hidden');
    }

    // ito yung nagchecheck na lahat ay hindi empty
    if (!fullNameInput || !studentIDInput || !gradeInput || !sectionInput || !contactInput || !passwordInput || !confirmPassword) {
        showAlert("Please fill out all required fields!", "error");
        return;
    }

    // nag checheck na bawal ang numbers sa Full Name
    const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    let nameHasNumber = false;

    for (let char of fullNameInput) {
        if (numbers.includes(char)) {
            nameHasNumber = true;
            break;
        }
    }

    if (nameHasNumber) {
        showAlert("Full Name cannot contain numbers!", "error");
        return;
    }

    // ito ang nagchecheck na meron dapat ng first and last name
    const nameWords = fullNameInput.split(' ').filter(word => word.length > 0);

    if (nameWords.length < 2) {
        showAlert("Please enter both your First Name and Last Name!", "error");
        return;
    }

    // nag checheck na dapat may - or letters ang student ID
    let studentIDHasLetter = false;
    const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

    for (let char of studentIDInput) {
        if (alphabet.includes(char)) {
            studentIDHasLetter = true;
            break;
        }
    }

    if (!studentIDHasLetter) {
        showAlert("Student ID cannot be numbers only! Please include letters or hyphens (e.g. 2024-12345 or STU-123).", "error");
        return;
    }

    // nagchecheck na nagmatch yung password
    if (passwordInput !== confirmPassword) {
        showAlert("Passwords do not match!", "error");
        return;
    }

    // yung checker na dapat inaccept sa terms and condition
    if (!termsCheck) {
        showAlert("You must agree to the Terms & Conditions to register.", "error");
        return;
    }

    // pag naaccept na ang and registration
    showAlert("Account registered successfully! Redirecting...", "success");

    setTimeout(() => {
        if (typeof switchTab === 'function') {
            switchTab('login');
        }
    }, 1500);
}

function handleLogin(event) {
    event.preventDefault();

    const role = document.getElementById('loginRole').value;
    const identifier = document.getElementById('loginIdentifier').value.trim();
    const password = document.getElementById('loginPassword').value;

    // dito nagsesearch kung yung account ay nasa existing
    const user = userDatabase.find(u =>
        u.identifier.toLowerCase() === identifier.toLowerCase() &&
        u.password === password &&
        u.role === role
    );

    if (!user) {
        showAlert('Invalid credentials or selected role mismatch.', 'error');
        return;
    }

    currentUser = user;

    showAlert('Login successful! Redirecting...', 'success');

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

window.switchTab = switchTab;
window.handleSignup = handleSignup;
window.handleLogin = handleLogin;
window.openTermsModal = openTermsModal;
window.closeTermsModal = closeTermsModal;
window.closeTermsModalOnOverlay = closeTermsModalOnOverlay;
window.acceptTermsFromModal = acceptTermsFromModal;
