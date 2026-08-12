import { readFile, writeFile } from 'node:fs/promises'

const path = new URL('../src/data/trips/pais-vasco-frances.json', import.meta.url)
const trip = JSON.parse(await readFile(path, 'utf8'))

const newPlaces = [
  {
    id: 'fr-landes-hossegor-foret',
    tripId: 'pais-vasco-frances',
    name: 'Forêt d’Hossegor · Maison Hargous',
    locality: 'Soorts-Hossegor, Landes',
    categoryId: 'hiking',
    latitude: 43.676131,
    longitude: -1.417881,
    imageUrl: 'https://www.hossegor.fr/wp-content/uploads/2026/02/activites-terrestres-hossegor-nature-running-foret-printemps-400x400.webp',
    imageSourceUrl: 'https://www.hossegor.fr/mon-sejour/les-incontournables/la-foret-landaise-hossegor/',
    imageAttribution: 'Office de Tourisme d’Hossegor',
    alt: 'Sendero entre pinos y vegetación de la Forêt d’Hossegor cerca de Maison Hargous',
    description: 'Bosque landés de pino marítimo y alcornoque a las puertas del océano, recorrido por senderos sombreados para caminar, correr o pedalear. Desde Maison Hargous sale una ruta circular fácil de unos 5,3 km que permite conocer el paisaje forestal típico de Hossegor.',
    tips: [
      'La ruta circular desde Maison Hargous ronda los 5,3 km y suele llevar entre 1 h y 1 h 30; es fácil y con poco desnivel.',
      'En verano la sombra del pinar la convierte en una buena alternativa a la playa en las horas de más calor.',
      'En periodos de riesgo alto de incendio pueden aplicarse restricciones de acceso al macizo: comprueba los avisos locales antes de entrar y evita cualquier fuente de fuego.'
    ],
    price: null,
    dogAccess: 'conditional',
    dogNotes: 'La Oficina de Turismo de Hossegor indica que se puede pasear con perro por el bosque. Recomienda llevarlo con correa, especialmente durante la nidificación, para proteger la fauna y no molestar a otros usuarios.',
    officialSourceUrl: 'https://www.hossegor.fr/mon-sejour/les-incontournables/la-foret-landaise-hossegor/',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=43.676131%2C-1.417881',
    additionalInfo: [
      { label: 'Ruta recomendada', value: 'Circuito Maison Hargous · aprox. 5,3 km · fácil' },
      { label: 'Interés', value: 'Pinar landés · alcornoques · senderismo · sombra · fauna' },
      { label: 'Tiempo orientativo', value: '1 h – 1 h 30' }
    ]
  },
  {
    id: 'fr-landes-hossegor-barthes-monbardon',
    tripId: 'pais-vasco-frances',
    name: 'Les Barthes de Monbardon',
    locality: 'Soorts-Hossegor, Landes',
    categoryId: 'nature',
    latitude: 43.658868,
    longitude: -1.397796,
    imageUrl: 'https://images.weserv.nl/?output=webp&url=https%3A%2F%2Fcdt64.media.tourinsoft.eu%2Fupload%2FAigrette--Jerome.Marti-Noguere---Copie.jpg&w=1024',
    imageSourceUrl: 'https://www.hossegor.fr/non-classe-fr/les-barthes-soorts-hossegor/',
    imageAttribution: 'Jérôme Marti-Noguere · Office de Tourisme d’Hossegor',
    alt: 'Garza en la zona húmeda de Les Barthes de Monbardon en Soorts-Hossegor',
    description: 'Zona húmeda protegida de unas 50 hectáreas formada por praderas pantanosas y turberas saturadas de agua. Contrasta con el pinar landés y destaca por su biodiversidad, con numerosas aves, insectos, mariposas y vegetación de humedal.',
    tips: [
      'La ficha oficial señala una promenade rehabilitada y accesible de 3,7 km, con paneles sobre fauna y flora.',
      'También existe un circuito más largo de 10,3 km a pie o en bicicleta si quieres convertir la visita en una salida de media jornada.',
      'Acércate al observatorio ornitológico con calma y evita salirte de los recorridos: es un espacio natural sensible.'
    ],
    price: null,
    dogAccess: 'unknown',
    dogNotes: 'No he localizado una norma oficial específica y actual sobre perros en Les Barthes. Al ser un espacio natural sensible con aves y otra fauna, revisa la señalización del acceso y, si se permite, lleva el perro atado y permanece en los itinerarios.',
    officialSourceUrl: 'https://www.hossegor.fr/non-classe-fr/les-barthes-soorts-hossegor/',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=43.658868%2C-1.397796',
    additionalInfo: [
      { label: 'Paseo accesible', value: 'Aprox. 3,7 km · visita libre' },
      { label: 'Ruta larga', value: 'Aprox. 10,3 km a pie o en bicicleta' },
      { label: 'Interés', value: 'Humedal · aves · observatorio · biodiversidad · paisaje' },
      { label: 'Tiempo orientativo', value: '1 h – 3 h' }
    ]
  }
]

const ids = new Set(trip.places.map((place) => place.id))
for (const place of newPlaces) {
  if (!ids.has(place.id)) trip.places.push(place)
}

const casernes = trip.places.find((place) => place.id === 'fr-landes-seignosse-casernes')
if (!casernes) throw new Error('No se encontró la ficha de Plage des Casernes')

casernes.dogAccess = 'conditional'
casernes.dogNotes = 'La ficha individual de Casernes marca los animales como no autorizados dentro de la playa regulada. La información general de Seignosse permite estar con el perro atado más allá de los carteles triangulares naranja y negro que delimitan esa zona. Del 1 de junio al 30 de septiembre, entre las 11:00 y las 19:00, no entres con el perro en las zonas de playa restringidas.'
casernes.tips = [
  'En 2026 la zona vigilada funciona del 27 de junio al 30 de agosto, con horario de 12:30 a 18:30 hasta el 3 de julio y de 11:00 a 19:00 del 4 de julio al 30 de agosto.',
  'El parking es gratuito; desde él queda un acceso a pie por el entorno dunar.',
  'Si vas con perro, busca los carteles triangulares naranja y negro: fuera de la zona regulada puedes continuar con él atado según la información general de Seignosse.',
  'Es costa atlántica abierta: revisa bandera, corrientes y parte de mar antes de bañarte aunque veas poca gente.'
]
casernes.officialSourceUrl = 'https://www.seignosse-tourisme.com/decouvrir-seignosse/les-plages-de-seignosse/'

await writeFile(path, `${JSON.stringify(trip, null, 2)}\n`)
