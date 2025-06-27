const form = document.getElementById("formulario");
const tabla = document.getElementById("tabla");
const alerta = document.getElementById("alerta");
const fondoConsola = document.getElementById("fondoConsola");
const plataformaSelect = document.getElementById("plataforma");

plataformaSelect.addEventListener("change", () => {
  const plataforma = plataformaSelect.value;
  let fondoRuta = "";

  switch (plataforma) {
    case "NES":
      fondoRuta = "img/Nes.jpg";
      break;
    case "SNES":
      fondoRuta = "img/Snes.jpg";
      break;
    case "PlayStation":
      fondoRuta = "img/PlayStation.jpg";
      break;
    case "Game Boy":
      fondoRuta = "img/GameBoy.jpg";
      break;
    case "PC":
      fondoRuta = "img/PcGamer.jpg";
      break;
    default:
      fondoRuta = "img/FondoArcade.jpg";
  }

  fondoConsola.style.backgroundImage = fondoRuta ? `url('${fondoRuta}')` : "none";
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const juego = obtenerDatos();

  if (!juego.titulo || !juego.plataforma || !juego.genero || !juego.fecha) {
    alert("⚠️ Por favor completa todos los campos obligatorios.");
    return;
  }

  const juegos = JSON.parse(localStorage.getItem("juegos")) || [];
  const index = juegos.findIndex(j => j.id === juego.id);

  if (index >= 0) {
    juegos[index] = juego;
  } else {
    juegos.push(juego);
  }

  localStorage.setItem("juegos", JSON.stringify(juegos));
  form.reset();
  mostrarAlerta();
  renderTabla();
  fondoConsola.style.backgroundImage = "none"; 
});

function obtenerDatos() {
  return {
    id: document.getElementById("id").value || Date.now().toString(),
    titulo: document.getElementById("titulo").value.trim(),
    plataforma: document.getElementById("plataforma").value,
    genero: document.querySelector('input[name="genero"]:checked')?.value || "",
    fecha: document.getElementById("fecha").value,
    completado: document.getElementById("completado").checked
  };
}

function mostrarAlerta() {
  alerta.classList.remove("d-none");
  setTimeout(() => alerta.classList.add("d-none"), 2000);
}

function renderTabla() {
  const juegos = JSON.parse(localStorage.getItem("juegos")) || [];
  if (!Array.isArray(juegos)) return;

  tabla.innerHTML = juegos.map(j => `
    <tr>
      <td>${j.titulo}</td>
      <td>${j.plataforma}</td>
      <td>${j.genero}</td>
      <td>${j.fecha}</td>
      <td>${j.completado ? "✔️" : "⏳"}</td>
      <td>
        <button onclick="editar('${j.id}')" class="btn btn-sm btn-warning">Editar</button>
        <button onclick="eliminar('${j.id}')" class="btn btn-sm btn-danger ms-1">Eliminar</button>
      </td>
    </tr>
  `).join("");
}

function editar(id) {
  const juegos = JSON.parse(localStorage.getItem("juegos")) || [];
  const juego = juegos.find(j => j.id === id);
  if (!juego) return;

  document.getElementById("id").value = juego.id;
  document.getElementById("titulo").value = juego.titulo;
  document.getElementById("plataforma").value = juego.plataforma;
  document.querySelector(`input[name="genero"][value="${juego.genero}"]`)?.click();
  document.getElementById("fecha").value = juego.fecha;
  document.getElementById("completado").checked = juego.completado;

  plataformaSelect.dispatchEvent(new Event("change")); 
}

function eliminar(id) {
  let juegos = JSON.parse(localStorage.getItem("juegos")) || [];
  juegos = juegos.filter(j => j.id !== id);
  localStorage.setItem("juegos", JSON.stringify(juegos));
  renderTabla();
}
document.addEventListener("DOMContentLoaded", renderTabla);

fondoConsola.style.backgroundImage = "url('https://img.freepik.com/vector-gratis/fondo-rejilla-neon_53876-91657.jpg?semt=ais_hybrid&w=740')";
