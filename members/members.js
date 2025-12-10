let members = [];
let tasks = [];
let currentMember = null;

const projectId = new URLSearchParams(location.search).get("id");
async function loadData() {
    try {
        const [mRes, tRes] = await Promise.all([
            axios.get(`http://localhost:5164/api/project/${projectId}/users`, { withCredentials: true }),
            axios.get(`http://localhost:5164/api/project/${projectId}/tasks`, { withCredentials: true }),
        ]);

        members = mRes.data;
        tasks = tRes.data;

        renderMembers();
        fillAssignTaskSelect();

    } catch (e) {
        console.error(e);
        alert("Failed to load project members");
    }
}

function renderMembers() {
    const grid = document.getElementById("membersGrid");
    grid.innerHTML = "";

    members.forEach(m => {
        const card = document.createElement("div");
        card.className = "member-card";
        card.onclick = () => showMemberModal(m);

        card.innerHTML = `
            <button class="remove-member-btn" onclick="removeMember(event, '${m.id}')">×</button>

            <div class="member-header">
                <div class="member-avatar">${m.name[0].toUpperCase()}</div>
                <div class="member-info">
                    <h3>${m.name}</h3>
                    <div class="member-role">${m.role}</div>
                </div>
            </div>

            <div class="member-tasks">
                ${m.tasks.map(t => `
                    <div class="task-assigned">
                        <span class="task-name">${t.title}</span>
                        <span class="task-status status-${t.status.toLowerCase()}">${t.status}</span>
                    </div>
                `).join("")}

                <button class="add-task-btn" onclick="assignTask(event, '${m.id}')">+ Assign Task</button>
            </div>
        `;

        grid.appendChild(card);
    });
}

function showMemberModal(member) {
    document.getElementById('modalMemberName').textContent = member.name + " — Tasks";

    const html = member.tasks.map(t => `
        <div class="task-assigned">
            <span class="task-name">${t.title}</span>
            <span class="task-status status-${t.status.toLowerCase()}">${t.status}</span>
        </div>
    `).join("");

    document.getElementById('modalMemberTasks').innerHTML = html;

    document.getElementById("memberModal").style.display = "flex";
}

function closeModal() {
    document.getElementById("memberModal").style.display = "none";
}


function fillAssignTaskSelect() {
    const select = document.getElementById("taskSelect");
    select.innerHTML = `<option value="">Choose task...</option>`;

    tasks.forEach(t => {
        const opt = document.createElement("option");
        opt.value = t.Id;
        opt.textContent = t.Title;
        select.appendChild(opt);
    });
}
function assignTask(ev, memberId) {
    ev.stopPropagation();
    currentMember = memberId;
    document.getElementById('assignModal').style.display = 'flex';
}

function closeAssignModal() {
    document.getElementById('assignModal').style.display = 'none';
}

async function confirmAssignment() {
    const taskId = document.getElementById("taskSelect").value;

    if (!taskId) return;

    try {
        await axios.patch(`http://localhost:5164/api/tasks/task?${id}`, {
            userId: currentMember,
            taskId: taskId
        }, { withCredentials: true });

        closeAssignModal();
        loadData();

    } catch (e) {
        console.error(e);
        alert("Failed to assign task");
    }
}
async function removeMember(ev, memberId) {
    ev.stopPropagation();

    if (!confirm("Remove this member?")) return;

    try {
        await axios.delete(`http://localhost:5164/api/project/${projectId}/users/${memberId}`, {
            withCredentials: true
        });

        loadData();

    } catch (e) {
        console.error(e);
        alert("Failed to remove member");
    }
}
document.addEventListener("DOMContentLoaded", () => {
    loadData();
});
