document.getElementById("create-btn").addEventListener("click", async () => {
    const name = document.getElementById("project-name").value.trim();
    const subject = document.getElementById("project-subject").value.trim();

    if (!name || !subject) {
        alert("Введите имя и направление проекта");
        return;
    }

    const result = await createProject(name, subject);

    if (!result) {
        alert("Ошибка создания проекта");
        return;
    }

    alert("Проект создан");
    window.location.href = "/index.html";
});
