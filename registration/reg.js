document.getElementById("register-btn").addEventListener("click", async () => {
    const username = document.getElementById("reg-username").value.trim();
    const password = document.getElementById("reg-password").value.trim();

    if (!username || !password) {
        alert("Заполните все поля");
        return;
    }

    const result = await registerUser(username, password);

    if (result) {
        alert("Регистрация успешна! Теперь войдите.");
        window.location.href = "/login/index.html";
    }
});
