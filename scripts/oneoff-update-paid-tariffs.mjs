import { readFile, writeFile } from 'node:fs/promises'

const path = new URL('../src/data/trips/pais-vasco-frances.json', import.meta.url)
const trip = JSON.parse(await readFile(path, 'utf8'))

const updates = {
  'fr-pvf-hendaye-chateau-abbadia': {
    price: {
      label: 'Tarifas · Guiada: adulto 12,90 €, 6–13 años 5,90 €, familia 35 € · Libre: adulto 11,50 €, 6–13 años 5,30 €, familia 31 € · Parque: adulto 2,50 €, hasta 13 años gratis',
    },
  },
  'fr-pvf-sare-train-rhune': {
    price: {
      label: 'Tarifas 2026 · Clásico ida/vuelta: adulto 26 €, 4–12 años 18 €, familia 82 € · Perro 6,50 € · Privilegio: adulto 31 €, niño 22 €',
    },
  },
  'fr-pvf-irouleguy-cave': {
    price: {
      label: 'Visita + degustación · 15 € por adulto · menores de 18 años gratis',
    },
  },
  'fr-pvf-sames-lac': {
    price: {
      label: 'Playa gratis · Parque acuático 1 h: niño 10 €, adulto 12 € · Toboganes: niño 8 €, adulto 9 € · Combo: niño 15 €, adulto 18 €',
    },
  },
}

for (const place of trip.places) {
  if (updates[place.id]) Object.assign(place, updates[place.id])
}

await writeFile(path, `${JSON.stringify(trip, null, 2)}\n`, 'utf8')
