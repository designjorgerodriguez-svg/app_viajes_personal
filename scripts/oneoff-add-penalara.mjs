import { readFile, writeFile } from 'node:fs/promises'

const path = new URL('../src/data/trips/pais-vasco-frances.json', import.meta.url)
const trip = JSON.parse(await readFile(path, 'utf8'))

const place = {
  id: 'es-madrid-penalara',
  tripId: 'pais-vasco-frances',
  name: 'Pico de Peñalara',
  locality: 'Rascafría / Real Sitio de San Ildefonso',
  categoryId: 'hiking',
  latitude: 40.8500369,
  longitude: -3.9560669,
  imageUrl: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Cima%20de%20Pe%C3%B1alara.%20Parque%20nacional%20de%20la%20Sierra%20de%20Guadarrama.%20Espa%C3%B1a%2C%20Spain.jpg?width=1600',
  imageSourceUrl: 'https://commons.wikimedia.org/wiki/File:Cima_de_Pe%C3%B1alara._Parque_nacional_de_la_Sierra_de_Guadarrama._Espa%C3%B1a,_Spain.jpg',
  imageAttribution: 'Carlos Teixidor Cadenas · CC BY 4.0',
  alt: 'Cima de Peñalara en el Parque Nacional de la Sierra de Guadarrama',
  description: 'Peñalara, con 2.428 m, es la cumbre más alta de la Sierra de Guadarrama. La ruta oficial de ascenso parte del Puerto de Los Cotos y atraviesa ambientes de alta montaña con importantes restos glaciares.',
  tips: [
    'La ruta oficial parte del Centro de Visitantes Peñalara, en el Puerto de Los Cotos; el parque indica unos 5 km hasta la cumbre y unas 2 h 30 de ascenso.',
    'El macizo tiene un cupo máximo diario de 945 visitantes y 250 vehículos en el aparcamiento de Los Cotos; en fines de semana conviene comprobar disponibilidad antes de desplazarse.',
    'En condiciones invernales es una ruta de alta montaña y puede requerir experiencia y material técnico específico.'
  ],
  price: null,
  dogAccess: 'conditional',
  dogNotes: 'Los perros pueden recorrer los senderos del Parque Nacional, pero deben ir siempre atados. En la vertiente madrileña del macizo de Peñalara no está permitido hacer vivac con perros.',
  officialSourceUrl: 'https://www.parquenacionalsierraguadarrama.es/visita/rutas/1306-pnsg-032',
  googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=40.8500369%2C-3.9560669',
  additionalInfo: [
    {
      label: 'Altitud',
      value: '2.428 m'
    },
    {
      label: 'Acceso',
      value: 'Puerto de Los Cotos · Centro de Visitantes Peñalara'
    },
    {
      label: 'Ruta oficial',
      value: '5 km hasta la cumbre · aprox. 2 h 30 · dificultad alta'
    }
  ]
}

const existingIndex = trip.places.findIndex((item) => item.id === place.id)
if (existingIndex >= 0) trip.places[existingIndex] = place
else trip.places.push(place)

await writeFile(path, `${JSON.stringify(trip, null, 2)}\n`, 'utf8')
