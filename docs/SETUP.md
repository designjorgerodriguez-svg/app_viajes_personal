# Configuración del proyecto

## Fase 1: desarrollo local

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

El terminal mostrará una dirección local. Abrirla en el navegador para usar la aplicación. En Codex Desktop se puede emplear el runtime de Node incluido aunque Node no esté instalado globalmente.

## Variables de entorno previstas

Las integraciones se añadirán más adelante. Cuando existan, el repositorio incluirá `.env.example` sin valores secretos y el archivo local `.env.local` quedará ignorado por Git.

```dotenv
VITE_STADIA_API_KEY=
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Todo valor con prefijo `VITE_` es visible para quien abra la web. La clave de Stadia deberá restringirse por dominio y la clave pública de Supabase dependerá de políticas RLS seguras.

## Stadia Maps

Se configurará en la fase de mapas/routing. En ese momento se comprobará la documentación oficial vigente y se guiará una sola acción externa cada vez: crear o abrir la cuenta, restringir el dominio, copiar la clave y guardarla localmente.

## Supabase

Se añadirá después de completar los estados locales. Antes de crear tablas o políticas se explicará el riesgo de permitir escrituras sin autenticación. No se aplicarán políticas públicas permisivas sin confirmación expresa.

## GitHub Pages

Se configurará al final, cuando la aplicación local sea estable. El despliegue necesitará un `base` adecuado al nombre del repositorio y una acción de GitHub. GitHub Pages publica archivos accesibles por URL y no debe tratarse como una barrera de privacidad.

## Probar la PWA

El service worker se valida con una compilación de producción:

```bash
pnpm build
pnpm preview
```

La instalación en iPhone, Android y escritorio se comprobará en la fase final. La PWA conservará la interfaz y los datos ya descargados, pero no prometerá mapas ni rutas completas sin conexión.
