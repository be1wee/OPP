document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("loginForm");
    const emailInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const Email = emailInput.value.trim();
        const Password = passwordInput.value.trim();

        // === FRONTEND VALIDATION ===
        if (!Email) {
            alert("Email cannot be empty");
            return;
        }

        if (!Password) {
            alert("Password cannot be empty");
            return;
        }

        try {
            const response = await fetch(API + "/api/register", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    Email: Email,
                    Password: Password
                })
            });

            if (response.status === 409) {
                alert("User already exists");
                return;
            }

            if (response.status === 400) {
                const message = await response.text();
                alert("Registration error: " + message);
                return;
            }

            if (!response.ok) {
                alert("Registration failed (" + response.status + ")");
                return;
            }

            alert("Registration successful! Now log in.");
            window.location.href = "../login/index.html";

        } catch (err) {
            console.error(err);
            alert("Network error. Try again later.");
        }
    });

});
