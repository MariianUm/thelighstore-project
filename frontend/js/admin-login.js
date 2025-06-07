document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("login-form");
    const usernameInput = form.querySelector('input[name="username"]');
    const passwordInput = form.querySelector('input[name="password"]');
    const errorDiv = document.getElementById("error-msg");
  
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
  
      const username = usernameInput.value.trim();
      const password = passwordInput.value.trim();
  
      try {
        const response = await fetch("http://localhost:8000/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });
  
        if (!response.ok) throw new Error("Неверный логин или пароль");
  
        const data = await response.json();
        localStorage.setItem("access_token", data.access_token);
        window.location.href = "admin-dashboard.html";
      } catch (err) {
        errorDiv.textContent = err.message;
      }
    });
  });
  