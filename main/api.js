
const API = "http://localhost:5164";

// ==============================
//  UNIVERSAL API WRAPPER
// ==============================
async function api(path, method = "GET", body = null) {
    const options = {
        method,
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        }
    };

    if (body) options.body = JSON.stringify(body);

    const res = await fetch(API + path, options);

    if (res.status === 401) {
        window.location.href = "/login/index.html";
        return;
    }

    return await res.json();
}




// ==============================
//  LOAD CURRENT USER (/me)
// ==============================
async function loadUser() {
    try {
        const data = await api("/me", "GET");

        if (!data || !data.username) {
            window.location.href = "/login/index.html";
            return;
        }

        const userElem = document.getElementById("username");
        if (userElem) userElem.textContent = data.username;

        return data;
    }
    catch (e) {
        console.error("loadUser error:", e);
        window.location.href = "/login/index.html";
    }
}



// ==============================
//  LOGOUT (/logout)
// ==============================
async function logout() {
    try {
        await api("/logout", "POST");
        window.location.href = "/login/index.html";
    }
    catch (err) {
        console.error("Logout error:", err);
        alert("Logout failed");
    }
}


// ==============================
//   REGISTER USER (/api/register)
// ==============================
async function registerUser(username, password) {
    try {
        const response = await fetch(API + "/api/gyfytgt", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        if (!response.ok) {
            const text = await response.text();
            alert("Registration failed: " + text);
            return null;
        }

        const data = await response.json();
        console.log("Registered:", data);

        // после регистрации НУЖНО залогиниться вручную
        return data;
    }
    catch (err) {
        console.error("Register error:", err);
        alert("Registration failed (network error)");
        return null;
    }
}




// ==============================
//   LOAD PROJECT LIST (/project/all)
// ==============================

async function loadProjects() {
    try {
        const data = await api("/project/all");

        const container = document.querySelector(".list-project");
        if (!container) return;

        container.innerHTML = ""; 

        data.forEach(project => {
            const element = document.createElement("div");
            element.classList.add("project");
            element.innerHTML = `
                <img src="media/hits.png" class="project-icon">
                <p class="project-name project-text">${project.name}</p>
                <p class="project-id project-text">#${project.projectId}</p>
            `;
            element.onclick = () => {
                window.location.href = "/project/index.html?id=" + project.projectId;
            };
            container.appendChild(element);
        });

    } catch (err) {
        console.error("Project load error:", err);
    }
}



// ==============================
//   LOAD TASKS FOR PROJECT (/project/{id}/tasks)
// ==============================

async function loadTasks(projectId) {
    return await api(`/project/${projectId}/tasks`, "GET");
}



// ==============================
//   CREATE PROJECT (/project/create)
// ==============================

async function createProject(name, subject) {
    return await api("/project/create", "POST", { name, subject });
}



// ==============================
//   JOIN PROJECT (/project/{id}/members/add)
// ==============================

async function joinProject(projectId) {
    return await api(`/project/${projectId}/members/add`, "POST");
}



// ==============================
//   PAGE AUTOLOAD HANDLER
// ==============================

document.addEventListener("DOMContentLoaded", async () => {


    if (!window.location.pathname.includes("login") &&
        !window.location.pathname.includes("registration")) {

        await loadUser(); 
    }


    if (window.location.pathname.endsWith("index.html") ||
        window.location.pathname === "/") {

        if (document.querySelector(".list-project")) {
            await loadProjects();
        }
    }
});
