import { readFile, writeFile } from 'node:fs/promises'

const path = new URL('../src/data/trips/pais-vasco-frances.json', import.meta.url)
const trip = JSON.parse(await readFile(path, 'utf8'))

trip.places = trip.places.filter((place) => place.id !== 'es-madrid-penalara')

await writeFile(path, `${JSON.stringify(trip, null, 2)}\n`, 'utf8')
