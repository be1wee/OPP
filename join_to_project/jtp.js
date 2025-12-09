document.getElementById("join-btn").addEventListener("click", async () => {
    const id = document.getElementById("project-id").value.trim();
    if (!id) {
        alert("Введите ID проекта");
        return;
    }

    const result = await joinProject(id);

    if (!result) {
        alert("Не удалось присоединиться к проекту");
        return;
    }

    alert("Вы присоединились к проекту");
    window.location.href = `/project/index.html?id=${id}`;
});
