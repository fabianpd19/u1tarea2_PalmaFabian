# Chat en Tiempo Real con Sockets

**Nombre del estudiante:** Fabián Alexander Palma Dueñas  
**Fecha de entrega:** 01/06/2025

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
- `feature-usuarios-conectados`: Rama en la cual se añadieron funcionalidades extras.

Comandos sugeridos (repositorio original):

```bash
git clone https://github.com/paulosk8/webChat.git
cd webChat
git checkout -b mi-implementacion
```

Comandos sugeridos (repositorio actual)

```bash
https://github.com/fabianpd19/u1tarea2_PalmaFabian
cd u1tarea2_PalmaFabian
git checkout -b feature-usuarios-conectados
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

## ✨ Nuevas funcionalidades añadidas

- **Carga y visualización de imagen de perfil**: Los usuarios pueden subir una imagen personalizada durante el registro. Esta imagen se muestra como avatar en el chat y se almacena en el navegador mediante localStorage para mantener la personalización sin necesidad de almacenamiento en servidor.
  > ![Uso de imagen personalizada](https://i.imgur.com/mMQ9ngL.png)
- **Diferenciación visual de mensajes**: Los mensajes enviados por el usuario actual se muestran alineados a la derecha, mientras que los mensajes de otros usuarios aparecen alineados a la izquierda, facilitando la identificación visual rápida.
  > ![Diferencia visual de mensajes](https://i.imgur.com/a63GA03.png)
- **Lista dinámica de usuarios**: Se añadió una lista que muestra todos los usuarios registrados, indicando su estado (en línea o desconectado) y mostrando su imagen de perfil. El usuario actual se destaca visualmente para mayor claridad.
  > ![Lista de usuarios conectados/desconectados](https://i.imgur.com/zLdal9i.png)
- **Notificaciones en tiempo real**: Se muestran mensajes del sistema cuando un usuario se conecta o desconecta, mejorando la interacción social dentro del chat.
  > ![Notificaciones](https://i.imgur.com/2YyFxQX.png)

## 🛠️ Lógica del Chat

- Al acceder al chat, el usuario debe ingresar un nombre (se guarda en una cookie).
- Se añadió la funcionalidad para que el usuario pueda subir una imagen de perfil durante el registro, la cual se almacena en localStorage y se muestra como avatar en el chat.
- Los mensajes enviados por el usuario actual se muestran alineados a la derecha, mientras que los mensajes de otros usuarios aparecen alineados a la izquierda, facilitando la distinción visual.
- Se implementa una lista dinámica de usuarios conectados y desconectados, mostrando su estado y su imagen de perfil.
- El cliente se conecta mediante Socket.IO y puede enviar mensajes que se replican en tiempo real a todos los usuarios conectados.
- Los mensajes se renderizan dinámicamente con una estructura que incluye el nombre del usuario, su mensaje y una imagen de perfil.

## 🎨 Mejoras en el diseño

- Interfaz estilizada con imágenes, contenedores modernos y separación clara de mensajes.
- Distribución responsiva compatible con pantallas móviles.
- Implementación de vistas limpias, con separación entre lógica de cliente y servidor.
- Visualización diferenciada de mensajes propios y ajenos mediante alineación y estilos CSS + Bootstrap.

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

5. Ingresa un nombre de usuario y selecciona una imagen de perfil en el registro.
6. Comienza a chatear en tiempo real, visualizando mensajes y usuarios con sus imágenes y estados.

---

## 🖼️ Capturas de Pantalla

#### 📝 Registro de usuario con imagen de perfil

![Registro de usuario](https://i.imgur.com/DljZA0G.png)

### 💬 Chat en funcionamiento

![Chat en funcionamiento](https://i.imgur.com/Ldy3ODg.png)

### 📱 Vista responsiva

## ![Vista responsiva](https://i.imgur.com/KJ1VcQH.png)

## 📚 Conclusiones

Durante el desarrollo de este proyecto se aprendieron los siguientes conceptos clave:

- Implementación de Sockets para comunicación en tiempo real.
- Uso de Express y organización modular en Node.js.
- Gestión de sesiones simples con cookies y almacenamiento local para imágenes de perfil.
- Diferenciación visual de mensajes mediante alineación y estilos CSS.
- Actualización dinámica de la lista de usuarios con estados y avatares.

## 🧗‍♀️ Dificultades y soluciones

- **Gestión de cookies en Socket.IO**: Se resolvió extrayendo manualmente la cookie del encabezado durante la conexión del socket.
- **Actualización de interfaz al recibir mensajes**: Se implementó la generación dinámica de elementos HTML con createContextualFragment.
- **Almacenamiento y recuperación de imágenes de perfil**: Se utilizó localStorage para evitar sobrecargar el servidor y mantener la personalización en el cliente.

---

## 🔍 Referencias

- [📂 Repositorio base del proyecto – webChat (paulosk8)](https://github.com/paulosk8/webChat)  
  Proyecto base proporcionado por el docente como referencia para el desarrollo del chat.
