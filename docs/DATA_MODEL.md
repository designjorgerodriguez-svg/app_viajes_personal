# Modelo de datos

La fuente principal de contenido será un conjunto de JSON versionados. Los componentes React nunca contendrán información factual de los viajes.

## Estructura prevista

```text
src/data/
  categories.json
  trips/
    index.json
    pais-vasco-frances.json
    noruega.json
```

## Categorías

`categories.json` será una lista ordenada. `id` es el valor estable que utilizan los lugares; `label` se puede modificar sin migrar lugares.

```json
[
  {
    "id": "beach",
    "label": "Playa",
    "icon": "Waves",
    "color": "#1589A6",
    "group": "water"
  }
]
```

Campos:

- `id`: identificador único en kebab-case.
- `label`: nombre visible en español.
- `icon`: nombre exacto de un icono admitido por el registro Lucide de la aplicación.
- `color`: color hexadecimal con contraste suficiente.
- `group`: agrupación visual; inicialmente `urban`, `nature`, `water` o `heritage`.

## Índice de viajes

`src/data/trips/index.json` contiene únicamente la información necesaria para listar y seleccionar viajes.

```json
[
  {
    "id": "pais-vasco-frances",
    "file": "pais-vasco-frances.json",
    "name": "País Vasco Francés",
    "periodLabel": "Agosto 2026",
    "startDate": "2026-08-01",
    "endDate": "2026-08-31",
    "status": "upcoming"
  }
]
```

`status` admite `upcoming`, `active` y `past`. Las fechas usan `AAAA-MM-DD` y pueden ser `null` cuando todavía no se conocen.

## Archivo de viaje

Cada viaje contiene su ID y sus lugares.

```json
{
  "id": "pais-vasco-frances",
  "places": [
    {
      "id": "fr-pvf-biarritz-rocher-vierge",
      "tripId": "pais-vasco-frances",
      "name": "Rocher de la Vierge",
      "categoryId": "monument",
      "latitude": 43.483,
      "longitude": -1.566,
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
  ]
}
```

Los valores del ejemplo muestran el formato, no constituyen todavía datos verificados del viaje demo.

### Campos de lugar

- `id`: único y permanente en todo el repositorio. Formato recomendado: `país-viaje-localidad-lugar`.
- `tripId`: debe coincidir con el ID del archivo de viaje.
- `name`: nombre oficial o común verificado.
- `categoryId`: ID existente en `categories.json`.
- `latitude`, `longitude`: números; nunca texto. Deben provenir de una fuente fiable.
- `imageUrl`, `imageSourceUrl`, `imageAttribution`, `alt`: pueden ser cadenas vacías. Si existe imagen, los cuatro deben completarse. `imageAttribution` conserva autoría y licencia en formato breve.
- `description`: resumen factual breve; puede estar vacío.
- `tips`: lista de consejos verificados. Usar `[]` si no hay consejos.
- `price`: `null` si es gratuito, desconocido o no procede. Para pago usar `{"label":"...","amount":0,"currency":"EUR"}`; `amount` puede omitirse si solo existe un texto oficial.
- `dogAccess`: `allowed`, `conditional`, `not-allowed` o `unknown`.
- `dogNotes`: condiciones o explicación; cadena vacía si no existen.
- `officialSourceUrl`: fuente oficial principal; cadena vacía si no se localiza.
- `googleMapsUrl`: enlace externo al lugar; cadena vacía si no está verificado.
- `additionalInfo`: lista opcional de pares `{"label":"...","value":"..."}`.

Los campos vacíos nunca deben romper la interfaz ni mostrar bloques sin contenido.

## Estado personal

El contenido JSON es inmutable durante el uso. Los estados se almacenan por `placeId` aparte:

```json
{
  "fr-pvf-biarritz-rocher-vierge": {
    "favorite": true,
    "visited": false,
    "deleted": false,
    "updatedAt": "2026-08-11T10:00:00.000Z"
  }
}
```

Primero se utilizará almacenamiento local. La futura tabla de Supabase mantendrá el mismo contrato y añadirá el identificador del espacio compartido o usuario cuando exista autenticación.
