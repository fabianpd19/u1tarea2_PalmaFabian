# Chat en Tiempo Real con Sockets

**Nombre del estudiante:** Fabián Alexander Palma Dueñas  
**Fecha de entrega:** 30/05/2025

---

## 📌 Introducción

Este proyecto es una aplicación web de chat en tiempo real desarrollada utilizando **Node.js**, **Express**, y **Socket.IO**. Su propósito es demostrar cómo implementar comunicación bidireccional en tiempo real entre clientes y servidor, permitiendo que múltiples usuarios intercambien mensajes instantáneamente.

El uso de **sockets** es esencial en aplicaciones modernas como chats, juegos en línea, sistemas de notificación o colaboración en tiempo real, donde se requiere comunicación constante sin necesidad de recargar la página.

---

## 🧱 Repositorio Base

Repositorio original proporcionado por el docente:  
🔗 [https://github.com/paulosk8/webChat/tree/main](https://github.com/paulosk8/webChat/tree/main)

Para comenzar, se clonó el repositorio o se inició uno desde cero. Se trabajó con las siguientes ramas:

- `main`: Código inicial del proyecto.
- `implementacion-chat`: Versión de referencia final (rama base utilizada para la creación del proyecto).
- `mi-implementacion`: Rama creada para el desarrollo del proyecto.

Comandos sugeridos:

```bash
git clone https://github.com/paulosk8/webChat.git
cd webChat
git checkout -b mi-implementacion
```

---

## 🧩 Implementación del Proyecto

#### 📁 Estructura del código

    src/
    ├── index.js
    ├── realTimeServer.js
    ├── middlewares/
    │   └── isLoggedin.js
    ├── public/
    │   ├── css/
    │   ├── img/
    │   ├── js/
    │   │   ├── register.js
    │   │   └── script.js
    ├── routes/
    │   └── index.js
    └── views/
    │   ├── index.html
    └── register.html

---

## 🛠️ Lógica del Chat

- Al acceder al chat, el usuario debe ingresar un nombre (se guarda en una cookie).
- Una vez registrado, se redirige al chat principal.
- El cliente se conecta mediante Socket.IO y puede enviar mensajes que se replican en tiempo real a todos los usuarios conectados.
- Los mensajes se renderizan dinámicamente con una estructura que incluye el nombre del usuario, su mensaje y una imagen de perfil.

## 🎨 Mejoras en el diseño

- Interfaz estilizada con imágenes, contenedores modernos y separación clara de mensajes.
- Distribución responsiva compatible con pantallas móviles.
- Implementación de vistas limpias, con separación entre lógica de cliente y servidor.

---

## 🚀 Instrucciones de Ejecución

Sigue estos pasos para ejecutar el proyecto localmente:

1. Clona el repositorio o copia los archivos a tu entorno local.
2. Instala las dependencias:

```bash
npm install
```

3. Ejecuta el servidor

```bash
npm start
```

4. Abre el navegador en:

```bash
http://localhost:3000
```

5. Ingresa un nombre de usuario en el registro.
6. Comienza a chatear en tiempo real.

---

## 🖼️ Capturas de Pantalla

#### 📝 Registro de usuario

![Registro de usuario](https://i.imgur.com/lIzkDGB.png)

### 💬 Chat en funcionamiento

![Chat en funcionamiento](https://i.imgur.com/GiMeHH6.png)

### 📱 Vista responsiva

## ![Vista responsiva](https://i.imgur.com/8CBymlp.png)

## 📚 Conclusiones

Durante el desarrollo de este proyecto se aprendieron los siguientes conceptos clave:

- Implementación de Sockets para comunicación en tiempo real.
- Uso de Express y organización modular en Node.js.
- Gestión de sesiones simples con cookies.
- Separación de responsabilidades entre vistas, rutas, lógica del cliente y del servidor.

## 🧗‍♀️ Dificultades y soluciones

- **Gestión de cookies en Socket.IO**: Se resolvió extrayendo manualmente la cookie del encabezado durante la conexión del socket.
- **Actualización de interfaz al recibir mensajes**: Se implementó la generación dinámica de elementos HTML con createContextualFragment.

---

## 🔍 Referencias

- [📂 Repositorio base del proyecto – webChat (paulosk8)](https://github.com/paulosk8/webChat)  
  Proyecto base proporcionado por el docente como referencia para el desarrollo del chat.
