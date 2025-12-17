document.getElementById("projectForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const subject = document.getElementById("subject").value;
    const description = document.getElementById("description").value;
    const deadlineInput = document.getElementById("deadline").value;

    const token = localStorage.getItem('auth_token');

    if (!token) {
        alert("Please login first");
        window.location.href = '/login/';
        return;
    }

    const deadline = deadlineInput ? new Date(deadlineInput).toISOString() : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    try {
        const response = await axios.post(
            "http://localhost:8000/api/projects",
            {
                name: name,
                subject: subject,
                description: description,
                deadline: deadline
            },
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        alert("Project created successfully!");
        window.location.href = "../index.html";

    } catch (err) {
        console.error("Ошибка создания проекта:", err);

        if (err.response?.status === 422) {
            const errors = err.response.data.errors;
            const errorMessages = Object.values(errors).flat().join(', ');
            alert("Validation error: " + errorMessages);
        } else if (err.response?.status === 401) {
            alert("Please login again");
            window.location.href = '/login/';
        } else {
            alert("Error: " + (err.response?.data?.message || err.message));
        }
    }
});