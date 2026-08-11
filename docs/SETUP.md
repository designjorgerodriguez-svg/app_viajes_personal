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

## Variables de entorno previstas

Stadia no necesita una variable en el navegador. Supabase solo se configurará si se activa la sincronización privada:

```dotenv
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Todo valor con prefijo `VITE_` es visible para quien abra la web. La clave pública de Supabase dependerá de políticas RLS seguras.

## Supabase

Se añadirá después de completar los estados locales. Antes de crear tablas o políticas se explicará el riesgo de permitir escrituras sin autenticación. No se aplicarán políticas públicas permisivas sin confirmación expresa.

## GitHub Pages

Se configurará cuando la aplicación local sea estable. El despliegue necesitará un `base` adecuado al nombre del repositorio y una acción de GitHub. GitHub Pages publica archivos accesibles por URL y no debe tratarse como una barrera de privacidad.

## Probar la PWA

El service worker se valida con una compilación de producción:

```bash
pnpm build
pnpm preview
```

La PWA conserva la interfaz y los datos ya descargados, pero no promete mapas ni rutas completas sin conexión.
