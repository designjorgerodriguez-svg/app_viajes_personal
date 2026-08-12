import { readFile, writeFile } from 'node:fs/promises'

const path = new URL('../src/data/trips/pais-vasco-frances.json', import.meta.url)
const trip = JSON.parse(await readFile(path, 'utf8'))

const place = {
  id: 'es-navarra-selva-irati',
  tripId: 'pais-vasco-frances',
  name: 'Selva de Irati',
  locality: 'Ochagavía / Orbaizeta, Navarra',
  categoryId: 'nature',
  latitude: 42.9884466,
  longitude: -1.1055351,
  imageUrl: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/In%20the%20magical%20forest.jpg?width=1600',
  imageSourceUrl: 'https://commons.wikimedia.org/wiki/File:In_the_magical_forest.jpg',
  imageAttribution: 'JavierOlivares · CC BY-SA 4.0',
  alt: 'Hayedo-abetal frondoso de la Selva de Irati en Navarra',
  description: 'Gran hayedo-abetal del Pirineo navarro entre los valles de Aezkoa y Salazar, con senderos señalizados, ríos y el embalse de Irabia. El punto está situado en Casas de Irati, uno de los accesos principales y más prácticos para empezar a caminar.',
  tips: [
    'En temporada alta conviene llegar pronto: el acceso por Casas de Irati puede regularse por aforo y se cobra una tasa de mantenimiento.',
    'Desde Casas de Irati salen rutas sencillas y muy representativas, como la senda del río Urbeltza, el Bosque de Zabaleta y recorridos hacia el embalse de Irabia.'
  ],
  price: {
    label: 'Acceso al bosque gratuito · en temporada alta se cobra una tasa de mantenimiento en los accesos de Casas de Irati y Arrazola; consulta el importe vigente antes de ir'
  },
  dogAccess: 'unknown',
  dogNotes: 'No he localizado una norma general oficial y actual sobre perros en la información de Visit Navarra. Llévalo con correa y controlado, especialmente por fauna y ganado, y respeta la señalización específica de cada sendero.',
  officialSourceUrl: 'https://www.visitnavarra.es/es/selva-de-irati/',
  googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=42.9884466%2C-1.1055351',
  additionalInfo: [
    {
      label: 'Acceso recomendado',
      value: 'Casas de Irati · Virgen de las Nieves (desde Ochagavía)'
    },
    {
      label: 'Interés',
      value: 'Hayedo-abetal · senderismo · ríos · embalse de Irabia · paisaje'
    },
    {
      label: 'Tiempo orientativo',
      value: '3 h – día completo'
    }
  ]
}

const existingIndex = trip.places.findIndex((item) => item.id === place.id)
if (existingIndex >= 0) trip.places[existingIndex] = place
else trip.places.push(place)

await writeFile(path, `${JSON.stringify(trip, null, 2)}\n`, 'utf8')
