document.addEventListener('DOMContentLoaded', function () {
    const projectId = new URLSearchParams(window.location.search).get("project");

    if (!projectId) {
        // alert("Project ID missing");
        Modal.show('Project ID missing');

        window.location.href = "/";
        return;
    }

    loadData(projectId);
    setupForm(projectId);

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    document.getElementById('deadline').valueAsDate = tomorrow;
    document.getElementById('backBtn').href = `/project/project.html?id=${projectId}`;
});

async function loadData(projectId) {
    await Promise.all([
        loadAllTasksForParentSelection(projectId),
        loadProjectMembers(projectId)
    ]);
}

async function loadAllTasksForParentSelection(projectId) {
    const select = document.getElementById("parentTask");
    select.innerHTML = '<option value="">None (Main Task)</option>';

    try {
        const token = localStorage.getItem('auth_token');
        const response = await axios.get(`http://193.124.112.102/api/projects/${projectId}/tasks`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const tasks = response.data.data || [];

        tasks.forEach(task => {
            const option = document.createElement("option");
            option.value = task.id;
            option.textContent = task.title;
            select.appendChild(option);
        });

    } catch (error) {
        console.error("Failed to load tasks:", error);
    }
}

async function loadProjectMembers(projectId) {
    const select = document.getElementById("assignee");
    select.innerHTML = '<option value="">Unassigned</option>';

    try {
        const token = localStorage.getItem('auth_token');

        const response = await axios.get(`http://193.124.112.102/api/projects/${projectId}/members`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const members = response.data.data || [];

        const currentUserEmail = localStorage.getItem('userEmail');

        members.forEach(member => {
            const option = document.createElement("option");
            option.value = member.user_id;

            if (member.email === currentUserEmail) {
                option.textContent = `${member.email} (You)`;
                option.selected = true;
            } else {
                option.textContent = member.email;
            }

            select.appendChild(option);
        });

    } catch (error) {
        console.error("Failed to load project members:", error);
    }
}

function setupForm(projectId) {
    document.getElementById('createTaskForm').addEventListener('submit', async function (e) {
        e.preventDefault();

        const token = localStorage.getItem('auth_token');
        if (!token) {
            // alert("Please login first");
            Modal.show('Please login first');

            window.location.href = '/login/';
            return;
        }

        const parentTaskId = document.getElementById('parentTask').value || null;
        const title = document.getElementById('taskTitle').value.trim();
        const description = document.getElementById('taskDescription').value.trim();
        const deadline = document.getElementById('deadline').value;
        const assigneeId = document.getElementById('assignee').value || null;

        if (!title) {
            // alert("Task title is required");
            Modal.show('Task title is required');

            return;
        }

        try {
            const taskData = {
                title: title,
                description: description || null,
                parent_task_id: parentTaskId,
                deadline: deadline || null,
                owner_id: assigneeId
            };

            const response = await axios.post(`http://193.124.112.102/api/projects/${projectId}/tasks`, taskData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            // alert("Task created successfully!");
            Modal.show('Task created successfully!');

            window.location.href = `/project/project.html?id=${projectId}`;

        } catch (error) {
            console.error("Error creating task:", error);

            if (error.response?.status === 401) {
                // alert("Session expired. Please login again.");
                Modal.show('Session expired. Please login again.');
                window.location.href = '/login/';
            } else if (error.response?.status === 422) {
                const errors = error.response.data.errors;
                const errorMessages = Object.values(errors).flat().join(', ');
                // alert("Validation error: " + errorMessages);
                Modal.show("Validation error: " + errorMessages);
            } else {
                // alert("Error creating task: " + (error.response?.data?.message || error.message));
                Modal.show("Error creating task: " + (error.response?.data?.message || error.message));
            }
        }
    });
}

