document.getElementById("joinForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const projectId = document.getElementById("projectId").value.trim();
    const token = localStorage.getItem('auth_token');

    if (!projectId) {
        // alert("Введите Project ID");
        Modal.show('Введите Project ID');

        return;
    }

    if (!token) {
        // alert("Please login first");
        Modal.show('Please login first');

        window.location.href = '/login/';
        return;
    }

    try {
        const response = await axios.post(
            "http://193.124.112.102/api/projects/join",
            {
                project_id: projectId
            },
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        // alert("Successfully joined the project!");
        Modal.show('Successfully joined the project!');
        window.location.href = "../index.html";

    } catch (err) {
        console.error("Ошибка:", err);

        if (err.response?.status === 404) {
            // alert("Project not found. Check the project ID.");
            Modal.show('Project not found. Check the project ID.');
        } else if (err.response?.status === 409) {
            // alert("You are already a member of this project.");
            Modal.show('You are already a member of this project.');
        } else if (err.response?.status === 401) {
            // alert("Please login again.");
            Modal.show('Please login again.');
            window.location.href = '/login/';
        } else if (err.response?.status === 422) {
            // alert("Invalid project ID format.");
            Modal.show('Invalid project ID format.');
        } else {
            // alert("Error: " + (err.response?.data?.message || err.message));
            Modal.show("Error: " + (err.response?.data?.message || err.message));

        }
    }
});