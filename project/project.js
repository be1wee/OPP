const params = new URLSearchParams(window.location.search);
const projectId = params.get("id");

if (!projectId) {
    alert("Project ID missing");
}

async function loadProject() {
    const res = await axios.get(`http://localhost:5164/api/project/${projectId}`, {
        withCredentials: true
    });

    const p = res.data;

    document.querySelector(".project-info h1").textContent = p.Name;
    document.querySelector(".project-id").textContent = "#" + p.Id;
}

async function loadTasks() {
    const res = await axios.get(`http://localhost:5164/api/project/${projectId}/tasks`, {
        withCredentials: true
    });

    console.log("Tasks from backend:", res.data);

    const tasks = res.data.map(t => ({
        id: t.Id,
        projectId: t.ProjectId,
        parentTaskId: t.ParentTaskId ?? null,
        ownerId: t.OwnerId,
        title: t.Title,
        description: t.Description,
        status: t.Status,
        deadline: t.Deadline,
        subtasks: t.Subtasks
    }));

    renderTasks(tasks);
}

function renderTasks(tasks) {
    console.log("Normalized tasks:", tasks);

    const list = document.getElementById("task-listID");
    list.innerHTML = "";

    const map = {};

    tasks.forEach(t => {
        const parent = t.parentTaskId ?? null;
        if (!map[parent]) map[parent] = [];
        map[parent].push(t);
    });

    console.log("MAP:", map);

    function makeTask(task, level) {
        const wrapper = document.createElement("div");
        wrapper.classList.add("task-item");

        if (level === 0) wrapper.classList.add("main");
        if (level === 1) wrapper.classList.add("child");
        if (level >= 2) wrapper.classList.add("grandchild");

        wrapper.innerHTML = `
            <div class="task-header">
                <div class="task-title">
                    ${task.title}
                    ${map[task.id] ? `<span class="expand-btn">▼</span>` : ""}
                </div>
                <div class="task-meta">
                    <div class="meta-tag deadline">${task.deadline?.substring(0, 10) ?? ""}</div>
                    <div class="meta-tag status-${String(task.status).toLowerCase()}">${task.status}</div>
                </div>
            </div>

            <div class="task-description">
                ${task.description ?? ""}
            </div>

            <div class="children"></div>
        `;

        const childrenContainer = wrapper.querySelector(".children");

        if (map[task.id]) {
            map[task.id].forEach(child => {
                childrenContainer.appendChild(makeTask(child, level + 1));
            });
        } else {
            childrenContainer.remove();
        }

        return wrapper;
    }

    (map[null] || []).forEach(root => {
        list.appendChild(makeTask(root, 0));
    });

    document.querySelectorAll(".expand-btn").forEach(btn => {
        btn.onclick = () => toggleChildren(btn);
    });
}

document.addEventListener("DOMContentLoaded", async () => {
    await loadProject();
    await loadTasks();
});

function toggleChildren(btn) {
    const taskItem = btn.closest(".task-item");
    const children = taskItem.querySelector('.children');
    if (children) {
        children.classList.toggle('hidden');
        btn.textContent = children.classList.contains('hidden') ? '►' : '▼';
    }
}
