

document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('auth_token');
    const currentPage = window.location.pathname;
    
    if (!token && !currentPage.includes('login') && !currentPage.includes('register')) {
        window.location.href = '/login/';
    }
    if (token && (currentPage.includes('login') || currentPage.includes('register'))) {
        window.location.href = '/';
    }
});

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
                <div class="project" data-id="${p.id}">
                    <img src="media/hits.png" class="project-icon">
                    <p class="project-name project-text">${p.name}</p>
                    <p class="project-id project-text">#${p.id}</p>
                </div>
            `;
        });
        document.querySelectorAll(".project").forEach(el => {
            el.addEventListener("click", () => {
                const id = el.getAttribute("data-id");
                window.location.href = `/project/project.html?id=${id}`;
            });
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