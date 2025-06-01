module.exports = (httpServer) => {
  const { Server } = require("socket.io");
  const io = new Server(httpServer);

  // Almacenar usuarios registrados y conectados
  const registeredUsers = new Map(); // username -> {profileImage, lastSeen}
  const connectedUsers = new Map(); // socketId -> {username, profileImage}

  io.on("connection", (socket) => {
    console.log("Nueva conexión:", socket.id);

    // Cuando un usuario se une
    socket.on("user-join", ({ username, profileImage }) => {
      if (!username) return;

      registeredUsers.set(username, {
        profileImage: profileImage || "/img/perfil.jpg",
        lastSeen: new Date(),
        connected: true,
      });

      connectedUsers.set(socket.id, { username, profileImage });

      console.log(`Usuario conectado: ${username}`);

      // Emitir lista actualizada a todos
      io.emit(
        "update-user-list",
        Array.from(registeredUsers.entries()).map(([name, data]) => ({
          username: name,
          profileImage: data.profileImage,
          connected: data.connected,
        }))
      );
    });

    socket.on("message", (message) => {
      const userInfo = connectedUsers.get(socket.id);
      if (userInfo && message.trim() !== "") {
        io.emit("message", {
          user: userInfo.username,
          message: message.trim(),
          profileImage: userInfo.profileImage,
          timestamp: new Date().toISOString(),
        });
      }
    });

    socket.on("disconnect", () => {
      const userData = connectedUsers.get(socket.id);
      if (userData) {
        const { username } = userData;
        connectedUsers.delete(socket.id);
        if (registeredUsers.has(username)) {
          const user = registeredUsers.get(username);
          user.connected = false;
          user.lastSeen = new Date();
        }

        io.emit(
          "update-user-list",
          Array.from(registeredUsers.entries()).map(([name, data]) => ({
            username: name,
            profileImage: data.profileImage,
            connected: data.connected,
          }))
        );
      }
    });

    // Enviar lista inicial de usuarios al conectarse
    socket.emit("users-update", getUsersList());
  });

  function broadcastUsersList() {
    io.emit("users-update", getUsersList());
  }

  function getUsersList() {
    const users = [];

    // Agregar usuarios conectados
    for (const [socketId, userInfo] of connectedUsers) {
      users.push({
        username: userInfo.username,
        profileImage: userInfo.profileImage,
        connected: true,
      });
    }

    // Agregar usuarios registrados pero desconectados
    for (const [username, userInfo] of registeredUsers) {
      const isConnected = Array.from(connectedUsers.values()).some(
        (u) => u.username === username
      );
      if (!isConnected) {
        users.push({
          username,
          profileImage: userInfo.profileImage,
          connected: false,
          lastSeen: userInfo.lastSeen,
        });
      }
    }

    return users;
  }
};
