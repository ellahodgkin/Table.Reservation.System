const loginForm = document.getElementById("login-form");
const loginResult = document.getElementById("login-result");

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("http://127.0.0.1:3000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || "Login failed.");
        }

        window.location.href = "admin.html";
    } catch (error) {
        loginResult.textContent = error.message;
    }
});