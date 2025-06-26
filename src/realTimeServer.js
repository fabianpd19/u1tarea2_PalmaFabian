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

      // Registrar usuario
      registeredUsers.set(username, {
        profileImage: profileImage || "/img/perfil.jpg",
        lastSeen: new Date(),
        connected: true,
      });

      // Agregar a usuarios conectados
      connectedUsers.set(socket.id, { username, profileImage });

      console.log(`Usuario conectado: ${username}`);

      // Notificar a todos los usuarios (incluyendo al que se acaba de conectar)
      io.emit("user-connected", { user: username, profileImage });

      // Enviar lista actualizada de usuarios a todos
      broadcastUsersList();
    });

    socket.on("message", (message) => {
      try {
        // throw new Error("Error de prueba en el envío de mensaje");
        const userInfo = connectedUsers.get(socket.id);
        if (userInfo && message.trim() !== "") {
          io.emit("message", {
            user: userInfo.username,
            message: message.trim(),
            profileImage: userInfo.profileImage,
            timestamp: new Date().toISOString(),
          });
        }
      } catch (error) {
        console.error("Error al procesar el mensaje:", error);
        return;
      }
    });

    socket.on("disconnect", () => {
      const userInfo = connectedUsers.get(socket.id);
      if (userInfo) {
        console.log(`Usuario desconectado: ${userInfo.username}`);

        // Verificar si el usuario está conectado desde otro dispositivo/pestaña
        let userStillConnected = false;
        for (const [sid, info] of connectedUsers.entries()) {
          if (sid !== socket.id && info.username === userInfo.username) {
            userStillConnected = true;
            break;
          }
        }

        // Actualizar estado del usuario solo si no está conectado en otra sesión
        if (!userStillConnected && registeredUsers.has(userInfo.username)) {
          registeredUsers.set(userInfo.username, {
            ...registeredUsers.get(userInfo.username),
            connected: false,
            lastSeen: new Date(),
          });
        }

        // Remover de usuarios conectados
        connectedUsers.delete(socket.id);

        // Notificar a otros usuarios solo si el usuario ya no está conectado
        if (!userStillConnected) {
          socket.broadcast.emit("user-disconnected", {
            user: userInfo.username,
          });
        }

        // Enviar lista actualizada de usuarios
        broadcastUsersList();
      }
    });

    // Enviar lista inicial de usuarios al conectarse
    broadcastUsersList();
  });

  function broadcastUsersList() {
    io.emit("users-update", getUsersList());
  }

  function getUsersList() {
    // Crear un mapa para evitar duplicados
    const usersMap = new Map();

    // Primero agregar todos los usuarios registrados
    for (const [username, userInfo] of registeredUsers) {
      usersMap.set(username, {
        username,
        profileImage: userInfo.profileImage,
        connected: false,
        lastSeen: userInfo.lastSeen,
      });
    }

    // Luego actualizar los que están conectados
    for (const [socketId, userInfo] of connectedUsers) {
      usersMap.set(userInfo.username, {
        username: userInfo.username,
        profileImage: userInfo.profileImage,
        connected: true,
      });
    }

    // Convertir el mapa a un array
    return Array.from(usersMap.values());
  }
};
