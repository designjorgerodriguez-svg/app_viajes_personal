import { readFile, writeFile } from 'node:fs/promises'

const path = new URL('../src/data/trips/pais-vasco-frances.json', import.meta.url)
const trip = JSON.parse(await readFile(path, 'utf8'))

const updates = {
  'fr-landes-biscarrosse-vivier': {
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Biscarrosse%20Plage%202.JPG?width=1600',
    imageSourceUrl: 'https://commons.wikimedia.org/wiki/File:Biscarrosse_Plage_2.JPG',
    imageAttribution: 'Echtner · CC BY 3.0',
    alt: 'Playa atlántica de Biscarrosse con arena, océano y cielo abierto',
  },
  'fr-landes-biscarrosse-sud': {
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Biscarrosse%20beaches%2C%20looking%20south%2C%202015.jpg?width=1600',
    imageSourceUrl: 'https://commons.wikimedia.org/wiki/File:Biscarrosse_beaches%2C_looking_south%2C_2015.jpg',
    imageAttribution: 'DimiTalen · CC0',
    alt: 'Vista amplia de las playas de Biscarrosse mirando hacia el sur',
  },
  'fr-landes-leon-lac-plage': {
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Sunset%20Lac%20de%20L%C3%A9on%20Landes.jpg?width=1600',
    imageSourceUrl: 'https://commons.wikimedia.org/wiki/File:Sunset_Lac_de_L%C3%A9on_Landes.jpg',
    imageAttribution: 'VIGNA christian · CC BY-SA 4.0',
    alt: 'Atardecer sobre el lago de Léon con reflejos en el agua',
  },
  'fr-landes-vielle-lac-plage': {
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Lac%20de%20L%C3%A9on%20Landes%20France.jpg?width=1600',
    imageSourceUrl: 'https://commons.wikimedia.org/wiki/File:Lac_de_L%C3%A9on_Landes_France.jpg',
    imageAttribution: 'VIGNA christian · CC BY-SA 4.0',
    alt: 'Panorámica amplia del lago de Léon rodeado de vegetación',
  },
  'fr-landes-ondres-plage': {
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Plage%20d%27Ondres.JPG?width=1600',
    imageSourceUrl: 'https://commons.wikimedia.org/wiki/File:Plage_d%27Ondres.JPG',
    imageAttribution: 'Benoît Prieur · CC0',
    alt: 'Playa de Ondres con arena, dunas y océano Atlántico',
  },
}

for (const place of trip.places) {
  if (updates[place.id]) Object.assign(place, updates[place.id])
}

await writeFile(path, `${JSON.stringify(trip, null, 2)}\n`, 'utf8')
