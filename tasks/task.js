document.getElementById('createTaskForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const projectId = new URLSearchParams(location.search).get("id");


    
    try {
        await axios.put("http://localhost:5164/api/project/tasks",  {
            ProjectId: projectId,
            ParentTaskId: document.getElementById('parentTask').value || null,
            Title: document.getElementById('taskTitle').value,
            Description: document.getElementById('taskDescription').value,
            Deadline: document.getElementById('deadline').value,
        },{
            withCredentials: true
        });
        window.location.href = `/project/project.html?id=${projectId}`;
    } catch (err) {
        console.log(err)
        console.error(err);
        alert("Error creating task");
    }
});

document.addEventListener("DOMContentLoaded", () => {
    loadParentTasks();
    document.getElementById('createTaskForm').addEventListener('submit', submitTask);
});
async function loadParentTasks() {
    const projectId = new URLSearchParams(location.search).get("id");
    const select = document.getElementById("parentTask");

    select.innerHTML = `<option value="">None (Main Task)</option>`;

    try {
        const res = await axios.get(`http://localhost:5164/api/project/${projectId}/tasks`, {
            withCredentials: true
        });

        const tasks = res.data;

        tasks.forEach(t => {
            const option = document.createElement("option");
            option.value = t.Id;
            option.textContent = t.Title;
            select.appendChild(option);
        });

    } catch (err) {
        console.error("Failed to load parent tasks:", err);
    }
}
async function submitTask(e) {
    e.preventDefault();

    const projectId = new URLSearchParams(location.search).get("id");

    try {
        await axios.put("http://localhost:5164/api/project/tasks", {
            ProjectId: projectId,
            ParentTaskId: document.getElementById('parentTask').value || null,
            Title: document.getElementById('taskTitle').value,
            Description: document.getElementById('taskDescription').value,
            Deadline: document.getElementById('deadline').value
        }, {
            withCredentials: true
        });

        window.location.href = `/project/project.html?id=${projectId}`;

    } catch (err) {
        console.error(err);
        alert("Error creating task");
    }
}
