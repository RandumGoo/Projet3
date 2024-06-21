let works = []; // Array to store gallery data
let currentCategory = "Tous"; // Currently selected category

const allButton = document.getElementById("all");
const objetButton = document.querySelector(".btn.objet");
const appartementsButton = document.getElementById("Appartements");
const hrButton = document.getElementById("H&r");
const gallery = document.querySelector(".gallery");
const btnmodif = document.querySelector(".modification");
const backMod = document.querySelector(".modal-back");
const xMark = document.querySelectorAll(".fa-xmark");
const imageModal = document.getElementById("file");
const titreModal = document.getElementById("title-modal");
const categorieModal = document.getElementById("categorie-modal");
const displayModal = document.querySelector(".display-works-modal");
const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");
const modal = document.getElementById("modal");
const editmod = document.querySelector(".edit-mod");

async function fetchWorks() {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    if (!response.ok) {
      throw new Error("erreur lors du fetch");
    }
    const data = await response.json();
    works = data;
    filterWorksByCategory(currentCategory);
    galeriesDisplayModal(works);
  } catch (error) {
    console.error("Error fetching works:", error);
  }
}


function galeriesDisplay(filteredWorks) {
  gallery.innerHTML = filteredWorks
    .map(
      (work) =>
        `<figure id="${work.id}">
          <img src="${work.imageUrl}">
          <figcaption>${work.title}</figcaption>
        </figure>`
    )
    .join("");
}

function filterWorksByCategory(category) {
  const filteredWorks =
    category === "Tous"
      ? works
      : works.filter((work) => work.category.name === category);
  galeriesDisplay(filteredWorks);
  currentCategory = category; // Update current category
}

allButton.addEventListener("click", () => {
  filterWorksByCategory("Tous");
});

objetButton.addEventListener("click", () => {
  filterWorksByCategory("Objets");
});

appartementsButton.addEventListener("click", () => {
  filterWorksByCategory("Appartements");
});

hrButton.addEventListener("click", () => {
  filterWorksByCategory("Hotels & restaurants");
});

document.addEventListener("DOMContentLoaded", () => {
  if (!localStorage.getItem("token")) {
    btnmodif.style.display = "none";
  }
});

btnmodif.addEventListener("click", () => {
  if (localStorage.getItem("token")) {
    modal.style.display = "block";
  } else {
    modal.style.display = "none";
  }
});

backMod.addEventListener("click", () => {
  modal.style.display = "none";
});

xMark.forEach((mark) =>
  mark.addEventListener("click", () => {
    modal.style.display = "none";
  })
);

/* Modal Navigation */

const modalAdding = document.querySelector(".modal-adding");
const modalDelete = document.querySelector(".modal-delete");
const addImages = document.querySelector(".add-images");
const arrowLeft = document.querySelector(".back-modal");

addImages.addEventListener("click", () => {
  modalAdding.style.display = "block";
  modalDelete.style.display = "none";
});

arrowLeft.addEventListener("click", () => {
  modalAdding.style.display = "none";
  modalDelete.style.display = "block";
});

/* Add images */

const selectedImage = document.getElementById("selected-image");
const imgChoose = document.querySelector(".before-selected");
const submitModalForm = document.getElementById("submit-modal");

imageModal.addEventListener("change", function (event) {
  
  const file = event.target.files[0];
  if (file) {
    selectedImage.src = URL.createObjectURL(file);
    imgChoose.style.display = "none";
    selectedImage.style.display = "block";
  } else {
    selectedImage.src = "";
  }
});

submitModalForm.addEventListener("submit", async (event) => {
  event.preventDefault(); 
  const file = imageModal.files[0];

  if (file) {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("title", titreModal.value);
    formData.append("category", categorieModal.value);

    const requestOptions = {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };
    const nofile = document.getElementById("nofile");
    
    try {
      
      const response = await fetch(
        "http://localhost:5678/api/works",
        requestOptions
      );
      if (!response.ok) {
        throw new Error("Failed to add work");
      }
      const data = await response.json();
      works.push(data); // Update works array
      filterWorksByCategory(currentCategory); // Update gallery display
      galeriesDisplayModal(works); // Update modal display
    } catch (error) {
      console.error("Error adding work:", error);
    }
  } else {
    console.error("No file selected.");
    nofile.innerText = "No file selected.";
  }
  
});

function galeriesDisplayModal(worksModal) {
  displayModal.innerHTML = worksModal
    .map(
      (work) =>
        `<figure class="works">
          <i id="${work.id}" class="fa-solid fa-trash-can"></i>
          <img src="${work.imageUrl}">
        </figure>`
    )
    .join("");

  const trashCans = document.querySelectorAll(".fa-trash-can");
  trashCans.forEach((can) => {
    can.addEventListener("click", async () => {
      const workId = can.id;
      try {
        const response = await fetch(
          `http://localhost:5678/api/works/${workId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to delete work");
        }
        can.parentElement.remove(); // Remove element from DOM
        works = works.filter((work) => work.id !== parseInt(workId)); // Update works array
        filterWorksByCategory(currentCategory); // Update gallery display
        galeriesDisplayModal(works); // Update modal display
      } catch (error) {
        console.error("Error deleting work:", error);
      }
    });
  });
}

fetchWorks();

// Handle login and logout state without page reload
const updateLoginState = () => {
  const token = localStorage.getItem("token");
  if (token) {
    loginBtn.style.display = "none";
    logoutBtn.style.display = "inline";
    
    editmod.style.display = "block"; // Show black bar of edition mode
  } else {
    loginBtn.style.display = "inline";
    logoutBtn.style.display = "none";
    modal.style.display = "none"; // Hide modal if not logged in
    editmod.style.display = "none"; // Hide black bar of edition mode
  }
};

loginBtn.addEventListener("click", () => {
  // Perform login logic
  // For demonstration, assume login is successful and set a token
  localStorage.setItem("token", "example-token");
  updateLoginState();
});

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("token");
  updateLoginState();
  modal.style.display = "none"; // Hide the modal if it is open
  editmod.style.display = "none"; // Hide the black bar of edition mode
});

// Initialize login state on page load
updateLoginState();


const connected = localStorage.getItem("token") ? true : false;
const mainBody = document.body;
const modifierBtn = document.querySelector(".modification");
const editModBar = document.querySelector(".edit-mod");

function updateUIOnLoginStatus() {
  if (connected) {
    if (mainBody) mainBody.classList.add("logged-in");
    if (loginBtn) loginBtn.style.display = "none";
    if (logoutBtn) logoutBtn.style.display = "inline";
    if (modifierBtn) modifierBtn.style.display = "flex";
    if (editModBar) editModBar.style.display = "flex";
  } else {
    if (modal) modal.style.display = "none";
    if (mainBody) mainBody.classList.remove("logged-in");
    if (loginBtn) loginBtn.style.display = "inline";
    if (logoutBtn) logoutBtn.style.display = "none";
    if (modifierBtn) modifierBtn.style.display = "none";
    if (editModBar) editModBar.style.display = "none";
  }
}
updateUIOnLoginStatus();

// Logout functionality
if (logoutBtn) {
  logoutBtn.addEventListener("click", function(event) {
    event.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    window.location.href = "INDEX.html";
  });
}