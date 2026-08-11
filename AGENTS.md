# AGENTS.md

## Propósito

Este repositorio contiene **Brújula**, una PWA privada de viajes. El usuario no es desarrollador y espera que los agentes realicen directamente las tareas técnicas, expliquen solo las acciones externas necesarias y se detengan cuando necesiten una confirmación o un dato suyo.

## Antes de cambiar contenido

1. Leer `docs/DATA_MODEL.md`.
2. Leer `docs/CONTENT_WORKFLOW.md`.
3. Conservar los ID existentes; nunca regenerarlos ni reutilizarlos.
4. No inventar horarios, precios, normas sobre perros, coordenadas, descripciones ni URLs.
5. Si un dato no se puede verificar, dejar su campo vacío o usar el estado `unknown` previsto por el esquema.

## Reglas del producto

- El contenido fuente se modifica en `src/data/`; no se crean editores dentro de la aplicación.
- Los únicos estados editables por el usuario son favorito, visitado y eliminado lógico.
- Un eliminado lógico nunca borra el lugar del JSON.
- La búsqueda de lugares es local. Google Maps solo se abre externamente.
- No añadir IA al producto ni generar imágenes de lugares mediante IA.
- No usar Google Maps como mapa interno.
- Mantener MapLibre/Stadia y Supabase detrás de adaptadores en `src/services/`.
- No exponer secretos. Toda variable `VITE_*` termina en el navegador y debe considerarse pública.

## Código y diseño

- Priorizar móvil, accesibilidad, rendimiento y dependencias pequeñas.
- Usar Lucide para iconos de interfaz; no usar emojis como iconos.
- Mantener los componentes breves y separar estado, servicios y presentación.
- Reutilizar los tokens de `src/styles/tokens.css`; no dispersar colores o constantes de marca.
- Respetar safe areas y un tamaño táctil mínimo aproximado de 44 px.
- No romper mapa, filtros, búsqueda o viewport al cambiar de navegación.

## Validación

Después de cambios de código ejecutar:

```bash
pnpm typecheck
pnpm lint
pnpm build
```

Después de cambios de datos, validar también que el JSON sea correcto y que cada `place.id` sea único en todo el repositorio.

## Git

- No mezclar cambios ajenos.
- Crear commits pequeños por fase o funcionalidad estable.
- No publicar, crear repositorios remotos ni configurar servicios externos sin confirmación del usuario.
