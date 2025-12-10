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
        window.location.href = `/project/?id=${projectId}`;
    } catch (err) {
        console.log(err)
        console.error(err);
        alert("Error creating task");
    }
});
