// DOM elements recovery
const loginForm = document.querySelector("#login-form");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");
const btnSeConnecter = document.getElementById("submit");
const loginFailed = document.querySelector("#login-failed");

// Fetch login function with token and userId recovery
if (btnSeConnecter) {
  btnSeConnecter.addEventListener("click", async function (event) {
    event.preventDefault();
    const infosLog = {
      email: emailInput.value,
      password: passwordInput.value,
    };

    const infosLogJSON = JSON.stringify(infosLog);

    try {
      const response = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        body: infosLogJSON,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.userId);
        window.location.href = "INDEX.html";
      } else if (response.status === 404 || response.status === 401) {
        loginFailed.innerText = "Erreur dans l'identifiant ou le mot de passe";
      } else {
        console.error("Erreur " + response.status);
      }
    } catch (error) {
      console.error(error);
    }
  });
}

// Check if user is logged in




// Fetch additional data on page load if needed
window.addEventListener("load", fetcher);

async function fetcher() {
  console.log("Fetcher function called");
}
