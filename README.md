# MovieStream

Aplicaci&oacute;n web tipo streaming (Crunchyroll/Netflix style) construida con **React (Vite)** y **Django**, encapsulada en **Docker**.

## Requisitos Previos

- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- Opcional: Git (para clonar el repositorio)

No necesitas Node.js, Python, ni base de datos instalados localmente. Docker se encarga de todo.

## Primeros pasos

1. **Clonar el repositorio:**
   ```bash
   git clone <URL_DE_TU_REPOSITORIO>
   cd MovieStream_Frontend_Bootstrap
   ```

2. **Configurar variables de entorno:**
   ```bash
   cp frontend/.env.example frontend/.env
   cp backend/.env.example backend/.env
   ```
   Edita `frontend/.env` y asigna tu API key de OMDb:
   ```env
   VITE_OMDB_API_KEY=tu_api_key_aqui
   ```

3. **Levantar los contenedores:**
   ```bash
   docker compose up --build
   ```
   La primera vez descarga im&aacute;genes de Node y Python, y compila dependencias.

4. **Abrir la aplicaci&oacute;n:**
   Abre **[http://localhost:5173](http://localhost:5173)** en tu navegador.

## Notas

- Los videos subidos no se persisten en el repositorio (est&aacute;n en `.gitignore`).
- Favoritos y Panel de Administraci&oacute;n usan `localStorage` del navegador.
- El backend tiene configuraciones de desarrollo por defecto. Para producci&oacute;n, cambia `DJANGO_DEBUG=False` y `DJANGO_SECRET_KEY` en `backend/.env`.
- La carpeta `legacy/` contiene una versi&oacute;n anterior en HTML/CSS/JS puro — no es parte del stack React actual.
