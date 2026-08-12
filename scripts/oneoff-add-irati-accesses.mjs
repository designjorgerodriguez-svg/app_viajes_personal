import { readFile, writeFile } from 'node:fs/promises'

const path = new URL('../src/data/trips/pais-vasco-frances.json', import.meta.url)
const trip = JSON.parse(await readFile(path, 'utf8'))

const ochagavia = {
  id: 'es-navarra-selva-irati',
  tripId: 'pais-vasco-frances',
  name: 'Acceso Selva de Irati · Ochagavía',
  locality: 'Casas de Irati · Virgen de las Nieves, Navarra',
  categoryId: 'nature',
  latitude: 42.9884466,
  longitude: -1.1055351,
  imageUrl: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Selva%20de%20Irati%20%28Navarra%29.jpg?width=1600',
  imageSourceUrl: 'https://commons.wikimedia.org/wiki/File:Selva_de_Irati_%28Navarra%29.jpg',
  imageAttribution: 'Quique · CC BY-SA 4.0',
  alt: 'Camino de acceso a la Selva de Irati desde el valle de Salazar',
  description: 'Acceso principal a la Selva de Irati desde Ochagavía por la NA-2012. El punto está situado en el Centro de acogida Casas de Irati «Virgen de las Nieves», con aparcamiento, información, merendero, bar-restaurante y salida de varios senderos.',
  tips: [
    'Desde Ochagavía son unos 23 km y alrededor de 40 minutos por carretera de montaña.',
    'En temporada alta conviene llegar pronto porque el acceso puede regularse por aforo; en invierno puede estar cerrado y es mejor consultar el estado de la carretera antes de ir.'
  ],
  price: {
    label: 'Acceso al bosque gratuito · en temporada alta se cobra una tasa de mantenimiento por vehículo en Casas de Irati; consulta el importe vigente antes de ir'
  },
  dogAccess: 'unknown',
  dogNotes: 'No he localizado una norma general oficial y actual sobre perros para todo el acceso y los senderos. Llévalo con correa y controlado, especialmente por fauna y ganado, y respeta la señalización de cada recorrido.',
  officialSourceUrl: 'https://www.visitnavarra.es/es/selva-de-irati/',
  googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=42.9884466%2C-1.1055351',
  additionalInfo: [
    {
      label: 'Desde Ochagavía',
      value: '23 km · aprox. 40 min'
    },
    {
      label: 'Servicios',
      value: 'Parking · información · merendero · bar-restaurante · alquiler de bicicletas'
    },
    {
      label: 'Rutas cercanas',
      value: 'Cascada del Cubo · río Urbeltza · Bosque de Zabaleta · vuelta al embalse de Irabia'
    }
  ]
}

const orbaizeta = {
  id: 'es-navarra-irati-acceso-orbaizeta-arrazola',
  tripId: 'pais-vasco-frances',
  name: 'Acceso Selva de Irati · Orbaizeta',
  locality: 'Arrazola · Orbaizeta, Navarra',
  categoryId: 'nature',
  latitude: 43.00234,
  longitude: -1.20505,
  imageUrl: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Embalse%20de%20Irabia%2003.jpg?width=1600',
  imageSourceUrl: 'https://commons.wikimedia.org/wiki/File:Embalse_de_Irabia_03.jpg',
  imageAttribution: 'Rodelar · CC BY-SA 4.0',
  alt: 'Embalse de Irabia rodeado por el bosque de la Selva de Irati',
  description: 'Acceso principal a la Selva de Irati desde Orbaizeta por el valle de Aezkoa. El punto está situado en el control de acceso del área de Arrazola, con parking, información y merendero; desde aquí parten rutas y se puede continuar hacia la presa del embalse de Irabia.',
  tips: [
    'Desde Orbaizeta se llega a Arrazola en unos 8 minutos en coche.',
    'Para rutas alrededor del embalse se puede continuar hacia los aparcamientos de la presa; revisa antes el estado de la pista y las posibles regulaciones de acceso.'
  ],
  price: {
    label: 'Acceso al bosque gratuito · en temporada alta se cobra una tasa de mantenimiento por vehículo en Arrazola; consulta el importe vigente antes de ir'
  },
  dogAccess: 'unknown',
  dogNotes: 'No he localizado una norma general oficial y actual sobre perros para todo el acceso y los senderos. Llévalo con correa y controlado, especialmente por fauna y ganado, y respeta la señalización de cada recorrido.',
  officialSourceUrl: 'https://www.visitnavarra.es/es/selva-de-irati/',
  googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=43.00234%2C-1.20505',
  additionalInfo: [
    {
      label: 'Desde Orbaizeta',
      value: 'Aprox. 8 min en coche'
    },
    {
      label: 'Servicios',
      value: 'Parking · punto de información · merendero'
    },
    {
      label: 'Rutas cercanas',
      value: 'Anbulolatz · Azalegi-Ermita de San Esteban · acceso hacia el embalse de Irabia'
    }
  ]
}

const ochagaviaIndex = trip.places.findIndex((item) => item.id === ochagavia.id)
if (ochagaviaIndex >= 0) trip.places[ochagaviaIndex] = ochagavia
else trip.places.push(ochagavia)

const orbaizetaIndex = trip.places.findIndex((item) => item.id === orbaizeta.id)
if (orbaizetaIndex >= 0) trip.places[orbaizetaIndex] = orbaizeta
else trip.places.push(orbaizeta)

await writeFile(path, `${JSON.stringify(trip, null, 2)}\n`, 'utf8')
