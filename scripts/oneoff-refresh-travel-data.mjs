import { readFile, writeFile } from 'node:fs/promises'

const path = new URL('../src/data/trips/pais-vasco-frances.json', import.meta.url)
const trip = JSON.parse(await readFile(path, 'utf8'))

const coordinateUpdates = {
  'fr-pvf-hendaye-chateau-abbadia': [43.3775, -1.7492],
  'fr-pvf-saint-jean-luz-port': [43.3869, -1.66494],
  'fr-pvf-espelette': [43.34058, -1.44847],
  'fr-pvf-sare-train-rhune': [43.325038, -1.6006769],
  'fr-pvf-saint-jean-pied-port-citadelle': [43.1620471, -1.2332689],
  'fr-pvf-larrau-holzarte': [43.0045391, -0.9229399],
  'fr-pvf-ascain': [43.3444441, -1.6230974],
  'fr-pvf-sare': [43.3127041, -1.5801644],
  'fr-pvf-ainhoa': [43.306764, -1.498918],
  'fr-pvf-osses': [43.241629, -1.284165],
  'fr-pvf-baigorri': [43.1786217, -1.3404606],
  'fr-pvf-aldudes': [43.098527, -1.42771],
  'fr-pvf-irouleguy-cave': [43.1837582, -1.3341034],
  'fr-pvf-aldudes-pierre-oteiza': [43.089396, -1.424489],
  'fr-landes-ondres-plage': [43.577416, -1.48817],
  'fr-landes-lette-blanche': [43.9027935, -1.3772605],
  'fr-pvf-sames-lac': [43.5302877, -1.170147],
  'fr-pvf-uhaitza-saison': [43.2079364, -0.8972893],
}

const imageUpdates = {
  'fr-pvf-espelette': {
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Espelette%20Village.jpg?width=1200',
    imageSourceUrl: 'https://commons.wikimedia.org/wiki/File:Espelette_Village.jpg',
    imageAttribution: 'Wikimedia Commons · CC BY-SA 3.0 / CC BY 2.5',
    alt: 'Casas tradicionales y calle del pueblo de Espelette',
  },
  'fr-pvf-sare-train-rhune': {
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Chemin%20de%20fer%20de%20la%20Rhune%20Le%20second%20train.jpg?width=1200',
    imageSourceUrl: 'https://commons.wikimedia.org/wiki/File:Chemin_de_fer_de_la_Rhune_Le_second_train.jpg',
    imageAttribution: 'Marianne Casamance · CC BY-SA 4.0',
    alt: 'Tren cremallera de La Rhune ascendiendo por la montaña',
  },
  'fr-pvf-ascain': {
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Ascain%20depuis%20la%20Rhune.jpg?width=1200',
    imageSourceUrl: 'https://commons.wikimedia.org/wiki/File:Ascain_depuis_la_Rhune.jpg',
    imageAttribution: 'Eusebius · CC BY 3.0',
    alt: 'Vista panorámica de Ascain desde La Rhune',
  },
  'fr-pvf-sare': {
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Sare%20Village.jpg?width=1200',
    imageSourceUrl: 'https://commons.wikimedia.org/wiki/File:Sare_Village.jpg',
    imageAttribution: 'Harrieta171 · CC BY-SA 3.0',
    alt: 'Vista del pueblo vasco de Sare rodeado de paisaje verde',
  },
  'fr-pvf-osses': {
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Oss%C3%A8s%20Maison%20%281%29.jpg?width=1200',
    imageSourceUrl: 'https://commons.wikimedia.org/wiki/File:Oss%C3%A8s_Maison_%281%29.jpg',
    imageAttribution: 'Harrieta171 · CC BY-SA 3.0 / CC BY 2.5',
    alt: 'Casa tradicional vasca en Ossès',
  },
  'fr-pvf-banca': {
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Banca%20Village.JPG?width=1200',
    imageSourceUrl: 'https://commons.wikimedia.org/wiki/File:Banca_Village.JPG',
    imageAttribution: 'Harrieta171 · CC BY-SA 3.0',
    alt: 'Vista de Banca y su iglesia en el valle de Aldudes',
  },
  'fr-pvf-osses-poterie-goicoechea': {
    imageUrl: 'https://petitfute.twic.pics/medias/professionnel/1544527/premium/originale/5ea04ca06cfc1-goicoechea-potier-ceramiste.png?pf=v2&twic=v1%2Fcover%3D1200x675%2Fmax%3D1400',
    imageSourceUrl: 'https://www.petitfute.com/v3092-osses-64780/c1085-maison-deco-jardin/c1066-artisanat-d-art/1544527-goicoechea.html',
    imageAttribution: 'Poterie Goicoechea · imagen del establecimiento',
    alt: 'Grandes piezas de cerámica de Poterie Goicoechea',
  },
  'fr-landes-messanges-plage-sud': {
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Messanges%20111.jpg?width=1200',
    imageSourceUrl: 'https://commons.wikimedia.org/wiki/File:Messanges_111.jpg',
    imageAttribution: 'Didier belin · CC BY-SA 3.0',
    alt: 'Playa de arena y dunas en Messanges',
  },
  'fr-pvf-arrossa-nive-bano': {
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Paysage%20de%20la%20Nive%20avec%20Ur%20Bizia%20rafting.jpg?width=1200',
    imageSourceUrl: 'https://commons.wikimedia.org/wiki/File:Paysage_de_la_Nive_avec_Ur_Bizia_rafting.jpg',
    imageAttribution: 'Rafting64 · CC BY-SA 3.0',
    alt: 'Río Nive entre montañas y vegetación del País Vasco',
  },
  'fr-pvf-sames-lac': {
    imageUrl: 'https://domaine-du-lac-de-sames.fr/images/sur-site/water-park-du-domaine-du-lac-de-sames-structure-gonflable.jpg',
    imageSourceUrl: 'https://domaine-du-lac-de-sames.fr/activites.html',
    imageAttribution: 'Domaine du Lac de Sames · imagen oficial',
    alt: 'Lago de Sames con playa y zona de actividades acuáticas',
  },
  'fr-pvf-uhaitza-saison': {
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Maul%C3%A9on-Licharre%20-%20Gave%20-%202.jpg?width=1200',
    imageSourceUrl: 'https://commons.wikimedia.org/wiki/File:Maul%C3%A9on-Licharre_-_Gave_-_2.jpg',
    imageAttribution: 'Peter Potrowl · CC BY-SA 4.0',
    alt: 'Río Saison en el entorno de Mauléon-Licharre',
  },
}

const placeById = new Map(trip.places.map((place) => [place.id, place]))

for (const [id, [latitude, longitude]] of Object.entries(coordinateUpdates)) {
  const place = placeById.get(id)
  if (!place) throw new Error(`No existe el lugar ${id}`)
  place.latitude = latitude
  place.longitude = longitude
}

for (const [id, image] of Object.entries(imageUpdates)) {
  const place = placeById.get(id)
  if (!place) throw new Error(`No existe el lugar ${id}`)
  Object.assign(place, image)
}

for (const place of trip.places) {
  place.googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${place.latitude},${place.longitude}`)}`
}

const missingImages = trip.places.filter((place) => !place.imageUrl)
if (missingImages.length) {
  throw new Error(`Siguen faltando imágenes: ${missingImages.map((place) => place.id).join(', ')}`)
}

await writeFile(path, `${JSON.stringify(trip, null, 2)}\n`, 'utf8')
console.log(`Actualizados ${trip.places.length} lugares; todos tienen imagen.`)
