document.getElementById("loginForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
        const response = await axios.post("http://localhost:5164/api/register", {
            email: email,
            password: password
        });

        console.log("Ответ сервера:", response.data);

        alert("Регистрация прошла успешно!");

        window.location.href = "../login/index.html";

    } catch (error) {
        const status = error.response.status;
        if (status === 409) {
            alert("Пользователь с таким email уже зарегистрирован!");
        }
        else if (error.response) {
            alert("Ошибка: " + error.response.data.message);
        } else {
            alert("Не удалось отправить запрос.");
        }
        console.error("Ошибка регистрации:", error);
    }
});