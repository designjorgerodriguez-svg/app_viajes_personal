# Configuración del proyecto

## Desarrollo local

No se necesita ninguna cuenta externa ni clave API.

Requisitos:

- Node.js compatible con la versión indicada por Vite.
- pnpm.
- Git.

Instalación y arranque:

```bash
pnpm install
pnpm dev
```

El terminal mostrará una dirección local. Ábrela en el navegador para usar la aplicación. En Codex Desktop se puede emplear el runtime de Node incluido aunque Node no esté instalado globalmente.

## Stadia Maps

El mapa y las rutas funcionan en `localhost` y `127.0.0.1` sin cuenta ni clave. La aplicación usa autenticación por dominio en el navegador, de modo que no incluye secretos de Stadia.

Al publicar la aplicación habrá que realizar estas acciones externas:

1. Crear o abrir una cuenta de Stadia Maps.
2. Añadir el dominio exacto de la web publicada en **Property Management**.
3. Comprobar el mapa y una ruta desde ese dominio.

Documentación oficial: [autenticación](https://docs.stadiamaps.com/authentication/), [estilo Outdoors](https://docs.stadiamaps.com/map-styles/outdoors/) y [rutas](https://docs.stadiamaps.com/routing/standard-routing/).

## Open-Meteo

La previsión de cinco días se consulta directamente desde el navegador mediante la API pública de Open-Meteo. La petición utiliza únicamente las coordenadas públicas del lugar; no envía la ubicación del usuario ni necesita una clave API. Las respuestas se conservan 30 minutos en memoria para evitar consultas repetidas durante la misma sesión.

La modalidad gratuita está destinada a uso no comercial y requiere atribución. El proveedor y sus condiciones quedan identificados en esta documentación pública del proyecto. Documentación oficial: [API de previsión de Open-Meteo](https://open-meteo.com/en/docs) y [condiciones de uso](https://open-meteo.com/en/terms).

Cada día de la tarjeta abre externamente la previsión semanal de Meteoblue mediante las mismas coordenadas GPS. Meteoblue se utiliza únicamente como enlace de consulta ampliada; los datos resumidos de la tarjeta proceden de Open-Meteo.

## Variables de entorno previstas

Stadia no necesita una variable en el navegador. Supabase solo se configurará si se activa la sincronización privada:

```dotenv
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Todo valor con prefijo `VITE_` es visible para quien abra la web. La clave pública de Supabase dependerá de políticas RLS seguras.

## Supabase

Se añadirá después de completar los estados locales. Antes de crear tablas o políticas se explicará el riesgo de permitir escrituras sin autenticación. No se aplicarán políticas públicas permisivas sin confirmación expresa.

## Publicación actual

La aplicación se publica con OpenAI Sites en `brujula-viajes-personal.designjorgerodriguez.chatgpt.site`. GitHub conserva el contenido fuente, pero un cambio en `main` no actualiza por sí solo la versión de Sites. La aplicación no utiliza GitHub Pages actualmente.

Si en el futuro se migra a un alojamiento conectado directamente a GitHub, habrá que configurar su acción de despliegue, ajustar `base` si el sitio vive en una subruta y autorizar el nuevo dominio en Stadia Maps.

## Probar la PWA

El service worker se valida con una compilación de producción:

```bash
pnpm build
pnpm preview
```

La PWA conserva la interfaz y los datos ya descargados, pero no promete mapas ni rutas completas sin conexión.
