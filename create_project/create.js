document.getElementById("projectForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const subject = document.getElementById("subject").value;

    try {
        const response = await axios.post(
            "http://localhost:5164/api/me/projects",
            {
                Name: name,
                Subject: subject,
                Deadline: "2023-10-05T14:30:00.1234567Z"
            },
            {
                withCredentials: true
            }
        );

        console.log("Создан проект:", response.data);

        alert("Project created!");
        window.location.href = "../index.html";

    } catch (err) {
        console.error("Ошибка создания проекта:", err);
        alert("Error: " + (err.response?.data || err.message));
    }
});
