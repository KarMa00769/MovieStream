/*
Los alumnos deben construir el backend con estos endpoints:

GET    /api/peliculas
GET    /api/peliculas/:id
POST   /api/peliculas
PUT    /api/peliculas/:id
DELETE /api/peliculas/:id

URL por defecto:
http://localhost:3000/api/peliculas

Formato esperado:
{
  id: 1,
  titulo: "Interstellar",
  genero: "Ciencia ficción",
  anio: 2014,
  duracion: "169 min",
  director: "Christopher Nolan",
  calificacion: 8.7,
  descripcion: "Descripción de la película",
  poster: "https://..."
}
*/

const API_URL = "http://localhost:3000/api/peliculas";

async function obtenerPeliculasAPI() {
  const respuesta = await fetch(API_URL);
  if (!respuesta.ok) throw new Error("Error al obtener películas");
  return await respuesta.json();
}

async function obtenerPeliculaPorIdAPI(id) {
  const respuesta = await fetch(`${API_URL}/${id}`);
  if (!respuesta.ok) throw new Error("Error al obtener película");
  return await respuesta.json();
}

async function crearPeliculaAPI(pelicula) {
  const respuesta = await fetch(API_URL, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(pelicula)
  });
  if (!respuesta.ok) throw new Error("Error al crear película");
  return await respuesta.json();
}

async function actualizarPeliculaAPI(id, pelicula) {
  const respuesta = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(pelicula)
  });
  if (!respuesta.ok) throw new Error("Error al actualizar película");
  return await respuesta.json();
}

async function eliminarPeliculaAPI(id) {
  const respuesta = await fetch(`${API_URL}/${id}`, {
    method: "DELETE"
  });
  if (!respuesta.ok) throw new Error("Error al eliminar película");
  return true;
}
