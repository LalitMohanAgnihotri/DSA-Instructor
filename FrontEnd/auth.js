const API_URL = "https://dsachatboat-backend.onrender.com/api/auth";


async function signup() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const error = document.getElementById("error");
  error.textContent = "";

  try {
    const res = await fetch(`${API_URL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (!res.ok) {
      error.textContent = data.message || "Signup failed";
      return;
    }

    // Auto login
    localStorage.setItem("token", data.token);
    window.location.href = "index.html";

  } catch {
    error.textContent = "Server not reachable";
  }
}

async function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const error = document.getElementById("error");
  error.textContent = "";

  try {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (!res.ok) {
      error.textContent = data.message || "Login failed";
      return;
    }

    localStorage.setItem("token", data.token);
    window.location.href = "index.html";
  } catch {
    error.textContent = "Server not reachable";
  }
}
