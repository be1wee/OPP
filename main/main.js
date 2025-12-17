document.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem('auth_token');
    const currentPage = window.location.pathname;

    if (!token && !currentPage.includes('login') && !currentPage.includes('register')) {
        window.location.href = '/login/';
    }
    if (token && (currentPage.includes('login') || currentPage.includes('register'))) {
        window.location.href = '/';
    }

    const email = localStorage.getItem("userEmail");
    if (email) {
        const usernameElement = document.getElementById("username");
        if (usernameElement) usernameElement.textContent = email;
    }

    loadProjects();
});

async function loadProjects() {
    try {
        const token = localStorage.getItem('auth_token');

        const response = await axios.get('http://localhost:8000/api/projects', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const projects = response.data.data;
        const list = document.getElementById("projects");

        if (!list) return;

        list.innerHTML = "";

        if (!projects || projects.length === 0) {
            list.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📂</div>
                    <h3>No Projects Yet</h3>
                    <p>You haven't joined or created any projects.</p>
                    <button class="nav-btn create" onclick="window.location.href='create-project.html'">Create First Project</button>
                </div>
            `;
            return;
        }

        projects.forEach(p => {
            const projectElement = document.createElement('div');
            projectElement.className = 'project';
            projectElement.setAttribute('data-id', p.id);

            const deadline = new Date(p.deadline).toLocaleDateString();
            const statusText = getStatusText(p.action_status);

            projectElement.innerHTML = `
                <div class="project-icon">
                    <span>📊</span>
                </div>
                <div class="project-content">
                    <div class="project-header">
                        <h3 class="project-name">${p.name}</h3>
                        <span class="project-status">${statusText}</span>
                    </div>
                    <p class="project-description">${p.description || 'No description'}</p>
                    <div class="project-footer">
                        <span class="project-id">ID: ${p.id.substring(0, 8)}...</span>
                        <span class="project-deadline">📅 ${deadline}</span>
                        ${p.is_owner ? '<span class="owner-badge">👑 Owner</span>' : ''}
                    </div>
                </div>
            `;

            projectElement.addEventListener('click', () => {
                window.location.href = `/project/project.html?id=${p.id}`;
            });

            list.appendChild(projectElement);
        });

    } catch (error) {
        console.error("Ошибка загрузки проектов", error);
        if (error.response?.status === 401) {
            localStorage.removeItem('auth_token');
            window.location.href = '/login/';
        }
    }
}

function getStatusText(status) {
    switch (status) {
        case 0: return 'Waiting';
        case 1: return 'In Progress';
        case 2: return 'Completed';
        default: return 'Unknown';
    }
}