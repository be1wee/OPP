function renderTasks(tasks) {
    const list = document.querySelector(".task-list");
    list.innerHTML = ""; 

   
    const map = {};
    tasks.forEach(t => {
        if (!map[t.parent_id]) map[t.parent_id] = [];
        map[t.parent_id].push(t);
    });

    
    function makeTask(task, level) {
        const wrapper = document.createElement("div");
        wrapper.classList.add("task-item");
        if (level === 0) wrapper.classList.add("main");
        if (level === 1) wrapper.classList.add("child");
        if (level === 2) wrapper.classList.add("grandchild");

        wrapper.innerHTML = `
            <div class="task-header">
                <div class="task-title">
                    ${task.title}
                    ${map[task.id] ? `<span class="expand-btn">▼</span>` : ""}
                </div>
                <div class="task-meta">
                    <div class="meta-tag deadline">${task.deadline ?? ""}</div>
                    <div class="meta-tag assignee">${task.assignee ?? ""}</div>
                    <div class="meta-tag status-${task.status.toLowerCase()}">${task.status}</div>
                </div>
            </div>
            <div class="task-description">${task.description ?? ""}</div>
            <div class="children"></div>
        `;

        
        const container = wrapper.querySelector(".children");
        if (map[task.id]) {
            map[task.id].forEach(child => {
                container.appendChild(makeTask(child, level + 1));
            });
        } else {
            container.remove(); 
        }

        return wrapper;
    }

   
    (map[null] || []).forEach(root => list.appendChild(makeTask(root, 0)));

    
    document.querySelectorAll(".expand-btn").forEach(btn => {
        btn.onclick = () => toggleChildren(btn);
    });
}



const params = new URLSearchParams(window.location.search);
const projectId = params.get("id");

if (!projectId) {
    alert("Project ID missing");
}

async function loadProject() {
    const res = await axios.get(`http://localhost:5164/api/project/${projectId}`, {
        withCredentials: true
    });

    const project = res.data;
    document.querySelector(".project-info h1").textContent = project.Name;
    document.querySelector(".project-id").textContent = "#" + project.Id;
}

async function loadTasks() {
    const res = await axios.get(`http://localhost:5164/api/tasks/${projectId}`, {
        withCredentials: true
    });

    renderTasks(res.data);
}

async function init() {
    await loadProject();
    await loadTasks();
}

init();
