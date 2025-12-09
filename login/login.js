document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("loginForm");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const Email = document.getElementById("username").value.trim();
        const Password = document.getElementById("password").value.trim();

        if (!Email || !Password) return alert("Fill all fields");

        try {
            const response = await fetch(API + "/api/login", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ Email, Password })
            });

            if (!response.ok) {
                alert("Invalid credentials");
                return;
            }

            window.location.href = "/index.html";
            // loadUser();

        } catch (err) {
            console.error(err);
            alert("Network error");
        }
    });
});
