# Flujo sencillo para modificar contenido

Este documento es la guía principal para Codex y otros agentes. Antes de editar datos, leer también `DATA_MODEL.md`.

## Regla esencial

No inventar información. Si coordenadas, precio, normas sobre perros, URLs o cualquier otro dato no se pueden verificar, dejar el campo vacío, usar `null`, `[]` o `dogAccess: "unknown"` según corresponda.

## Añadir un nuevo viaje

1. Crear `src/data/trips/<id-del-viaje>.json` con `id` y `places`.
2. Añadir una entrada con el mismo `id` a `src/data/trips/index.json`.
3. Usar un nombre de archivo e ID en minúsculas y kebab-case.
4. Comprobar que `file` coincide exactamente con el nombre creado.
5. Validar y compilar el proyecto.

Ejemplo mínimo:

```json
{
  "id": "noruega",
  "places": []
}
```

## Añadir una categoría

1. Abrir `src/data/categories.json`.
2. Añadir un objeto con `id`, `label`, `icon`, `color` y `group`.
3. Verificar que el `id` no existe y que `icon` está admitido por el registro Lucide.
4. Usar ese `id` en `categoryId` de los lugares.

No cambiar el `id` de una categoría ya utilizada. Para cambiar el texto visible, modificar solo `label`.

## Añadir un lugar

1. Localizar el viaje en `src/data/trips/index.json` y abrir su archivo.
2. Investigar el lugar en fuentes fiables y preferir la fuente oficial.
3. Crear un ID permanente, descriptivo y único.
4. Copiar un lugar existente como plantilla y sustituir todos sus valores.
5. Mantener todos los campos del esquema aunque estén vacíos.
6. Añadir el objeto a `places` sin reordenar innecesariamente el resto del archivo.
7. Comprobar coordenadas, categoría, URLs y unicidad del ID.

Plantilla segura:

```json
{
  "id": "",
  "tripId": "",
  "name": "",
  "categoryId": "",
  "latitude": 0,
  "longitude": 0,
  "imageUrl": "",
  "imageSourceUrl": "",
  "imageAttribution": "",
  "alt": "",
  "description": "",
  "tips": [],
  "price": null,
  "dogAccess": "unknown",
  "dogNotes": "",
  "officialSourceUrl": "",
  "googleMapsUrl": "",
  "additionalInfo": []
}
```

No dejar `latitude` o `longitude` en `0` al guardar un lugar real. Si no se pueden verificar, no añadir todavía ese lugar o dejar la incorporación pendiente para revisión.

## Añadir veinte lugares de golpe

1. Confirmar el viaje destino y abrir un único archivo de viaje.
2. Preparar primero una lista de candidatos y fuentes.
3. Investigar cada lugar; no completar campos por semejanza con otro.
4. Generar los objetos con exactamente el mismo orden de campos.
5. Comprobar automáticamente que no hay ID duplicados, coordenadas fuera de rango ni categorías inexistentes.
6. Revisar manualmente una muestra y todos los campos sobre perros, precio y fuentes.
7. Compilar una vez al terminar el lote.

Si alguna fila es dudosa, excluirla del lote e informar de ella; nunca rellenarla por intuición.

## Actualizar un lugar

1. Buscar por `id`, no solo por nombre.
2. Modificar únicamente los campos solicitados o que hayan quedado obsoletos.
3. Conservar `id` y `tripId`.
4. Mantener la fuente oficial asociada a la información actualizada.
5. No sobrescribir datos correctos con campos vacíos.

## Recuperar un lugar eliminado

El lugar sigue en su JSON. La aplicación solo guarda un estado `deleted` aparte.

- En desarrollo local: buscar el estado por `placeId` y cambiar `deleted` a `false`, o borrar solo la entrada de estado de ese lugar.
- Con Supabase en el futuro: actualizar únicamente la fila de estado correspondiente; no modificar el JSON del viaje.

Nunca volver a crear el lugar con un ID nuevo para recuperarlo.

## Imágenes

- No generar imágenes de lugares mediante IA.
- Usar una imagen que permita su uso directo y conservar la página fuente en `imageSourceUrl`.
- No usar la URL de una página web como `imageUrl`; debe apuntar al recurso de imagen.
- Escribir un `alt` descriptivo y breve.
- Guardar autoría y licencia en `imageAttribution`.
- Si no hay una imagen apropiada, dejar los cuatro campos de imagen vacíos.

## Comprobación final

- JSON válido.
- ID único.
- `tripId` correcto.
- `categoryId` existente.
- Coordenadas verificadas y dentro de rango.
- Campos desconocidos vacíos, `null`, `[]` o `unknown`.
- Ninguna clave privada ni dato sensible.
- La aplicación compila.
