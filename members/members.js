const projectId = new URLSearchParams(window.location.search).get("id");
let members = [];
let projectData = null;
let userRole = 'member';
let isOwner = false;

if (!projectId) {
    alert("Project ID missing");
    window.location.href = "/";
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('backBtn').href = `/project/project.html?id=${projectId}`;
    loadData();
});

async function loadData() {
    try {
        const token = localStorage.getItem('auth_token');

        const [projectRes, membersRes, tasksRes] = await Promise.all([
            axios.get(`http://193.124.112.102/api/projects/${projectId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            }),
            axios.get(`http://193.124.112.102/api/projects/${projectId}/members`, {
                headers: { 'Authorization': `Bearer ${token}` }
            }),
            axios.get(`http://193.124.112.102/api/projects/${projectId}/tasks`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
        ]);

        projectData = projectRes.data.data;
        members = membersRes.data.data || [];
        const tasks = tasksRes.data.data || [];

        const userEmail = localStorage.getItem('userEmail');
        const currentUser = members.find(m => m.email === userEmail);

        if (currentUser) {
            userRole = currentUser.role;
            isOwner = currentUser.is_owner;
        }

        updateProjectInfo();
        renderMembers(tasks);
        updateUserRoleInfo();

    } catch (error) {
        console.error("Error loading data:", error);
        if (error.response?.status === 401) {
            window.location.href = '/login/';
        }
    }
}

function updateProjectInfo() {
    if (projectData) {
        document.getElementById('projectName').textContent = projectData.name;
        document.getElementById('projectId').textContent = `ID: ${projectData.id.substring(0, 8)}`;
        document.getElementById('inviteProjectId').textContent = projectData.id;
    }
}

function renderMembers(tasks) {
    const grid = document.getElementById("membersGrid");
    grid.innerHTML = '';

    document.getElementById('membersCount').textContent = `${members.length} members`;

    if (members.length === 0) {
        grid.innerHTML = `
            <div class="empty-members">
                <div class="empty-icon">👥</div>
                <h3>No members yet</h3>
                <p>Invite members to join your project</p>
            </div>
        `;
        return;
    }

    const userTasksByMember = groupTasksByMember(tasks);
    const userEmail = localStorage.getItem('userEmail');

    members.forEach(member => {
        const card = document.createElement("div");
        card.className = "member-card";

        const memberTasks = userTasksByMember[member.user_id] || [];
        const memberInitial = member.email.charAt(0).toUpperCase();
        const isCurrentUser = member.email === userEmail;

        card.innerHTML = `
            ${isOwner && !isCurrentUser ? `
                <button class="remove-member-btn" onclick="removeMember('${member.user_id}')">×</button>
            ` : ''}
            
            <div class="member-header">
                <div class="member-avatar">${memberInitial}</div>
                <div class="member-info">
                    <h3>${member.email}</h3>
                    <div class="role-display" id="role-display-${member.user_id}">
                        ${member.is_owner ?
                '<div class="member-role role-owner">Owner</div>' :
                `<div class="member-role role-${member.role.toLowerCase()}">${member.role}</div>`
            }
                        ${isOwner && !member.is_owner ? `
                            <button class="change-role-btn" onclick="showRoleSelect('${member.user_id}', '${member.role}')">
                                Change Role
                            </button>
                        ` : ''}
                    </div>
                    <div class="role-select" id="role-select-${member.user_id}" style="display: none;">
                        <select id="role-${member.user_id}">
                            <option value="BACKEND">Backend</option>
                            <option value="FRONTEND">Frontend</option>
                            <option value="MOBILE">Mobile</option>
                            <option value="DESIGN">Design</option>
                            <option value="TESTING">Testing</option>
                        </select>
                        <div class="role-actions">
                            <button class="save-role-btn" onclick="changeRole('${member.user_id}')">Save</button>
                            <button class="cancel-role-btn" onclick="cancelRoleChange('${member.user_id}', '${member.role}')">Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="member-tasks">
                <div class="tasks-count">${memberTasks.length} tasks assigned</div>
                ${memberTasks.slice(0, 3).map(task => `
                    <div class="task-item">
                        <div class="task-title">${task.title}</div>
                        <span class="task-status status-${task.status}">${getTaskStatusText(task.status)}</span>
                    </div>
                `).join('')}
                ${memberTasks.length > 3 ? `<div class="task-item">+ ${memberTasks.length - 3} more tasks</div>` : ''}
            </div>
        `;

        grid.appendChild(card);
    });
}

function groupTasksByMember(tasks) {
    const grouped = {};

    tasks.forEach(task => {
        if (task.owner_id) {
            if (!grouped[task.owner_id]) {
                grouped[task.owner_id] = [];
            }
            grouped[task.owner_id].push(task);
        }
    });

    return grouped;
}

function getTaskStatusText(status) {
    switch (status) {
        case 0: return 'Waiting';
        case 1: return 'In Progress';
        case 2: return 'Completed';
        default: return 'Unknown';
    }
}

function updateUserRoleInfo() {
    const roleBadge = document.getElementById('userRoleBadge');
    const roleText = document.getElementById('userRoleText');

    if (isOwner) {
        roleBadge.className = 'role-badge role-owner';
        roleBadge.textContent = 'Owner';
        roleText.textContent = 'You can manage members and project settings.';
    } else {
        roleBadge.className = `role-badge role-${userRole.toLowerCase()}`;
        roleBadge.textContent = userRole;
        roleText.textContent = 'You can view members and participate in tasks.';
    }
}

function showRoleSelect(userId, currentRole) {
    document.getElementById(`role-display-${userId}`).style.display = 'none';
    const selectElement = document.getElementById(`role-select-${userId}`);
    selectElement.style.display = 'block';

    const select = document.getElementById(`role-${userId}`);
    select.value = currentRole;
}

function cancelRoleChange(userId, currentRole) {
    document.getElementById(`role-select-${userId}`).style.display = 'none';
    document.getElementById(`role-display-${userId}`).style.display = 'block';
}

async function changeRole(userId) {
    try {
        const token = localStorage.getItem('auth_token');
        const select = document.getElementById(`role-${userId}`);
        const newRole = select.value;

        await axios.put(`http://193.124.112.102/api/projects/${projectId}/members/${userId}/role`, {
            role: newRole
        }, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        loadData();

    } catch (error) {
        console.error("Error changing role:", error);
        alert("Failed to change role: " + (error.response?.data?.message || error.message));
    }
}

async function removeMember(userId) {
    if (!isOwner) {
        alert("Only project owner can remove members");
        return;
    }

    const memberToRemove = members.find(m => m.user_id === userId);
    if (!memberToRemove) return;

    if (!confirm(`Remove ${memberToRemove.email} from project?`)) {
        return;
    }

    if (memberToRemove.is_owner) {
        alert("Cannot remove project owner");
        return;
    }

    try {
        const token = localStorage.getItem('auth_token');

        await axios.delete(`http://193.124.112.102/api/projects/${projectId}/members/${userId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        loadData();

    } catch (error) {
        console.error("Error removing member:", error);
        alert("Failed to remove member: " + (error.response?.data?.message || error.message));
    }
}


