/* =========================================
   CREDENCIALES DEL LOGIN
   Aquí puedes cambiar el usuario y contraseña
========================================= */
const usuarioCorrecto = "admin";
const contrasenaCorrecta = "12345";

/* =========================================
   ELEMENTOS DEL LOGIN
========================================= */
const loginSection = document.getElementById("loginSection");
const dashboardSection = document.getElementById("dashboardSection");

const usuarioInput = document.getElementById("usuario");
const contrasenaInput = document.getElementById("contrasena");

const btnLogin = document.getElementById("btnLogin");
const mensajeLogin = document.getElementById("mensajeLogin");
const btnLogout = document.getElementById("btnLogout");

/* =========================================
   ELEMENTOS DE HUMEDAD
========================================= */
const humedadRange = document.getElementById("humedadRange");
const humedadInput = document.getElementById("humedadInput");
const humedadValor = document.getElementById("humedadValor");
const ledHumedad = document.getElementById("ledHumedad");
const estadoHumedad = document.getElementById("estadoHumedad");

/* =========================================
   ELEMENTOS DE TEMPERATURA
========================================= */
const temperaturaRange = document.getElementById("temperaturaRange");
const temperaturaInput = document.getElementById("temperaturaInput");
const temperaturaValor = document.getElementById("temperaturaValor");
const ledTemperatura = document.getElementById("ledTemperatura");
const estadoTemperatura = document.getElementById("estadoTemperatura");

/* =========================================
   ELEMENTOS DE LUZ
========================================= */
const luzRange = document.getElementById("luzRange");
const luzInput = document.getElementById("luzInput");
const luzValor = document.getElementById("luzValor");
const ledLuz = document.getElementById("ledLuz");
const estadoLuz = document.getElementById("estadoLuz");

/* =========================================
   ELEMENTOS DE NIVEL DE AGUA
========================================= */
const nivelRange = document.getElementById("nivelRange");
const nivelInput = document.getElementById("nivelInput");
const nivelValor = document.getElementById("nivelValor");
const ledNivel = document.getElementById("ledNivel");
const estadoNivel = document.getElementById("estadoNivel");

/* =========================================
   ELEMENTOS DE PROXIMIDAD
========================================= */
const proximidadRange = document.getElementById("proximidadRange");
const proximidadInput = document.getElementById("proximidadInput");
const proximidadValor = document.getElementById("proximidadValor");
const ledProximidad = document.getElementById("ledProximidad");
const estadoProximidad = document.getElementById("estadoProximidad");

/* =========================================
   ELEMENTOS DE BOTONES Y RESUMEN
========================================= */
const btnAleatorio = document.getElementById("btnAleatorio");
const btnReset = document.getElementById("btnReset");

const horaActual = document.getElementById("horaActual");
const estadoGeneral = document.getElementById("estadoGeneral");
const descripcionGeneral = document.getElementById("descripcionGeneral");

/* =========================================
   FUNCIÓN PARA LIMITAR VALORES
   Evita que el usuario escriba números fuera
   del rango permitido
========================================= */
function limitarValor(valor, minimo, maximo) {
  let numero = parseInt(valor);

  if (isNaN(numero)) {
    numero = minimo;
  }

  if (numero < minimo) {
    numero = minimo;
  }

  if (numero > maximo) {
    numero = maximo;
  }

  return numero;
}

/* =========================================
   FUNCIÓN PARA LIMPIAR EL COLOR DEL LED
========================================= */
function limpiarLed(led) {
  led.classList.remove("led-green", "led-yellow", "led-red", "led-off");
}

/* =========================================
   FUNCIÓN PARA COLOCAR EL COLOR DEL LED
========================================= */
function ponerLed(led, color) {
  limpiarLed(led);

  if (color === "rojo") {
    led.classList.add("led-red");
  } else if (color === "amarillo") {
    led.classList.add("led-yellow");
  } else if (color === "verde") {
    led.classList.add("led-green");
  } else {
    led.classList.add("led-off");
  }
}

/* =========================================
   FUNCIÓN PARA ACTUALIZAR LA HORA
========================================= */
function actualizarHora() {
  const ahora = new Date();
  horaActual.textContent = ahora.toLocaleTimeString();
}

/* =========================================
   LOGIN
   Solo muestra la interfaz principal si
   el usuario y contraseña son correctos
========================================= */
function iniciarSesion() {
  const usuario = usuarioInput.value.trim();
  const contrasena = contrasenaInput.value.trim();

  if (usuario === usuarioCorrecto && contrasena === contrasenaCorrecta) {
    mensajeLogin.textContent = "Acceso correcto. Bienvenido al sistema.";
    mensajeLogin.style.color = "#22c55e";

    loginSection.classList.remove("active");
    dashboardSection.classList.add("active");

    actualizarTodo();
  } else {
    mensajeLogin.textContent = "Usuario o contraseña incorrectos.";
    mensajeLogin.style.color = "#ef4444";
  }
}

btnLogin.addEventListener("click", iniciarSesion);

/* Permite entrar también con la tecla Enter */
contrasenaInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    iniciarSesion();
  }
});

usuarioInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    iniciarSesion();
  }
});

/* =========================================
   CERRAR SESIÓN
========================================= */
btnLogout.addEventListener("click", function () {
  dashboardSection.classList.remove("active");
  loginSection.classList.add("active");

  usuarioInput.value = "";
  contrasenaInput.value = "";
  mensajeLogin.textContent = "";
});

/* =========================================
   SINCRONIZAR CONTROLES
   Mantiene igual el valor del slider y el
   campo numérico
========================================= */
function sincronizarControles(range, input, minimo, maximo) {
  range.addEventListener("input", function () {
    input.value = range.value;
    actualizarTodo();
  });

  input.addEventListener("input", function () {
    if (input.value !== "") {
      const valor = limitarValor(input.value, minimo, maximo);
      input.value = valor;
      range.value = valor;
      actualizarTodo();
    }
  });
}

/* Se conectan los 5 sensores */
sincronizarControles(humedadRange, humedadInput, 0, 100);
sincronizarControles(temperaturaRange, temperaturaInput, 0, 50);
sincronizarControles(luzRange, luzInput, 0, 100);
sincronizarControles(nivelRange, nivelInput, 0, 100);
sincronizarControles(proximidadRange, proximidadInput, 0, 100);

/* =========================================
   LÓGICA DEL SENSOR DE HUMEDAD
   <= 8    -> rojo
   9 a 20  -> amarillo
   > 20    -> verde
========================================= */
function actualizarHumedad() {
  const humedad = parseInt(humedadRange.value);
  humedadValor.textContent = humedad;

  if (humedad <= 8) {
    ponerLed(ledHumedad, "rojo");
    estadoHumedad.textContent = "Estado: Crítico (humedad muy baja)";
    return "rojo";
  } else if (humedad <= 20) {
    ponerLed(ledHumedad, "amarillo");
    estadoHumedad.textContent = "Estado: Advertencia (humedad baja)";
    return "amarillo";
  } else {
    ponerLed(ledHumedad, "verde");
    estadoHumedad.textContent = "Estado: Estable";
    return "verde";
  }
}

/* =========================================
   LÓGICA DEL SENSOR DE TEMPERATURA
   < 10      -> rojo
   10 a 17   -> amarillo
   18 a 28   -> verde
   29 a 35   -> amarillo
   > 35      -> rojo
========================================= */
function actualizarTemperatura() {
  const temperatura = parseInt(temperaturaRange.value);
  temperaturaValor.textContent = temperatura;

  if (temperatura < 10) {
    ponerLed(ledTemperatura, "rojo");
    estadoTemperatura.textContent = "Estado: Crítico (temperatura muy baja)";
    return "rojo";
  } else if (temperatura <= 17) {
    ponerLed(ledTemperatura, "amarillo");
    estadoTemperatura.textContent = "Estado: Advertencia (temperatura baja)";
    return "amarillo";
  } else if (temperatura <= 28) {
    ponerLed(ledTemperatura, "verde");
    estadoTemperatura.textContent = "Estado: Normal";
    return "verde";
  } else if (temperatura <= 35) {
    ponerLed(ledTemperatura, "amarillo");
    estadoTemperatura.textContent = "Estado: Advertencia (temperatura alta)";
    return "amarillo";
  } else {
    ponerLed(ledTemperatura, "rojo");
    estadoTemperatura.textContent = "Estado: Crítico (temperatura muy alta)";
    return "rojo";
  }
}

/* =========================================
   LÓGICA DEL SENSOR DE LUZ
   <= 20    -> rojo
   21 a 50  -> amarillo
   > 50     -> verde
========================================= */
function actualizarLuz() {
  const luz = parseInt(luzRange.value);
  luzValor.textContent = luz;

  if (luz <= 20) {
    ponerLed(ledLuz, "rojo");
    estadoLuz.textContent = "Estado: Crítico (iluminación muy baja)";
    return "rojo";
  } else if (luz <= 50) {
    ponerLed(ledLuz, "amarillo");
    estadoLuz.textContent = "Estado: Advertencia (iluminación media)";
    return "amarillo";
  } else {
    ponerLed(ledLuz, "verde");
    estadoLuz.textContent = "Estado: Adecuado";
    return "verde";
  }
}

/* =========================================
   LÓGICA DEL SENSOR DE NIVEL DE AGUA
   <= 20    -> rojo
   21 a 50  -> amarillo
   > 50     -> verde
========================================= */
function actualizarNivelAgua() {
  const nivel = parseInt(nivelRange.value);
  nivelValor.textContent = nivel;

  if (nivel <= 20) {
    ponerLed(ledNivel, "rojo");
    estadoNivel.textContent = "Estado: Crítico (tanque casi vacío)";
    return "rojo";
  } else if (nivel <= 50) {
    ponerLed(ledNivel, "amarillo");
    estadoNivel.textContent = "Estado: Advertencia (nivel medio)";
    return "amarillo";
  } else {
    ponerLed(ledNivel, "verde");
    estadoNivel.textContent = "Estado: Correcto";
    return "verde";
  }
}

/* =========================================
   LÓGICA DEL SENSOR DE PROXIMIDAD
   <= 10 cm   -> rojo
   11 a 25 cm -> amarillo
   > 25 cm    -> verde
========================================= */
function actualizarProximidad() {
  const proximidad = parseInt(proximidadRange.value);
  proximidadValor.textContent = proximidad;

  if (proximidad <= 10) {
    ponerLed(ledProximidad, "rojo");
    estadoProximidad.textContent = "Estado: Crítico (objeto muy cerca)";
    return "rojo";
  } else if (proximidad <= 25) {
    ponerLed(ledProximidad, "amarillo");
    estadoProximidad.textContent = "Estado: Advertencia (objeto cercano)";
    return "amarillo";
  } else {
    ponerLed(ledProximidad, "verde");
    estadoProximidad.textContent = "Estado: Distancia segura";
    return "verde";
  }
}

/* =========================================
   ESTADO GENERAL DEL SISTEMA
   Si algún sensor está en rojo -> alerta
   Si no hay rojo pero sí amarillo -> advertencia
   Si todos están en verde -> normal
========================================= */
function actualizarEstadoGeneral(estados) {
  if (estados.includes("rojo")) {
    estadoGeneral.textContent = "Alerta del sistema";
    descripcionGeneral.textContent =
      "Se detectó al menos una condición crítica en los sensores. Es necesario revisar los valores mostrados y tomar acciones correctivas.";
  } else if (estados.includes("amarillo")) {
    estadoGeneral.textContent = "Sistema en advertencia";
    descripcionGeneral.textContent =
      "El sistema sigue funcionando, pero uno o más sensores están en una condición intermedia que requiere atención.";
  } else {
    estadoGeneral.textContent = "Operación normal";
    descripcionGeneral.textContent =
      "Todos los sensores están dentro de rangos adecuados y los LEDs muestran condiciones estables.";
  }
}

/* =========================================
   BOTÓN PARA GENERAR VALORES ALEATORIOS
========================================= */
btnAleatorio.addEventListener("click", function () {
  const humedadRandom = Math.floor(Math.random() * 101);
  const temperaturaRandom = Math.floor(Math.random() * 51);
  const luzRandom = Math.floor(Math.random() * 101);
  const nivelRandom = Math.floor(Math.random() * 101);
  const proximidadRandom = Math.floor(Math.random() * 101);

  humedadRange.value = humedadRandom;
  humedadInput.value = humedadRandom;

  temperaturaRange.value = temperaturaRandom;
  temperaturaInput.value = temperaturaRandom;

  luzRange.value = luzRandom;
  luzInput.value = luzRandom;

  nivelRange.value = nivelRandom;
  nivelInput.value = nivelRandom;

  proximidadRange.value = proximidadRandom;
  proximidadInput.value = proximidadRandom;

  actualizarTodo();
});

/* =========================================
   BOTÓN PARA RESTABLECER VALORES
========================================= */
btnReset.addEventListener("click", function () {
  humedadRange.value = 45;
  humedadInput.value = 45;

  temperaturaRange.value = 24;
  temperaturaInput.value = 24;

  luzRange.value = 60;
  luzInput.value = 60;

  nivelRange.value = 70;
  nivelInput.value = 70;

  proximidadRange.value = 40;
  proximidadInput.value = 40;

  actualizarTodo();
});

/* =========================================
   FUNCIÓN GENERAL
   Actualiza todos los sensores, LEDs,
   estado general y hora
========================================= */
function actualizarTodo() {
  const estado1 = actualizarHumedad();
  const estado2 = actualizarTemperatura();
  const estado3 = actualizarLuz();
  const estado4 = actualizarNivelAgua();
  const estado5 = actualizarProximidad();

  actualizarEstadoGeneral([estado1, estado2, estado3, estado4, estado5]);
  actualizarHora();
}

/* =========================================
   RELOJ AUTOMÁTICO
========================================= */
setInterval(actualizarHora, 1000);

/* Inicializa valores al cargar el archivo */
actualizarTodo();
