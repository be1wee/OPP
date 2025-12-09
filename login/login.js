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
            const response = await fetch(API + "/api/login", {
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

            // WRONG PASSWORD
            if (response.status === 401) {
                alert("Incorrect email or password");
                return;
            }

            // BAD REQUEST
            if (response.status === 400) {
                const msg = await response.text();
                alert("Login error: " + msg);
                return;
            }

            // SERVER ERROR
            if (!response.ok) {
                alert("Login failed (" + response.status + ")");
                return;
            }

            // SUCCESS
            alert("Login successful!");
            // loadUser();
            window.location.href = "index.html";

        } catch (err) {
            console.error(err);
            alert("Network error. Try again later.");
        }
    });

});
