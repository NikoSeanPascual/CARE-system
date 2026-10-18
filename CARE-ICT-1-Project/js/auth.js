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

    if (!fullNameInput || !studentIDInput || !gradeInput || !sectionInput || !contactInput || !passwordInput || !confirmPassword) {
        showAlert("Please fill out all required fields!", "error");
        return;
    }

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

    const nameWords = fullNameInput.split(' ').filter(word => word.length > 0);

    if (nameWords.length < 2) {
        showAlert("Please enter both your First Name and Last Name!", "error");
        return;
    }

    const validIdChars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '-', ','];
    let isIdValid = true;

    for (let char of studentIDInput) {
        if (!validIdChars.includes(char)) {
            isIdValid = false;
            break;
        }
    }

    if (!isIdValid) {
        showAlert("Student ID can only contain numbers, hyphens (-), and commas (,).", "error");
        return;
    }

    if (passwordInput !== confirmPassword) {
        showAlert("Passwords do not match!", "error");
        return;
    }

    if (!termsCheck) {
        showAlert("You must agree to the Terms & Conditions to register.", "error");
        return;
    }

    const newStudentUser = {
        identifier: studentIDInput,
        password: passwordInput,
        role: 'student',
        name: fullNameInput,
        grade: gradeInput,
        section: sectionInput,
        contact: contactInput
    };

    let sessionUsers = JSON.parse(sessionStorage.getItem('sessionUsers')) || [];
    sessionUsers.push(newStudentUser);
    sessionStorage.setItem('sessionUsers', JSON.stringify(sessionUsers));

    sessionStorage.setItem('currentUser', JSON.stringify(newStudentUser));

    showAlert("Account registered successfully! Redirecting to dashboard...", "success");

    setTimeout(() => {
        window.location.href = 'pages/student.html';
    }, 1200);
}

function handleLogin(event) {
    event.preventDefault();

    const role = document.getElementById('loginRole').value;
    const identifier = document.getElementById('loginIdentifier').value.trim();
    const password = document.getElementById('loginPassword').value;

    let sessionUsers = JSON.parse(sessionStorage.getItem('sessionUsers')) || [];
    const allUsers = [...userDatabase, ...sessionUsers];

    const user = allUsers.find(u =>
        u.identifier.toLowerCase() === identifier.toLowerCase() &&
        u.password === password &&
        u.role === role
    );

    if (!user) {
        showAlert('Invalid credentials or selected role mismatch.', 'error');
        return;
    }

    sessionStorage.setItem('currentUser', JSON.stringify(user));

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

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(inputId + '-icon');
    if (input.type === "password") {
        input.type = "text";
        if (icon) icon.src = "assets/open-eye.png";
    } else {
        input.type = "password";
        if (icon) icon.src = "assets/close-eye.png";
    }
}

window.switchTab = switchTab;
window.handleSignup = handleSignup;
window.handleLogin = handleLogin;
window.openTermsModal = openTermsModal;
window.closeTermsModal = closeTermsModal;
window.closeTermsModalOnOverlay = closeTermsModalOnOverlay;
window.acceptTermsFromModal = acceptTermsFromModal;
window.togglePassword = togglePassword;