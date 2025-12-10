document.getElementById("joinForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const projectId = document.getElementById("projectId").value.trim();

    if (!projectId) {
        alert("Введите Project ID");
        return;
    }

    try {
        const response = await axios.post(
            `http://localhost:5164/api/me/projects/${projectId}`,
            {},
            { withCredentials: true }
        );

        alert("Request sent successfully!");
        window.location.href = "../index.html";

    } catch (err) {
        console.error("Ошибка:", err);
        alert("Error: " + (err.response?.data || err.message));
    }
});
