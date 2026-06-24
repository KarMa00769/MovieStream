let peliculas = [];
let peliculasFiltradas = [];

document.addEventListener("DOMContentLoaded", () => {
  cargarPeliculas();

  document.getElementById("btnActualizar").addEventListener("click", cargarPeliculas);
  document.getElementById("btnBuscar").addEventListener("click", aplicarFiltros);
  document.getElementById("buscarPelicula").addEventListener("input", aplicarFiltros);
  document.getElementById("filtroGenero").addEventListener("change", aplicarFiltros);
  document.getElementById("ordenCalificacion").addEventListener("change", aplicarFiltros);
  document.getElementById("formPelicula").addEventListener("submit", guardarPelicula);
  document.getElementById("btnCancelarEdicion").addEventListener("click", limpiarFormulario);
  document.getElementById("btnLimpiarFavoritos").addEventListener("click", limpiarFavoritos);
});

async function cargarPeliculas() {
  try {
    peliculas = await obtenerPeliculasAPI();
    peliculasFiltradas = [...peliculas];

    cargarGeneros();
    renderizarPeliculas(peliculasFiltradas);
    renderizarTablaAdmin();
    renderizarFavoritos();
  } catch (error) {
    console.error(error);
    mostrarAlerta("No se pudo conectar con la API. Revisa que el backend esté activo.", "danger");
    renderizarEstadoVacio();
    renderizarFavoritos();
  }
}

function renderizarPeliculas(lista) {
  const contenedor = document.getElementById("contenedorPeliculas");
  contenedor.innerHTML = "";

  if (lista.length === 0) {
    contenedor.innerHTML = `<div class="col-12"><div class="empty-state">No se encontraron películas.</div></div>`;
    return;
  }

  lista.forEach(pelicula => {
    const poster = pelicula.poster || "https://placehold.co/500x750/141414/e50914?text=MovieStream";

    contenedor.innerHTML += `
      <div class="col-sm-6 col-md-4 col-lg-3 col-xxl-2">
        <div class="card movie-card">
          <img src="${poster}" class="movie-poster" alt="${pelicula.titulo}">
          <div class="card-body">
            <span class="badge genre-badge mb-2">${pelicula.genero}</span>
            <h5 class="card-title">${pelicula.titulo}</h5>
            <p class="text-secondary mb-1">${pelicula.anio} · ${pelicula.duracion}</p>
            <p class="rating mb-3">★ ${pelicula.calificacion}</p>

            <div class="d-grid gap-2">
              <button class="btn btn-danger btn-sm" onclick="abrirDetalle(${pelicula.id})">Ver detalle</button>
              <button class="btn btn-outline-light btn-sm" onclick="agregarFavorito(${pelicula.id})">Favorito</button>
            </div>
          </div>
        </div>
      </div>
    `;
  });
}

function cargarGeneros() {
  const select = document.getElementById("filtroGenero");
  const generos = [...new Set(peliculas.map(p => p.genero))];

  select.innerHTML = `<option value="">Todos los géneros</option>`;
  generos.forEach(genero => {
    select.innerHTML += `<option value="${genero}">${genero}</option>`;
  });
}

function aplicarFiltros() {
  const busqueda = document.getElementById("buscarPelicula").value.toLowerCase();
  const genero = document.getElementById("filtroGenero").value;
  const orden = document.getElementById("ordenCalificacion").value;

  peliculasFiltradas = peliculas.filter(pelicula => {
    const coincideBusqueda =
      pelicula.titulo.toLowerCase().includes(busqueda) ||
      pelicula.genero.toLowerCase().includes(busqueda) ||
      pelicula.director.toLowerCase().includes(busqueda);

    const coincideGenero = genero === "" || pelicula.genero === genero;

    return coincideBusqueda && coincideGenero;
  });

  if (orden === "desc") peliculasFiltradas.sort((a, b) => Number(b.calificacion) - Number(a.calificacion));
  if (orden === "asc") peliculasFiltradas.sort((a, b) => Number(a.calificacion) - Number(b.calificacion));

  renderizarPeliculas(peliculasFiltradas);
}

async function abrirDetalle(id) {
  try {
    const pelicula = await obtenerPeliculaPorIdAPI(id);
    const poster = pelicula.poster || "https://placehold.co/500x750/141414/e50914?text=MovieStream";

    document.getElementById("modalTitulo").textContent = pelicula.titulo;
    document.getElementById("modalContenido").innerHTML = `
      <div class="row g-4">
        <div class="col-md-4">
          <img src="${poster}" class="modal-poster" alt="${pelicula.titulo}">
        </div>
        <div class="col-md-8">
          <h3>${pelicula.titulo}</h3>
          <p class="rating">★ ${pelicula.calificacion}</p>
          <p><strong>Género:</strong> ${pelicula.genero}</p>
          <p><strong>Año:</strong> ${pelicula.anio}</p>
          <p><strong>Duración:</strong> ${pelicula.duracion}</p>
          <p><strong>Director:</strong> ${pelicula.director}</p>
          <p><strong>Descripción:</strong></p>
          <p class="text-secondary">${pelicula.descripcion}</p>
          <button class="btn btn-danger" onclick="agregarFavorito(${pelicula.id})">Agregar a favoritos</button>
        </div>
      </div>
    `;

    new bootstrap.Modal(document.getElementById("modalDetalle")).show();
  } catch (error) {
    mostrarAlerta("No se pudo cargar el detalle de la película.", "danger");
  }
}

async function guardarPelicula(event) {
  event.preventDefault();

  const id = document.getElementById("peliculaId").value;

  const pelicula = {
    titulo: document.getElementById("titulo").value,
    genero: document.getElementById("genero").value,
    anio: Number(document.getElementById("anio").value),
    duracion: document.getElementById("duracion").value,
    director: document.getElementById("director").value,
    calificacion: Number(document.getElementById("calificacion").value),
    descripcion: document.getElementById("descripcion").value,
    poster: document.getElementById("poster").value || "https://placehold.co/500x750/141414/e50914?text=MovieStream"
  };

  try {
    if (id) {
      await actualizarPeliculaAPI(id, pelicula);
      mostrarAlerta("Película actualizada correctamente.", "success");
    } else {
      await crearPeliculaAPI(pelicula);
      mostrarAlerta("Película registrada correctamente.", "success");
    }

    limpiarFormulario();
    cargarPeliculas();
  } catch (error) {
    mostrarAlerta("Error al guardar la película.", "danger");
  }
}

function renderizarTablaAdmin() {
  const tabla = document.getElementById("tablaPeliculas");
  tabla.innerHTML = "";

  peliculas.forEach(pelicula => {
    tabla.innerHTML += `
      <tr>
        <td>${pelicula.id}</td>
        <td>${pelicula.titulo}</td>
        <td>${pelicula.genero}</td>
        <td>${pelicula.anio}</td>
        <td>★ ${pelicula.calificacion}</td>
        <td>
          <button class="btn btn-warning btn-sm" onclick="editarPelicula(${pelicula.id})">
            <i class="bi bi-pencil"></i>
          </button>
          <button class="btn btn-danger btn-sm" onclick="eliminarPelicula(${pelicula.id})">
            <i class="bi bi-trash"></i>
          </button>
        </td>
      </tr>
    `;
  });
}

function editarPelicula(id) {
  const pelicula = peliculas.find(p => Number(p.id) === Number(id));
  if (!pelicula) return;

  document.getElementById("peliculaId").value = pelicula.id;
  document.getElementById("titulo").value = pelicula.titulo;
  document.getElementById("genero").value = pelicula.genero;
  document.getElementById("anio").value = pelicula.anio;
  document.getElementById("duracion").value = pelicula.duracion;
  document.getElementById("director").value = pelicula.director;
  document.getElementById("calificacion").value = pelicula.calificacion;
  document.getElementById("descripcion").value = pelicula.descripcion;
  document.getElementById("poster").value = pelicula.poster;

  window.location.href = "#admin";
}

async function eliminarPelicula(id) {
  if (!confirm("¿Deseas eliminar esta película?")) return;

  try {
    await eliminarPeliculaAPI(id);
    mostrarAlerta("Película eliminada correctamente.", "success");
    cargarPeliculas();
  } catch (error) {
    mostrarAlerta("Error al eliminar la película.", "danger");
  }
}

function limpiarFormulario() {
  document.getElementById("formPelicula").reset();
  document.getElementById("peliculaId").value = "";
}

function agregarFavorito(id) {
  const pelicula = peliculas.find(p => Number(p.id) === Number(id));
  if (!pelicula) return;

  let favoritos = JSON.parse(localStorage.getItem("peliculasFavoritas")) || [];
  const existe = favoritos.some(p => Number(p.id) === Number(id));

  if (!existe) {
    favoritos.push(pelicula);
    localStorage.setItem("peliculasFavoritas", JSON.stringify(favoritos));
    mostrarAlerta("Película agregada a favoritos.", "success");
  } else {
    mostrarAlerta("La película ya está en favoritos.", "warning");
  }

  renderizarFavoritos();
}

function renderizarFavoritos() {
  const contenedor = document.getElementById("contenedorFavoritos");
  const favoritos = JSON.parse(localStorage.getItem("peliculasFavoritas")) || [];

  contenedor.innerHTML = "";

  if (favoritos.length === 0) {
    contenedor.innerHTML = `<div class="col-12"><div class="empty-state">No hay películas favoritas.</div></div>`;
    return;
  }

  favoritos.forEach(pelicula => {
    const poster = pelicula.poster || "https://placehold.co/500x750/141414/e50914?text=MovieStream";

    contenedor.innerHTML += `
      <div class="col-sm-6 col-md-4 col-lg-3 col-xxl-2">
        <div class="card movie-card">
          <img src="${poster}" class="movie-poster" alt="${pelicula.titulo}">
          <div class="card-body">
            <h5>${pelicula.titulo}</h5>
            <p class="text-secondary">${pelicula.genero}</p>
            <button class="btn btn-outline-danger btn-sm w-100" onclick="quitarFavorito(${pelicula.id})">Quitar</button>
          </div>
        </div>
      </div>
    `;
  });
}

function quitarFavorito(id) {
  let favoritos = JSON.parse(localStorage.getItem("peliculasFavoritas")) || [];
  favoritos = favoritos.filter(p => Number(p.id) !== Number(id));
  localStorage.setItem("peliculasFavoritas", JSON.stringify(favoritos));
  renderizarFavoritos();
}

function limpiarFavoritos() {
  localStorage.removeItem("peliculasFavoritas");
  renderizarFavoritos();
}

function renderizarEstadoVacio() {
  document.getElementById("contenedorPeliculas").innerHTML =
    `<div class="col-12"><div class="empty-state">Conecta el backend en <strong>http://localhost:3000/api/peliculas</strong> para visualizar el catálogo.</div></div>`;
  document.getElementById("tablaPeliculas").innerHTML = "";
}

function mostrarAlerta(mensaje, tipo) {
  const alerta = document.createElement("div");
  alerta.className = `alert alert-${tipo} alert-dismissible fade show position-fixed top-0 end-0 m-3`;
  alerta.style.zIndex = "9999";
  alerta.innerHTML = `${mensaje}<button type="button" class="btn-close" data-bs-dismiss="alert"></button>`;
  document.body.appendChild(alerta);
  setTimeout(() => alerta.remove(), 3500);
}
