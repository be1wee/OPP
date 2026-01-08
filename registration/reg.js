
document.getElementById("loginForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
        const response = await axios.post("http://193.124.112.102/api/register", {
            email: email,
            password: password
        });

        console.log("Ответ сервера:", response.data);

        localStorage.setItem("auth_token", response.data.token);
        localStorage.setItem("userEmail", email);

        alert("Регистрация прошла успешно!");

        window.location.href = "../";

    } catch (error) {
        if (!error.response) {
            alert("Ошибка сети. Сервер недоступен.");
            console.error("Ошибка сети:", error);
            return;
        }

        const status = error.response.status;

        if (status === 409) {
            alert("Пользователь с таким email уже зарегистрирован!");
        } else if (status === 422) {
            const errors = error.response.data.errors;
            if (errors) {
                const errorMessages = Object.values(errors).flat().join(', ');
                alert("Ошибка валидации: " + errorMessages + "Пароль должен содердать буквы и цифры. Длина пароля должна быть больше 2");
            } else {
                alert("Ошибка валидации");
            }
        } else if (error.response.data && error.response.data.message) {
            alert("Ошибка: " + error.response.data.message);
        } else {
            alert("Не удалось зарегистрироваться. Статус: " + status);
        }

        console.error("Ошибка регистрации:", error.response.data);
    }
});