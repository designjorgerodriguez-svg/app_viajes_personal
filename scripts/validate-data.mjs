import { access, readFile, readdir } from 'node:fs/promises'
import { join } from 'node:path'

const dataRoot = join(process.cwd(), 'src', 'data')
const categories = JSON.parse(await readFile(join(dataRoot, 'categories.json'), 'utf8'))
const trips = JSON.parse(await readFile(join(dataRoot, 'trips', 'index.json'), 'utf8'))

const categoryIds = new Set(categories.map((category) => category.id))
const placeIds = new Set()
const errors = []
const files = (await readdir(join(dataRoot, 'trips'))).filter(
  (file) => file !== 'index.json' && file.endsWith('.json'),
)

for (const trip of trips) {
  if (!files.includes(trip.file)) {
    errors.push(`El viaje ${trip.id} apunta a un archivo inexistente: ${trip.file}`)
  }
}

for (const file of files) {
  const trip = JSON.parse(await readFile(join(dataRoot, 'trips', file), 'utf8'))
  for (const place of trip.places ?? []) {
    if (placeIds.has(place.id)) errors.push(`ID de lugar duplicado: ${place.id}`)
    placeIds.add(place.id)
    if (place.tripId !== trip.id) errors.push(`${place.id}: tripId no coincide con ${trip.id}`)
    if (!categoryIds.has(place.categoryId)) errors.push(`${place.id}: categoría desconocida ${place.categoryId}`)
    if (typeof place.latitude !== 'number' || place.latitude < -90 || place.latitude > 90) {
      errors.push(`${place.id}: latitud no válida`)
    }
    if (typeof place.longitude !== 'number' || place.longitude < -180 || place.longitude > 180) {
      errors.push(`${place.id}: longitud no válida`)
    }
    if (!['allowed', 'conditional', 'not-allowed', 'unknown'].includes(place.dogAccess)) {
      errors.push(`${place.id}: estado de perros no válido`)
    }
    if (!Array.isArray(place.tips) || place.tips.length === 0 || place.tips.some((tip) => typeof tip !== 'string' || !tip.trim())) {
      errors.push(`${place.id}: debe incluir al menos un consejo de visita`)
    }
    const imageFields = [place.imageUrl, place.imageSourceUrl, place.imageAttribution, place.alt]
    const completedImageFields = imageFields.filter((value) => typeof value === 'string' && value.trim()).length
    if (completedImageFields !== 0 && completedImageFields !== imageFields.length) {
      errors.push(`${place.id}: la imagen requiere URL local, fuente, atribución y texto alternativo`)
    }
    if (completedImageFields === imageFields.length) {
      if (!place.imageUrl.startsWith('/')) errors.push(`${place.id}: imageUrl debe ser una ruta local pública`)
      if (!place.imageSourceUrl.startsWith('https://')) errors.push(`${place.id}: imageSourceUrl debe usar HTTPS`)
      if (place.imageUrl.startsWith('/')) {
        try {
          await access(join(process.cwd(), 'public', place.imageUrl.slice(1)))
        } catch {
          errors.push(`${place.id}: no existe el archivo ${place.imageUrl}`)
        }
      }
    }
  }
}

if (errors.length) {
  console.error(errors.join('\n'))
  process.exit(1)
}

console.log(`Datos válidos: ${trips.length} viaje, ${categories.length} categorías, ${placeIds.size} lugares.`)
