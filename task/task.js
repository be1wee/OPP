const params = new URLSearchParams(window.location.search);
const taskId = params.get("id");
const projectId = params.get("project");
let taskData = null;

if (!taskId || !projectId) {
    alert("Task ID or Project ID missing");
    window.location.href = "/";
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('backBtn').href = `/project/project.html?id=${projectId}`;
    loadTask();
});

async function loadTask() {
    try {
        const token = localStorage.getItem('auth_token');
        
        const response = await axios.get(`http://localhost:8000/api/tasks/${taskId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        taskData = response.data.data;
        renderTask();
        
    } catch (error) {
        console.error("Error loading task:", error);
        if (error.response?.status === 401) {
            window.location.href = '/login/';
        } else if (error.response?.status === 404) {
            alert("Task not found");
            window.location.href = `/project/project.html?id=${projectId}`;
        }
    }
}

function renderTask() {
    if (!taskData) return;
    
    document.getElementById('taskTitle').textContent = taskData.title;
    document.getElementById('taskProject').textContent = `Project: ${projectId.substring(0, 8)}`;
    document.getElementById('taskDescription').textContent = taskData.description || 'No description provided';
    document.getElementById('taskId').textContent = taskData.id.substring(0, 8);
    document.getElementById('projectId').textContent = projectId.substring(0, 8);
    
    updateStatusDisplay();
    updateAssigneeDisplay();
    updateDates();
    updateParentTask();
    loadSubtasks();
}

function updateStatusDisplay() {
    const statusText = getStatusText(taskData.status);
    const statusIcon = getStatusIcon(taskData.status);
    
    document.getElementById('taskStatusIcon').textContent = statusIcon;
    document.getElementById('taskStatus').textContent = statusText;
    document.getElementById('taskStatus').className = `detail-value status-${taskData.status}`;
}

function updateAssigneeDisplay() {
    const assigneeEmail = taskData.owner?.email || 'Unassigned';
    const currentUserEmail = localStorage.getItem('userEmail');
    
    let displayText = assigneeEmail;
    if (assigneeEmail === currentUserEmail) {
        displayText = 'You';
    }
    
    document.getElementById('taskAssignee').textContent = displayText;
}

function updateDates() {
    const deadline = taskData.deadline ? new Date(taskData.deadline).toLocaleDateString() : 'No deadline';
    const created = new Date(taskData.created_at).toLocaleDateString();
    const updated = new Date(taskData.updated_at).toLocaleDateString();
    
    document.getElementById('taskDeadline').textContent = deadline;
    document.getElementById('taskCreated').textContent = created;
    document.getElementById('taskUpdated').textContent = updated;
    document.getElementById('createdDate').textContent = created;
}

function updateParentTask() {
    if (taskData.parent_task_id) {
        document.getElementById('parentTask').textContent = taskData.parent?.title || 'Parent Task';
    } else {
        document.getElementById('parentTask').textContent = 'None';
    }
}

async function loadSubtasks() {
    try {
        const token = localStorage.getItem('auth_token');
        
        const response = await axios.get(`http://localhost:8000/api/tasks/${taskId}/subtasks`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const subtasks = response.data.data || [];
        renderSubtasks(subtasks);
        
    } catch (error) {
        console.error("Error loading subtasks:", error);
    }
}

function renderSubtasks(subtasks) {
    const container = document.getElementById('subtasksList');
    
    if (subtasks.length === 0) {
        container.innerHTML = `
            <div class="empty-subtasks">
                <div class="empty-icon">📋</div>
                <h3>No subtasks</h3>
                <p>Create subtasks to break down this task</p>
                <button class="action-btn small" onclick="createSubtask()">+ Add Subtask</button>
            </div>
        `;
        return;
    }
    
    let html = '<div class="subtasks-header"><button class="action-btn small" onclick="createSubtask()">+ Add Subtask</button></div>';
    
    subtasks.forEach(subtask => {
        const deadline = subtask.deadline ? new Date(subtask.deadline).toLocaleDateString() : 'No deadline';
        const statusText = getStatusText(subtask.status);
        
        html += `
            <div class="subtask-item" onclick="openSubtask('${subtask.id}')">
                <div class="subtask-info">
                    <h4>${subtask.title}</h4>
                    <div class="subtask-meta">
                        <span class="status-${subtask.status}">${statusText}</span>
                        <span>📅 ${deadline}</span>
                        <span>👤 ${subtask.owner?.email || 'Unassigned'}</span>
                    </div>
                </div>
                <div class="subtask-actions">
                    <button class="action-btn small" onclick="editSubtask(event, '${subtask.id}')">Edit</button>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function getStatusText(status) {
    switch(status) {
        case 0: return 'Waiting';
        case 1: return 'In Progress';
        case 2: return 'Completed';
        default: return 'Unknown';
    }
}

function getStatusIcon(status) {
    switch(status) {
        case 0: return '📋';
        case 1: return '🔄';
        case 2: return '✅';
        default: return '📋';
    }
}

function editTask() {
    window.location.href = `/tasks/edit.html?id=${taskId}&project=${projectId}`;
}

async function deleteTask() {
    if (!confirm("Are you sure you want to delete this task? This action cannot be undone.")) {
        return;
    }
    
    try {
        const token = localStorage.getItem('auth_token');
        
        await axios.delete(`http://localhost:8000/api/tasks/${taskId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        alert("Task deleted successfully!");
        window.location.href = `/project/project.html?id=${projectId}`;
        
    } catch (error) {
        console.error("Error deleting task:", error);
        alert("Failed to delete task: " + (error.response?.data?.message || error.message));
    }
}

function createSubtask() {
    window.location.href = `/tasks/index.html?project=${projectId}&parent=${taskId}`;
}

function openSubtask(subtaskId) {
    window.location.href = `/task/task.html?id=${subtaskId}&project=${projectId}`;
}

function editSubtask(event, subtaskId) {
    event.stopPropagation();
    window.location.href = `/tasks/edit.html?id=${subtaskId}&project=${projectId}`;
}

function updateStatus() {
    const newStatus = prompt("Enter new status (0=Waiting, 1=In Progress, 2=Completed):", taskData.status);
    
    if (newStatus === null) return;
    
    const statusNum = parseInt(newStatus);
    if (isNaN(statusNum) || statusNum < 0 || statusNum > 2) {
        alert("Invalid status. Please enter 0, 1, or 2.");
        return;
    }
    
    updateTaskField('status', statusNum);
}

function reassignTask() {
    const newAssignee = prompt("Enter new assignee email (leave empty to unassign):");
    
    if (newAssignee === null) return;
    
    updateTaskField('owner_email', newAssignee || null);
}

function changeDeadline() {
    const currentDeadline = taskData.deadline ? new Date(taskData.deadline).toISOString().split('T')[0] : '';
    const newDeadline = prompt("Enter new deadline (YYYY-MM-DD):", currentDeadline);
    
    if (newDeadline === null) return;
    
    updateTaskField('deadline', newDeadline || null);
}

async function updateTaskField(field, value) {
    try {
        const token = localStorage.getItem('auth_token');
        
        const updateData = { [field]: value };
        
        const response = await axios.put(`http://localhost:8000/api/tasks/${taskId}`, updateData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        alert("Task updated successfully!");
        loadTask();
        
    } catch (error) {
        console.error("Error updating task:", error);
        alert("Failed to update task: " + (error.response?.data?.message || error.message));
    }
}