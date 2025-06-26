const login = document.querySelector("#login");
const profileInput = document.querySelector("#profile-input");
const profilePreview = document.querySelector("#profile-preview");

// Manejar la selección de imagen de perfil
profileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      profilePreview.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
});

login.addEventListener("click", () => {
  const user = document.querySelector("#username").value.trim();
  if (user !== "") {
    // Guardar nombre de usuario
    document.cookie = `username=${user}`;

    // Guardar foto de perfil en localStorage
    const profileSrc = profilePreview.src;
    try {
      /* Object.defineProperty(window, "localStorage", {
        value: null,
        writable: true,
      }); */

      localStorage.setItem(`profile_${user}`, profileSrc);
    } catch (error) {
      alert("Error al guardar la imagen de perfil");
      console.error("LocalStorage Error:", error);
    }

    document.location.href = "/";
  } else {
    alert("Por favor ingresa tu nombre de usuario");
  }
});
