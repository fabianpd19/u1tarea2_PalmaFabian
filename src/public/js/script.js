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

// Enviar información del usuario al conectarse
socket.emit("user-join", {
  username: currentUser,
  profileImage: getUserProfile(currentUser),
});

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
  updateUsersList(users);
});

// Usuario conectado
socket.on("user-connected", ({ user, profileImage }) => {
  const notification = document.createRange().createContextualFragment(`
        <div class="system-message">
            <i class="fas fa-user-plus"></i> ${user} se ha conectado
        </div>
    `);
  allMessages.append(notification);
  allMessages.scrollTop = allMessages.scrollHeight;
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
  usersList.innerHTML = `
    <div class="users-header">
      <h6><i class="fas fa-users"></i> Usuarios (${users.length})</h6>
    </div>
  `;

  users.forEach((user) => {
    const userElement = document.createRange().createContextualFragment(`
      <div class="user-item ${user.connected ? "online" : "offline"}">
        <img src="${user.profileImage}" alt="${
      user.username
    }" class="user-avatar">
        <div class="user-info">
          <span class="user-name">${user.username}</span>
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
