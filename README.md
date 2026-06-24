# MovieStream

Una aplicación web tipo streaming (Crunchyroll/Netflix style) construida con **React (Vite)** y **Django**, encapsulada completamente en **Docker**.

## Requisitos Previos

Para ejecutar este proyecto en cualquier computadora, solo necesitas tener instalado:
- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- Opcional: Git (para clonar el repositorio)

No necesitas tener instalados ni Node.js, ni Python, ni una base de datos localmente. Docker se encarga de todo.

## Pasos para ejecutar por primera vez

1. **Clonar el repositorio y entrar a la carpeta:**
   ```bash
   git clone <URL_DE_TU_REPOSITORIO>
   cd MovieStream_Frontend_Bootstrap
   ```

2. **Configurar las variables de entorno:**
   - Entra a la carpeta `frontend/`
   - Haz una copia del archivo `.env.example` y renómbralo a `.env`
   - Edita el archivo `.env` y coloca tu API Key real de OMDb.
   ```env
   VITE_OMDB_API_KEY=tu_api_key_aqui
   ```

3. **Levantar los contenedores con Docker:**
   Regresa a la raíz del proyecto y ejecuta:
   ```bash
   docker-compose up --build
   ```
   *Nota: La primera vez tomará algunos minutos mientras descarga las imágenes de Node y Python, y compila las dependencias.*

4. **Preparar la Base de Datos (Migraciones):**
   Abre una nueva pestaña en tu terminal (sin detener el proceso anterior) y ejecuta este comando para crear las tablas en la base de datos de Django:
   ```bash
   docker compose exec backend python manage.py migrate
   ```

¡Listo! Ya puedes abrir tu navegador y entrar a **[http://localhost:5173](http://localhost:5173)** para ver la aplicación funcionando.

## Notas Adicionales
- Los videos que se suben a la plataforma no se suben al repositorio. Cada PC iniciará con una base de datos y carpeta de medios limpios.
- La información de "Favoritos" y "Panel de Administración" se guarda temporalmente en el `localStorage` del navegador local de cada computadora.
