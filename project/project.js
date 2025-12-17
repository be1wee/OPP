const params = new URLSearchParams(window.location.search);
const projectId = params.get("id");
let allTasks = [];

if (!projectId) {
    alert("Project ID missing");
    window.location.href = "/";
}

async function loadProject() {
    try {
        const token = localStorage.getItem('auth_token');
        const response = await axios.get(`http://localhost:8000/api/projects/${projectId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const project = response.data.data;

        document.getElementById('projectName').textContent = project.name;
        document.getElementById('projectSubject').textContent = project.subject;
        document.getElementById('projectId').textContent = project.id.substring(0, 8);
        document.getElementById('projectStatus').textContent = getProjectStatusText(project.action_status);

        const deadline = new Date(project.deadline).toLocaleDateString();
        document.getElementById('projectDeadline').textContent = deadline;

    } catch (error) {
        console.error("Error loading project:", error);
        if (error.response?.status === 401) {
            window.location.href = '/login/';
        }
    }
}

async function loadTasks() {
    try {
        const token = localStorage.getItem('auth_token');
        const response = await axios.get(`http://localhost:8000/api/projects/${projectId}/tasks`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        allTasks = response.data.data || [];
        document.getElementById('taskCount').textContent = allTasks.length;
        renderTasks(allTasks);

    } catch (error) {
        console.error("Error loading tasks:", error);
        if (error.response?.status === 401) {
            window.location.href = '/login/';
        }
    }
}

function renderTasks(tasks) {
    const list = document.getElementById('taskList');
    list.innerHTML = '';

    if (!tasks || tasks.length === 0) {
        list.innerHTML = `
            <div class="empty-tasks">
                <div class="empty-icon">📋</div>
                <h3>No tasks yet</h3>
                <p>Create your first task to get started</p>
                <button class="action-btn primary" onclick="createTask()">+ Create First Task</button>
            </div>
        `;
        return;
    }

    const childrenByParent = {};
    tasks.forEach(task => {
        const parentId = task.parent_task_id || 'root';
        if (!childrenByParent[parentId]) {
            childrenByParent[parentId] = [];
        }
        childrenByParent[parentId].push(task);
    });

    function renderTask(task, level = 0) {
        const taskElement = document.createElement('div');
        taskElement.className = `task-item ${level === 0 ? 'main' : level === 1 ? 'child' : 'grandchild'}`;
        taskElement.dataset.id = task.id;

        const deadline = task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No deadline';
        const hasChildren = childrenByParent[task.id] && childrenByParent[task.id].length > 0;

        const ownerEmail = task.owner?.email || 'Unassigned';
        const isCurrentUser = task.owner?.email === localStorage.getItem('userEmail');
        const ownerDisplay = isCurrentUser ? 'You' : ownerEmail;

        taskElement.innerHTML = `
            <div class="task-header">
                <div class="task-title">
                    ${task.title}
                    ${hasChildren ? `<span class="expand-btn">▼</span>` : ''}
                </div>
                <div class="task-meta">
                    <div class="meta-tag assignee"> ${ownerDisplay}</div>
                    <div class="meta-tag deadline"> ${deadline}</div>
                    <div class="meta-tag status-${task.status}">${getTaskStatusText(task.status)}</div>
                </div>
            </div>
            ${task.description ? `<div class="task-description">${task.description}</div>` : ''}
            ${hasChildren ? `<div class="children"></div>` : ''}
        `;

        if (hasChildren) {
            const childrenContainer = taskElement.querySelector('.children');
            childrenByParent[task.id].forEach(childTask => {
                childrenContainer.appendChild(renderTask(childTask, level + 1));
            });

            const expandBtn = taskElement.querySelector('.expand-btn');
            expandBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleChildren(expandBtn);
            });
        }

        taskElement.addEventListener('click', (e) => {
            if (!e.target.closest('.expand-btn')) {
                window.location.href = `/task/index.html?id=${task.id}&project=${projectId}`;
            }
        });

        return taskElement;
    }

    (childrenByParent['root'] || []).forEach(rootTask => {
        list.appendChild(renderTask(rootTask, 0));
    });
}

function getProjectStatusText(status) {
    switch (status) {
        case 0: return 'Waiting';
        case 1: return 'In Progress';
        case 2: return 'Completed';
        default: return 'Unknown';
    }
}

function getTaskStatusText(status) {
    switch (status) {
        case 0: return 'Waiting';
        case 1: return 'In Progress';
        case 2: return 'Completed';
        default: return 'Unknown';
    }
}

function toggleChildren(btn) {
    const taskItem = btn.closest('.task-item');
    const children = taskItem.querySelector('.children');
    if (children) {
        children.classList.toggle('hidden');
        btn.textContent = children.classList.contains('hidden') ? '►' : '▼';
    }
}

function createTask() {
    window.location.href = `/tasks/index.html?project=${projectId}`;
}

function showMembers() {
    window.location.href = `/members/index.html?id=${projectId}`;
}

function editProject() {
    window.location.href = `/edit_project/index.html?id=${projectId}`;
}

document.addEventListener('DOMContentLoaded', async () => {
    await loadProject();
    await loadTasks();
});