const socket = io();
const send = document.querySelector("#send-message");
const allMessages = document.querySelector("#all-messages");
const usersList = document.querySelector("#users-list");

// Obtener el nombre de usuario actual desde las cookies
function getCurrentUser() {
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === "username") {
      return value;
    }
  }
  return null;
}

// Obtener foto de perfil del usuario
function getUserProfile(username) {
  const savedProfile = localStorage.getItem(`profile_${username}`);
  return savedProfile || "/img/perfil.jpg";
}

const currentUser = getCurrentUser();

// Verificar si el usuario está autenticado
if (!currentUser) {
  window.location.href = "/register";
} else {
  console.log(`Bienvenido de nuevo, ${currentUser}!`);

  // Enviar información del usuario al conectarse
  socket.emit("user-join", {
    username: currentUser,
    profileImage: getUserProfile(currentUser),
  });
}

send.addEventListener("click", () => {
  const message = document.querySelector("#message");
  if (message.value.trim() !== "") {
    socket.emit("message", message.value);
    message.value = "";
  }
});

// También enviar mensaje al presionar Enter
document.querySelector("#message").addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    send.click();
  }
});

// Recibir mensajes
socket.on("message", ({ user, message, profileImage }) => {
  const isOwnMessage = user === currentUser;
  const userProfile = profileImage || getUserProfile(user);

  const msg = document.createRange().createContextualFragment(`
        <div class="message ${isOwnMessage ? "own" : ""}">
            <div class="image-container">
                <img src="${userProfile}" alt="${user}">
            </div>
            <div class="message-body">
                <div class="user-info">
                    <span class="username">${isOwnMessage ? "Tú" : user}</span>
                    <span class="time">Hace 1 minuto</span>
                </div>
                <p>${message}</p>
            </div>
        </div>
    `);

  allMessages.append(msg);
  allMessages.scrollTop = allMessages.scrollHeight;
});

// Actualizar lista de usuarios
socket.on("users-update", (users) => {
  console.log("Lista de usuarios actualizada:", users);
  updateUsersList(users);
});

// Usuario conectado
socket.on("user-connected", ({ user, profileImage }) => {
  // No mostrar notificación para el usuario actual
  if (user !== currentUser) {
    const notification = document.createRange().createContextualFragment(`
          <div class="system-message">
              <i class="fas fa-user-plus"></i> ${user} se ha conectado
          </div>
      `);
    allMessages.append(notification);
    allMessages.scrollTop = allMessages.scrollHeight;
  }
});

// Usuario desconectado
socket.on("user-disconnected", ({ user }) => {
  const notification = document.createRange().createContextualFragment(`
        <div class="system-message">
            <i class="fas fa-user-minus"></i> ${user} se ha desconectado
        </div>
    `);
  allMessages.append(notification);
  allMessages.scrollTop = allMessages.scrollHeight;
});

function updateUsersList(users) {
  // Ordenar usuarios: primero conectados, luego alfabéticamente
  users.sort((a, b) => {
    if (a.connected && !b.connected) return -1;
    if (!a.connected && b.connected) return 1;
    return a.username.localeCompare(b.username);
  });

  // Destacar al usuario actual
  const currentUserIndex = users.findIndex((u) => u.username === currentUser);
  if (currentUserIndex > -1) {
    const currentUserData = users.splice(currentUserIndex, 1)[0];
    users.unshift(currentUserData); // Poner al usuario actual primero
  }

  usersList.innerHTML = `
    <div class="users-header">
      <h6><i class="fas fa-users"></i> Usuarios (${users.length})</h6>
    </div>
  `;

  users.forEach((user) => {
    const isCurrentUser = user.username === currentUser;
    const userElement = document.createRange().createContextualFragment(`
      <div class="user-item ${user.connected ? "online" : "offline"} ${
      isCurrentUser ? "current-user" : ""
    }">
        <img src="${user.profileImage}" alt="${
      user.username
    }" class="user-avatar">
        <div class="user-info">
          <span class="user-name">${
            isCurrentUser ? `${user.username} (Tú)` : user.username
          }</span>
          <span class="user-status">
            <i class="fas fa-circle"></i>
            ${user.connected ? "En línea" : "Desconectado"}
          </span>
        </div>
      </div>
    `);
    usersList.append(userElement);
  });
}
