# Brújula

Aplicación web privada y móvil para preparar viajes, consultar lugares sobre el mapa y conservar estados personales como favoritos, visitados y lugares ocultos.

## Estado actual

La aplicación contiene:

- React, TypeScript y Vite.
- Diseño responsive con MapLibre como pantalla principal.
- Navegación Mapa, Lugares, Favoritos y Viajes.
- Mapas Stadia Outdoors y satélite, zoom, pantalla completa y geolocalización.
- Búsqueda local, filtros por categoría, marcadores accesibles y fichas detalladas.
- Favoritos, visitados y borrado lógico persistentes en el dispositivo.
- Rutas en coche desde la ubicación actual y enlace externo a Google Maps.
- Un primer viaje con nueve lugares contrastados en fuentes oficiales.
- Manifest, service worker y caché de la interfaz para PWA.
- Aviso de conexión offline.

## Desarrollo local

```bash
pnpm install
pnpm dev
```

Comprobaciones antes de guardar cambios:

```bash
pnpm validate:data
pnpm typecheck
pnpm lint
pnpm build
```

Consulta [docs/SETUP.md](docs/SETUP.md) para la puesta en marcha y [docs/CONTENT_WORKFLOW.md](docs/CONTENT_WORKFLOW.md) antes de modificar viajes o lugares.

## Arquitectura

```text
src/
  app/             entrada y estado global
  components/      piezas de interfaz reutilizables
  data/            categorías e información verificada de viajes
  features/        mapa, lugares, viajes, favoritos y filtros
  hooks/           lógica reutilizable de React
  services/        adaptadores de Stadia, persistencia y futura sincronización
  styles/          tokens visuales y estilos globales
  types/           contratos TypeScript compartidos
docs/
  DATA_MODEL.md
  CONTENT_WORKFLOW.md
  SETUP.md
```

El contenido vive en JSON versionado. Stadia está aislado mediante adaptadores; Supabase se añadirá del mismo modo si se activa la sincronización privada.

## Privacidad y credenciales

- GitHub Pages sirve una web pública: no debe considerarse un control de acceso.
- Ningún secreto debe guardarse en el repositorio ni en archivos JSON.
- Las credenciales visibles en el navegador solo pueden ser claves públicas restringidas por dominio.
- Supabase no se activará sin revisar antes autenticación y políticas RLS.

## Documentación

- [Modelo de datos](docs/DATA_MODEL.md)
- [Flujo de contenido](docs/CONTENT_WORKFLOW.md)
- [Configuración](docs/SETUP.md)
