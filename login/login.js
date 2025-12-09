document.getElementById("login-btn").addEventListener("click", async () => {
    const username = document.getElementById("login-username").value.trim();
    const password = document.getElementById("login-password").value.trim();

    if (!username || !password) {
        alert("Введите логин и пароль");
        return;
    }

    try {
        const res = await fetch(API + "/login", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        if (!res.ok) {
            alert("Неверный логин или пароль");
            return;
        }

        window.location.href = "/index.html";
    } 
    catch (err) {
        alert("Ошибка сети");
        console.error(err);
    }
});
