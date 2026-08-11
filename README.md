# Brújula

Aplicación web privada y móvil para preparar viajes, consultar lugares sobre el mapa y conservar pequeños estados personales como favoritos, visitados y lugares ocultos.

## Estado actual

La Fase 1 contiene:

- React, TypeScript y Vite.
- Arquitectura inicial separada por funcionalidades.
- Diseño responsive con mapa como pantalla principal.
- Navegación Mapa, Lugares, Favoritos y Viajes.
- Selector de viaje y estados visuales interactivos de demostración.
- Manifest, service worker y caché de la interfaz para PWA.
- Aviso de conexión offline.

El mapa mostrado en esta fase es una maqueta visual. MapLibre, Stadia Maps, los datos reales y la persistencia se incorporan en las siguientes fases.

## Desarrollo local

```bash
pnpm install
pnpm dev
```

Comprobaciones antes de guardar cambios:

```bash
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
  data/            categorías e información de viajes (Fase 2)
  features/        mapa, lugares, viajes, favoritos y PWA
  hooks/           lógica reutilizable de React
  services/        adaptadores de Stadia, geolocalización y Supabase
  styles/          tokens visuales y estilos globales
  types/           contratos TypeScript compartidos
docs/
  DATA_MODEL.md
  CONTENT_WORKFLOW.md
  SETUP.md
```

El contenido vivirá en JSON versionado. Stadia y Supabase se conectarán mediante adaptadores para que ninguna API externa quede acoplada a los componentes.

## Privacidad y credenciales

- GitHub Pages sirve una web pública: no debe considerarse un control de acceso.
- Ningún secreto debe guardarse en el repositorio ni en archivos JSON.
- Las credenciales visibles en el navegador solo pueden ser claves públicas restringidas por dominio.
- Supabase no se activará sin revisar antes autenticación y políticas RLS.

## Documentación

- [Modelo de datos](docs/DATA_MODEL.md)
- [Flujo de contenido](docs/CONTENT_WORKFLOW.md)
- [Configuración](docs/SETUP.md)
