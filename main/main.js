async function loadProjects() {
    try {
        const response = await axios.get("http://localhost:5164/api/me/projects", {
            withCredentials: true
        });

        const projects = response.data;

        const list = document.getElementById("projects");

        if (!list) {
            console.error("Элемент #projects не найден");
            return;
        }

        list.innerHTML = "";

        projects.forEach(p => {
            list.innerHTML += `
                <div class="project">
                    <img src="media/hits.png" class="project-icon">
                    <p class="project-name project-text">${p.name}</p>
                    <p class="project-id project-text">#${p.id}</p>
                </div>
            `;
        });

    } catch (err) {
        console.error("Ошибка загрузки проектов", err);
    }
}


document.addEventListener("DOMContentLoaded", () => {
    const email = localStorage.getItem("userEmail");
    document.getElementById("username").textContent = email;
    loadProjects();
});