document.getElementById("loginForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
        await axios.post("http://localhost:5164/api/login", {
            email: email,
            password: password
        },{
            withCredentials: true
        });
        
        localStorage.setItem("userEmail", email);
        alert("Успешный вход!");
        window.location.href = "../index.html";

    } catch (error) {

        if (!error.response) {
            alert("Ошибка сети. Сервер недоступен.");
            return;
        }

        const status = error.response.status;

        if (status === 401) {
            alert("Неверный email или пароль.");
        } else if (status === 400) {
            alert("Ошибка валидации: " + JSON.stringify(error.response.data));
        } else if (status === 404) {
            alert("Пользователь не найден.");
        } else {
            alert("Ошибка входа: " + status);
        }

        console.log("Ошибка:", error.response.data);
    }
});
