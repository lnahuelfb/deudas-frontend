# DeudApp - Frontend 💳✨

Aplicación web moderna y dinámica para la gestión inteligente de finanzas personales, suscripciones y tarjetas de crédito. Diseñada con una estética oscura premium, animaciones fluidas e interfaz de usuario altamente optimizada.

## 🚀 Tecnologías Principales

- **Framework:** React 18 + Vite
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS
- **Estado y Caché:** React Query (@tanstack/react-query)
- **Formularios:** React Hook Form + Zod (Validaciones estrictas)
- **Enrutamiento:** React Router DOM
- **Notificaciones:** Sonner
- **Iconos:** Heroicons
- **Analíticas:** Vercel Web Analytics

## ✨ Características Clave

- **Optimistic UI Updates:** Respuestas instantáneas en la interfaz al realizar eliminaciones y mutaciones (Zero-Lag UX).
- **Validación Robusta (Zod):** Formularios a prueba de errores con coerción inteligente de tipos de datos.
- **Componentes Custom:** Elementos nativos reemplazados con alternativas altamente estilizadas y performantes (ej. Menús Desplegables de Categorías que respetan el `overflow` sin degradar el rendimiento).
- **Sesiones Seguras Cross-Domain:** Soporte completo para autenticación vía Cookies seguras `SameSite: None` entre dominios distintos.
- **SPA Routing Optimizado:** Configuración específica (`vercel.json`) para soporte nativo de React Router en Vercel.

## 🛠️ Instalación y Uso Local

1. Asegúrate de tener **Node.js** instalado.
2. Clona el repositorio y navega a esta carpeta.
3. Instala las dependencias:
   ```bash
   npm install
   ```
4. Crea un archivo `.env` en la raíz basado en tu configuración local:
   ```env
   VITE_API_URL=http://localhost:3000/api
   ```
5. Levanta el servidor de desarrollo:
   ```bash
   npm run dev
   ```

## 📦 Despliegue en Producción (Vercel)

El proyecto está optimizado para ser desplegado en Vercel sin configuraciones extrañas.
Asegúrate de configurar la variable de entorno en Vercel:
- `VITE_API_URL`: La URL base de tu API en producción (ej. `https://tu-api.vercel.app/api`)

*Nota: Vercel Web Analytics ya se encuentra pre-configurado en el archivo `main.tsx`.*
