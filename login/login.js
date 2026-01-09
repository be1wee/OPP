document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('auth_token');
    const currentPage = window.location.pathname;
    
    if (!token && !currentPage.includes('login') && !currentPage.includes('register')) {
        window.location.href = '/login/';
    }
    if (token && (currentPage.includes('login') || currentPage.includes('register'))) {
        window.location.href = '/';
    }
});

document.getElementById("loginForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await axios.post("http://193.124.112.102/api/login", {
            email: email,
            password: password
        });

        localStorage.setItem("auth_token", response.data.token);
        localStorage.setItem("userEmail", email);

        alert("Успешный вход!");
        window.location.href = "../";

    } catch (error) {
        if (!error.response) {
            alert("Ошибка сети. Сервер недоступен.");
            return;
        }

        const status = error.response.status;

        if (status === 401) {
            alert("Неверный email или пароль.");
        } else if (status === 422) {
            const errors = error.response.data.errors;
            const errorMessages = Object.values(errors).flat().join(', ');
            alert("Ошибка валидации: " + errorMessages + ". Пароль должен содердать буквы и цифры. Длина пароля должна быть больше 2");
        } else {
            alert("Ошибка входа: " + status);
        }

        console.log("Ошибка:", error.response.data);
    }
});