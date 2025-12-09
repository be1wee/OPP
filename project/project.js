const params = new URLSearchParams(window.location.search);
const projectId = params.get("id");
 
async function loadProjectTasks() {
    const taskList = document.getElementById("task-list");
    if (!taskList) return;

    const tasks = await loadTasks(projectId);

    taskList.innerHTML = "";
    tasks.forEach(t => {
        const div = document.createElement("div");
        div.classList.add("task");
        div.innerHTML = `
            <p>${t.title}</p>
            <p>${t.status}</p>
        `;
        taskList.appendChild(div);
    });
}

document.getElementById("create-task-btn").addEventListener("click", async () => {
    const title = document.getElementById("task-title").value.trim();

    if (!title) return alert("Введите название задачи");

    const res = await api(`/project/${projectId}/tasks/create`, "POST", {
        title
    });

    if (res) {
        alert("Задача создана");
        loadProjectTasks();
    }
});

document.addEventListener("DOMContentLoaded", async () => {
    await loadUser();
    await loadProjectTasks();
});
