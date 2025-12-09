const API = "http://localhost:5164";

// ===================================
// UNIVERSAL API WRAPPER
// ===================================
async function api(path, method = "GET", body = null) {
    console.log("X")
    const options = {
        method,
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        }
    };
    console.log("Y")
    if (body) {
        options.body = JSON.stringify(body);
    }
    console.log("Z")
    const res = await fetch(API + path, options);


    return await res.json();
}


// ===================================
// LOAD CURRENT USER (/api/me)
// ===================================
async function loadUser() {
    console.log("LOAD USER CALLED");
    const data = await api("/api/me", "GET");
    console.log("DATA FROM /api/me:", data);
    const userElem = document.getElementById("username");
    if (userElem) {
        userElem.textContent = data.email;
        console.log("SET to Unknown");
    }

    return data;

}

document.addEventListener("DOMContentLoaded", async () => {

    if (!window.location.pathname.includes("login")
        && !window.location.pathname.includes("registration")) {

        const user = await loadUser();

        if (!user) {
            window.location.href = "/login/index.html";
            return;
        }
    }
});
