import { readFile, writeFile } from 'node:fs/promises'

const path = new URL('../src/data/trips/pais-vasco-frances.json', import.meta.url)
const trip = JSON.parse(await readFile(path, 'utf8'))

const places = [
  {
    id: 'es-navarra-ochagavia',
    tripId: 'pais-vasco-frances',
    name: 'Ochagavía / Otsagabia',
    locality: 'Ochagavía, Navarra',
    categoryId: 'village',
    latitude: 42.906625,
    longitude: -1.090103,
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Ochagavia.JPG?width=1600',
    imageSourceUrl: 'https://commons.wikimedia.org/wiki/File:Ochagavia.JPG',
    imageAttribution: 'Etxemi · CC BY-SA 4.0',
    alt: 'Ochagavía con su puente de piedra, río y casas pirenaicas',
    description: 'Pueblo pirenaico del valle de Salazar y principal puerta oriental a la Selva de Irati. Su casco urbano conserva calles empedradas, casas de arquitectura tradicional y el puente sobre el río Anduña.',
    tips: [
      'Es el pueblo de referencia para entrar a Irati por Casas de Irati: desde aquí la carretera NA-2012 recorre unos 23 km y tarda alrededor de 40 minutos hasta el centro de acogida.',
      'Merece la pena recorrer el casco a pie antes o después de Irati; si tienes tiempo, añade el santuario de Muskilda.'
    ],
    price: null,
    dogAccess: 'unknown',
    dogNotes: 'No he localizado una norma turística oficial específica sobre perros para todo el casco urbano. Revisa la señalización y la normativa local, y comprueba por separado las restricciones de interiores y senderos.',
    officialSourceUrl: 'https://www.visitnavarra.es/es/selva-de-irati/',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=42.906625%2C-1.090103',
    additionalInfo: [
      { label: 'Acceso a Irati', value: 'Casas de Irati · Virgen de las Nieves · 23 km · aprox. 40 min' },
      { label: 'Interés', value: 'Casco histórico · puente · arquitectura pirenaica · valle de Salazar' },
      { label: 'Tiempo orientativo', value: '1 – 2 h' }
    ]
  },
  {
    id: 'es-navarra-orbaizeta',
    tripId: 'pais-vasco-frances',
    name: 'Orbaizeta',
    locality: 'Orbaizeta, Navarra',
    categoryId: 'village',
    latitude: 42.97431,
    longitude: -1.23014,
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Orbaiceta%2C%20Navarra.JPG?width=1600',
    imageSourceUrl: 'https://commons.wikimedia.org/wiki/File:Orbaiceta%2C_Navarra.JPG',
    imageAttribution: 'Feranza · CC BY-SA 3.0',
    alt: 'Caserío de Orbaizeta rodeado por el paisaje verde del valle de Aezkoa',
    description: 'Pueblo del valle de Aezkoa y puerta occidental a la Selva de Irati. Desde aquí se accede al área de acogida de Arrazola, a la presa del embalse de Irabia y también a la Real Fábrica de Armas y el collado de Azpegi.',
    tips: [
      'Para entrar a Irati por Aezkoa, Arrazola queda a unos 8 minutos en coche desde el pueblo; desde allí salen varios senderos y se puede continuar hacia la presa de Irabia.',
      'Si encaja en la ruta, combina el pueblo con la Real Fábrica de Armas, situada a unos 5 km.'
    ],
    price: null,
    dogAccess: 'unknown',
    dogNotes: 'No he localizado una norma turística oficial específica sobre perros para todo el casco urbano. Revisa la señalización y la normativa local, y comprueba por separado las restricciones de interiores y senderos.',
    officialSourceUrl: 'https://www.visitnavarra.es/es/selva-de-irati/',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=42.97431%2C-1.23014',
    additionalInfo: [
      { label: 'Acceso a Irati', value: 'Área de acogida de Arrazola · aprox. 8 min en coche' },
      { label: 'Interés', value: 'Valle de Aezkoa · arquitectura pirenaica · Fábrica de Armas · Irabia' },
      { label: 'Tiempo orientativo', value: '45 min – 1 h 30' }
    ]
  }
]

for (const place of places) {
  const index = trip.places.findIndex((item) => item.id === place.id)
  if (index >= 0) trip.places[index] = place
  else trip.places.push(place)
}

await writeFile(path, `${JSON.stringify(trip, null, 2)}\n`, 'utf8')
