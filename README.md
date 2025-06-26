# Informe Técnico: Manejo de Excepciones en Node.js

**Estudiante:** Fabián Alexander Palma Dueñas  
**Carrera / Curso:** Ingeniería en Tecnologías de la Información - 7mo  
**Fecha de Entrega:** 26/06/2025

---

## Introducción

El presente informe tiene como objetivo detallar las **estrategias de manejo de excepciones** en aplicaciones desarrolladas en Node.js. Se aborda la importancia de contar con un manejo adecuado de errores para mejorar la calidad, robustez y mantenibilidad del código. Se explica cómo identificar distintos tipos de errores y se muestran las **buenas prácticas** recomendadas, aplicadas en proyectos desarrollados durante la Unidad 1 (por ejemplo, una API REST usando Serverless y un chat con Socket.IO).

---

## Tipos de Errores en Node.js

En Node.js, los errores pueden clasificarse en:

- **Errores de Sintaxis (SyntaxError):** Errores en el código que impiden su interpretación.
- **Errores en Tiempo de Ejecución (Runtime Errors):**
  - _TypeError_
  - _ReferenceError_
- **Errores del Sistema (SystemError):** Problemas con operaciones a nivel del sistema (por ejemplo, acceso a archivos o servicios externos).
- **Errores Personalizados (CustomError):** Creación de errores a medida para situaciones específicas de la aplicación.

Cada uno de estos errores debe ser tratado de forma adecuada para evitar fallos inesperados en la producción.

---

## Buenas Prácticas para el Manejo de Excepciones

- **Uso de bloques try-catch:**  
  Permite capturar errores tanto en bloques síncronos como en operaciones asincrónicas (usando async/await o Promise.catch).

- **Manejo de errores asincrónicos:**  
  Utiliza `async/await` y captura los errores con `try-catch` o utiliza `.catch` en promesas.

- **Centralización del manejo de errores:**  
  En aplicaciones con Express, es recomendable crear un middleware global para capturar errores no controlados.

- **Logging de errores:**  
  Registra los errores en consola usando `console.error` o, preferiblemente, con herramientas como `winston`.

- **Respuestas HTTP claras y estándar:**  
  Devuelve códigos adecuados (por ejemplo, 500 para errores internos o 404 para rutas no encontradas) con mensajes descriptivos.

- **Validación de datos:**  
  Emplea librerías como `zod` o `yup` para validar entradas y evitar errores derivados de datos mal formateados.

---

## Ejemplo Aplicado de la Unidad 1: Chat con Socket.IO

### 1. Manejo de errores al recibir mensajes:

#### Middleware de conexión y eventos con `try-catch`

```js
socket.on("message", (message) => {
  try {
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
    console.error(`Error al procesar mensaje de ${socket.id}:`, error);
    socket.emit("error-message", "Error interno al enviar el mensaje.");
  }
});
```

**Error forzado:**

```
throw new Error("Error de prueba en el envío de mensaje");
```

**Evidencia:**

> ![Manejo de errores al recibir mensajes](https://i.imgur.com/O0HRRyy.png)

**¿Qué valida?**

- Que el mensaje no esté vacío.
- Que el usuario esté correctamente conectado.

**¿Por qué se hace?**

> Para evitar que se emitan mensajes vacíos o que un socket sin información envíe datos mal formados.

**¿Cómo se forzó el error?**

> Enviando un mensaje vacío o eliminando manualmente connectedUsers.

**Resultado:**

- El error es capturado en consola.
- El cliente recibe un evento de error con un mensaje explicativo.

### 2. Validación del lado cliente (register.js)

```js
login.addEventListener("click", () => {
  const user = document.querySelector("#username").value.trim();
  if (user !== "") {
    // Guardar nombre de usuario
    document.cookie = `username=${user}`;

    // Guardar foto de perfil en localStorage
    const profileSrc = profilePreview.src;
    try {
      Object.defineProperty(window, "localStorage", {
        value: null,
        writable: true,
      });

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
```

**Error forzado:**

```js
Object.defineProperty(window, "localStorage", {
  value: null,
  writable: true,
});
```

**Evidencia:**

> ![Validar que la imagen se haya subido correctamente](https://i.imgur.com/BA6AqWS.png)

**¿Qué valida?**

- Que localStorage esté disponible y tenga espacio suficiente.
- Que el navegador permita guardar la imagen.

**¿Por qué se hace?**

> Porque en modo incógnito o si el espacio está lleno, localStorage.setItem() puede lanzar un error.

**¿Cómo se forzó el error?**

> Se fuerza un error al intentar acceder o usar localStorage, ya que se sobrescribe la propiedad localStorage del objeto window con null.

**Resultado:**

- Se muestra un alert: "Error al guardar la imagen de perfil".
- Se imprime el error QuotaExceededError en la consola.

### 3. Middleware para 404 y errores generales

```
// Ruta 404
app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

// Middleware global de errores
app.use((err, req, res, next) => {
  console.error("Error no controlado:", err.stack);
  res.status(500).json({ message: "Error interno del servidor" });
});
```

**Evidencia:**

> ![Error de página no encontrada](https://i.imgur.com/4RHl6WE.png)

> ![Error interno del servidor](https://i.imgur.com/fFuGUGR.png)

**¿Qué valida?**

- Que las rutas no existentes muestren una página personalizada.
- Que errores generales no controlados retornen un estado 500.

**¿Por qué se hace?**

- Para mejorar la experiencia del usuario al acceder a rutas inválidas con una página clara y estética (404).
- Para garantizar la estabilidad del servidor al capturar errores no controlados, registrarlos en consola y enviar una respuesta estructurada (500), sin necesidad de duplicar lógica de manejo de errores en cada ruta.

**¿Cómo se forzó el error?**

- Accediendo a una ruta no existente (/uta-que-no-existe).
- Forzando un error en una ruta con throw new Error("Error de prueba").

**Resultado:**

- Se muestra el HTML 404.html.
- Se retorna como mensaje 'Error interno del servidor'.

---

## Reutilización del Código

- Se reutilizó la lógica de validación en todos los eventos Socket.IO.
- Se estandarizó el formato de los errores enviados al cliente.
- Se reutilizó broadcastUsersList() y getUsersList() con protección en try-catch.
- En el cliente, se usaron claves únicas para guardar perfiles (profile\_${user}) evitando conflictos.

---

## Conclusiones

> El manejo de errores correctamente implementado permite anticipar fallos, evitar caídas del servidor y mejorar la experiencia del usuario. En este proyecto de chat, se logró capturar tanto errores comunes como escenarios más raros (falta de espacio en el navegador, rutas inválidas, desconexiones incompletas). Estas prácticas hacen que el sistema sea más mantenible y confiable a largo plazo.
