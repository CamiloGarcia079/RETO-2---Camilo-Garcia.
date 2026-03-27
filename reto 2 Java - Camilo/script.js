var nombresAlumnos = new Array(10);
var notasAlumnos = new Array(10);
var cantidadAlumnos = 0;

var formulario = document.getElementById("formularioNotas");
var nombreInput = document.getElementById("nombre");
var certamen1Input = document.getElementById("certamen1");
var certamen2Input = document.getElementById("certamen2");
var certamen3Input = document.getElementById("certamen3");
var mensaje = document.getElementById("mensaje");
var contadorAlumnos = document.getElementById("contadorAlumnos");
var botonAgregar = document.getElementById("botonAgregar");
var botonLimpiar = document.getElementById("botonLimpiar");
var estadoVacio = document.getElementById("estadoVacio");
var resultados = document.getElementById("resultados");
var listadoAlumnos = document.getElementById("listadoAlumnos");
var promediosCurso = document.getElementById("promediosCurso");
var estadoCurso = document.getElementById("estadoCurso");
var rankingAlumnos = document.getElementById("rankingAlumnos");

function mostrarMensaje(texto, tipo) {
  mensaje.textContent = texto;
  mensaje.className = "mensaje " + tipo;
}

function limpiarFormulario() {
  formulario.reset();
  nombreInput.focus();
}

function esNotaValida(nota) {
  return !isNaN(nota) && nota >= 0 && nota <= 100;
}

function obtenerNotasFormulario() {
  return [
    parseFloat(certamen1Input.value),
    parseFloat(certamen2Input.value),
    parseFloat(certamen3Input.value)
  ];
}

function validarDatos(nombre, notas) {
  if (nombre === "") {
    mostrarMensaje("Debes ingresar el nombre del alumno.", "error");
    return false;
  }

  for (var i = 0; i < notas.length; i++) {
    if (!esNotaValida(notas[i])) {
      mostrarMensaje("Todas las notas deben estar entre 0 y 100.", "error");
      return false;
    }
  }

  return true;
}

function calcularPromedio(notas) {
  var suma = notas.reduce(function (acumulado, nota) {
    return acumulado + nota;
  }, 0);

  return suma / notas.length;
}

function calcularPromediosCurso() {
  var totales = [0, 0, 0];

  notasAlumnos.slice(0, cantidadAlumnos).forEach(function (notas) {
    notas.forEach(function (nota, indice) {
      totales[indice] += nota;
    });
  });

  return totales.map(function (total) {
    return total / cantidadAlumnos;
  });
}

function obtenerDatosAlumnos() {
  return nombresAlumnos.slice(0, cantidadAlumnos).map(function (nombre, indice) {
    var notas = notasAlumnos[indice];
    var promedio = calcularPromedio(notas);

    return {
      nombre: nombre,
      notas: notas,
      promedio: promedio
    };
  });
}

function actualizarContador() {
  contadorAlumnos.textContent = "Alumno registrado: " + cantidadAlumnos + " de 10";

  if (cantidadAlumnos === 10) {
    botonAgregar.disabled = true;
    mostrarMensaje("Se completó el registro de los 10 alumnos.", "exito");
  }
}

function crearTarjetaAlumno(alumno, indice) {
  var estadoClase = alumno.promedio >= 55 ? "estado-aprobado" : "estado-reprobado";
  var estadoTexto = alumno.promedio >= 55 ? "Aprobado" : "Reprobado";

  return (
    '<article class="alumno-card">' +
      "<h4>Alumno " + (indice + 1) + ": " + alumno.nombre + "</h4>" +
      '<div class="notas-grid">' +
        '<div class="nota-item"><strong>C1</strong><span class="detalle-nota">' + alumno.notas[0].toFixed(2) + "</span></div>" +
        '<div class="nota-item"><strong>C2</strong><span class="detalle-nota">' + alumno.notas[1].toFixed(2) + "</span></div>" +
        '<div class="nota-item"><strong>C3</strong><span class="detalle-nota">' + alumno.notas[2].toFixed(2) + "</span></div>" +
        '<div class="nota-item"><strong>Promedio</strong><span class="detalle-nota">' + alumno.promedio.toFixed(2) + "</span></div>" +
      "</div>" +
      '<p class="' + estadoClase + '">' + estadoTexto + "</p>" +
    "</article>"
  );
}

function mostrarListadoAlumnos(datosAlumnos) {
  listadoAlumnos.innerHTML = datosAlumnos.map(function (alumno, indice) {
    return crearTarjetaAlumno(alumno, indice);
  }).join("");
}

function mostrarResumenCurso(datosAlumnos) {
  var promedios = calcularPromediosCurso();
  var promedioGeneral = datosAlumnos.reduce(function (acumulado, alumno) {
    return acumulado + alumno.promedio;
  }, 0) / datosAlumnos.length;

  var aprobados = datosAlumnos.filter(function (alumno) {
    return alumno.promedio >= 55;
  }).length;

  var reprobados = datosAlumnos.length - aprobados;

  promediosCurso.innerHTML =
    "<li><span>Promedio curso C1</span><strong>" + promedios[0].toFixed(2) + "</strong></li>" +
    "<li><span>Promedio curso C2</span><strong>" + promedios[1].toFixed(2) + "</strong></li>" +
    "<li><span>Promedio curso C3</span><strong>" + promedios[2].toFixed(2) + "</strong></li>" +
    "<li><span>Promedio general del curso</span><strong>" + promedioGeneral.toFixed(2) + "</strong></li>";

  estadoCurso.innerHTML =
    "<li><span>Total de alumnos</span><strong>" + datosAlumnos.length + "</strong></li>" +
    "<li><span>Aprobados</span><strong>" + aprobados + "</strong></li>" +
    "<li><span>Reprobados</span><strong>" + reprobados + "</strong></li>";
}

function mostrarRanking(datosAlumnos) {
  var ordenados = datosAlumnos.slice().sort(function (a, b) {
    return b.promedio - a.promedio;
  });

  rankingAlumnos.innerHTML = ordenados.map(function (alumno, indice) {
    return (
      '<article class="ranking-item">' +
        '<div class="posicion">' + (indice + 1) + "</div>" +
        "<div>" +
          "<strong>" + alumno.nombre + "</strong>" +
          '<span class="detalle-promedio">Promedio final: ' + alumno.promedio.toFixed(2) + "</span>" +
        "</div>" +
      "</article>"
    );
  }).join("");
}

function actualizarResultados() {
  if (cantidadAlumnos === 0) {
    estadoVacio.classList.remove("oculto");
    resultados.classList.add("oculto");
    return;
  }

  var datosAlumnos = obtenerDatosAlumnos();

  estadoVacio.classList.add("oculto");
  resultados.classList.remove("oculto");

  mostrarListadoAlumnos(datosAlumnos);
  mostrarResumenCurso(datosAlumnos);
  mostrarRanking(datosAlumnos);
}

formulario.addEventListener("submit", function (evento) {
  evento.preventDefault();

  if (cantidadAlumnos >= 10) {
    mostrarMensaje("Ya registraste a los 10 alumnos permitidos.", "error");
    return;
  }

  var nombre = nombreInput.value.trim();
  var notas = obtenerNotasFormulario();

  if (!validarDatos(nombre, notas)) {
    return;
  }

  nombresAlumnos[cantidadAlumnos] = nombre;
  notasAlumnos[cantidadAlumnos] = notas;
  cantidadAlumnos++;

  actualizarContador();
  actualizarResultados();
  mostrarMensaje("Alumno agregado correctamente.", "exito");
  limpiarFormulario();
});

botonLimpiar.addEventListener("click", function () {
  limpiarFormulario();
  mostrarMensaje("Formulario limpiado.", "exito");
});

actualizarResultados();
