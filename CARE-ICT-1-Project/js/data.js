(function seedInitialData() {
    if (!localStorage.getItem('care_users')) {
        const defaultUsers = [
            {
                id: "ADMIN-001",
                name: "Head Nurse Office",
                identifier: "admin@school.edu",
                password: "adminpassword",
                role: "admin"
            },
            {
                id: "STAFF-001",
                name: "Clinic Assistant",
                identifier: "staff@school.edu",
                password: "staffpassword",
                role: "staff"
            }
        ];
        localStorage.setItem('care_users', JSON.stringify(defaultUsers));
    }

    if (!localStorage.getItem('care_visits')) {
        localStorage.setItem('care_visits', JSON.stringify([]));
    }
})();