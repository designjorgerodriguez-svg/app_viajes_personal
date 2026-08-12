import { readFile, writeFile } from 'node:fs/promises'

const path = new URL('../src/data/trips/pais-vasco-frances.json', import.meta.url)
const trip = JSON.parse(await readFile(path, 'utf8'))

const places = [
  {
    id: 'fr-gironde-dune-pilat',
    tripId: 'pais-vasco-frances',
    name: 'Duna de Pilat',
    locality: 'La Teste-de-Buch, Gironde',
    categoryId: 'nature',
    latitude: 44.596701,
    longitude: -1.209987,
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Dune%20du%20Pilat%20-%20panoramio%20%286%29.jpg?width=1600',
    imageSourceUrl: 'https://commons.wikimedia.org/wiki/File:Dune_du_Pilat_-_panoramio_(6).jpg',
    imageAttribution: 'Tanya Dedyukhina · CC BY 3.0',
    alt: 'La Duna de Pilat elevándose entre el bosque de las Landas y el océano Atlántico',
    description: 'Gran duna costera a la entrada de la bahía de Arcachon, con una cresta de arena que domina el bosque, el Banc d’Arguin y el Atlántico. El acceso a la duna es libre; el aparcamiento oficial financia la conservación del Grand Site.',
    tips: [
      'Para disfrutarla con menos calor y mejor luz, prioriza primera hora o final de la tarde; la subida por arena es corta pero exigente.',
      'La escalera de acceso suele instalarse de abril a octubre; fuera de ese periodo se asciende directamente por la arena.',
      'El aparcamiento oficial no permite estacionar entre las 02:00 y las 05:00.'
    ],
    price: {
      label: 'Acceso a la duna gratuito · parking oficial: 4 h 7 € en temporada alta / 5 € en baja · 8 h 9 € / 7 € · 12 h 11 € / 9 €'
    },
    dogAccess: 'conditional',
    dogNotes: 'Los perros están permitidos con correa en el área de recepción y sobre la duna. No están permitidos en la playa situada al pie de la duna.',
    officialSourceUrl: 'https://ladunedupilat.com/es/preparacion/tus-preguntas/',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=44.596701%2C-1.209987',
    additionalInfo: [
      { label: 'Interés', value: 'Duna · océano · bosque · panorámicas · atardecer' },
      { label: 'Tiempo orientativo', value: '2 – 3 h' },
      { label: 'Acceso', value: 'Grand Site de la Dune du Pilat · La Teste-de-Buch' }
    ]
  },
  {
    id: 'fr-pvf-biarritz',
    tripId: 'pais-vasco-frances',
    name: 'Biarritz',
    locality: 'Biarritz, Pyrénées-Atlantiques',
    categoryId: 'city',
    latitude: 43.483978,
    longitude: -1.566303,
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Rocher%20de%20la%20Vierge%20%28Biarritz%29.jpg?width=1600',
    imageSourceUrl: 'https://commons.wikimedia.org/wiki/File:Rocher_de_la_Vierge_(Biarritz).jpg',
    imageAttribution: 'Gzen92 · CC BY-SA 4.0',
    alt: 'Rocher de la Vierge y costa rocosa de Biarritz frente al Atlántico',
    description: 'Ciudad costera vasco-francesa con un frente marítimo muy variado, desde la Grande Plage y el Hôtel du Palais hasta el Port des Pêcheurs, el Port-Vieux y el Rocher de la Vierge. Se presta especialmente bien a recorrerla a pie.',
    tips: [
      'Haz un recorrido lineal por la costa: Grande Plage, Port des Pêcheurs, Rocher de la Vierge y Côte des Basques.',
      'En verano buena parte del litoral y el hipercentro se peatonalizan durante amplias franjas horarias, así que conviene aparcar una vez y hacer la visita caminando.',
      'Si quieres baño, revisa el estado de la mar y la zona vigilada del día: con marea y oleaje cambian las áreas seguras.'
    ],
    price: null,
    dogAccess: 'unknown',
    dogNotes: 'No he localizado una norma municipal única y suficientemente clara para todo el recorrido urbano. En exteriores hay espacios de paseo con perros, pero las playas, jardines e interiores tienen reglas propias; revisa la señalización de cada zona.',
    officialSourceUrl: 'https://www.biarritz.fr/',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=43.483978%2C-1.566303',
    additionalInfo: [
      { label: 'Interés', value: 'Rocher de la Vierge · Grande Plage · puerto · arquitectura · costa' },
      { label: 'Tiempo orientativo', value: '3 – 5 h' },
      { label: 'Consejo', value: 'Mejor como paseo urbano a pie, sin mover el vehículo entre paradas' }
    ]
  },
  {
    id: 'fr-landes-hossegor-lac',
    tripId: 'pais-vasco-frances',
    name: 'Lac d’Hossegor',
    locality: 'Soorts-Hossegor, Landes',
    categoryId: 'nature',
    latitude: 43.67,
    longitude: -1.43,
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Hossegor%20lac.jpg?width=1600',
    imageSourceUrl: 'https://commons.wikimedia.org/wiki/File:Hossegor_lac.jpg',
    imageAttribution: 'Rémi Jouan · CC BY-SA 2.5',
    alt: 'Lago marino de Hossegor rodeado de pinos y villas junto al agua',
    description: 'Lago marino conectado al Atlántico y sometido a las mareas, rodeado por senderos, pequeñas playas y vegetación costera. Es una parada tranquila para caminar y ver un paisaje diferente al de las grandes playas oceánicas.',
    tips: [
      'El pequeño circuito alrededor del lago ronda los 5,8 km; el recorrido largo, pasando por el canal, unos 7,5 km.',
      'Si quieres bañarte, la marea creciente o alta suele ofrecer mejores condiciones que la bajamar.',
      'En verano hay cuatro playas vigiladas en el lago; revisa horarios y zonas de baño antes de entrar al agua.'
    ],
    price: null,
    dogAccess: 'conditional',
    dogNotes: 'En los caminos y el paseo alrededor del lago los perros deben ir con correa. Las playas del lago tienen restricciones estacionales y las zonas de baño vigiladas no admiten animales; no entres con el perro en una playa señalizada como restringida.',
    officialSourceUrl: 'https://www.hossegor.fr/mon-sejour/les-incontournables/le-lac/',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=43.67%2C-1.43',
    additionalInfo: [
      { label: 'Paseo', value: 'Pequeño tour 5,8 km · gran tour 7,5 km' },
      { label: 'Interés', value: 'Lago marino · mareas · paseo · baño · paisaje' },
      { label: 'Tiempo orientativo', value: '1 h 30 – 3 h' }
    ]
  },
  {
    id: 'fr-landes-seignosse-etang-noir',
    tripId: 'pais-vasco-frances',
    name: 'Réserve Naturelle de l’Étang Noir',
    locality: 'Seignosse, Landes',
    categoryId: 'nature',
    latitude: 43.6940931,
    longitude: -1.3710565,
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Vue%20de%20l%27%C3%A9tang%20Noir.%20Mai%202015.JPG?width=1600',
    imageSourceUrl: 'https://commons.wikimedia.org/wiki/File:Vue_de_l%27%C3%A9tang_Noir._Mai_2015.JPG',
    imageAttribution: 'Egal1250 · CC BY-SA 3.0',
    alt: 'Aguas oscuras del Étang Noir rodeadas por bosque pantanoso en Seignosse',
    description: 'Reserva natural de 52 hectáreas que protege un mosaico de humedales, bosque pantanoso, turbera, arroyo y el propio Étang Noir. Un sendero sobre pasarelas permite entrar en el bosque húmedo y llegar hasta varios puntos de observación.',
    tips: [
      'Es una visita corta pero muy distinta a la costa: ve despacio por la pasarela y dedica tiempo a observar aves, vegetación y agua.',
      'Del 6 de julio al 30 de agosto de 2026 la visita libre tiene una contribución de 1 € por persona desde los 6 años.',
      'La reserva puede limitar o cerrar el acceso por riesgo de incendio u otras condiciones naturales; comprueba el aviso del día antes de desplazarte.'
    ],
    price: {
      label: '2026 · visita libre del 6 jul al 30 ago: 1 € por persona desde 6 años · visitas guiadas: adulto 6 €, 6–16 años 5 €, menores de 6 gratis'
    },
    dogAccess: 'not-allowed',
    dogNotes: 'Los animales no están autorizados en la reserva natural, incluidos los recorridos de visita.',
    officialSourceUrl: 'https://www.etang-noir.fr/',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=43.6940931%2C-1.3710565',
    additionalInfo: [
      { label: 'Entorno', value: 'Humedal · bosque pantanoso · turbera · observación de fauna' },
      { label: 'Superficie', value: '52 ha' },
      { label: 'Tiempo orientativo', value: '1 – 1 h 30' }
    ]
  },
  {
    id: 'fr-gironde-bordeaux-centro',
    tripId: 'pais-vasco-frances',
    name: 'Burdeos · centro histórico',
    locality: 'Bordeaux, Gironde',
    categoryId: 'city',
    latitude: 44.8417,
    longitude: -0.568839,
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Place%20de%20la%20Bourse%20et%20le%20miroir%20d%27eau%20-%20Bordeaux%2002.jpg?width=1600',
    imageSourceUrl: 'https://commons.wikimedia.org/wiki/File:Place_de_la_Bourse_et_le_miroir_d%27eau_-_Bordeaux_02.jpg',
    imageAttribution: 'Javier Perez Montes · CC BY-SA 4.0',
    alt: 'Place de la Bourse de Burdeos reflejada en el Miroir d’eau',
    description: 'Centro histórico de Burdeos, con un gran conjunto urbano protegido por la UNESCO y un recorrido muy agradecido a pie por Place de la Bourse, Miroir d’eau, Saint-Pierre, Porte Cailhau, la ribera del Garona y las grandes plazas del siglo XVIII.',
    tips: [
      'Usa Place de la Bourse y el Miroir d’eau como punto de arranque; desde allí el casco histórico se recorre bien caminando.',
      'Si solo vas unas horas, prioriza el frente del Garona, Saint-Pierre, Porte Cailhau y Place des Quinconces antes que entrar en museos.',
      'La visita del espacio público es gratuita; los museos, monumentos y visitas guiadas tienen tarifas independientes.'
    ],
    price: null,
    dogAccess: 'unknown',
    dogNotes: 'El paseo por espacios públicos exteriores es compatible con una visita urbana, pero no he localizado una única norma oficial que cubra todo el centro histórico. Comprueba por separado parques, transporte, museos y monumentos antes de entrar con perro.',
    officialSourceUrl: 'https://www.bordeaux-tourisme.com/ville-patrimoine/visites-guidees-accompagnees.html',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=44.8417%2C-0.568839',
    additionalInfo: [
      { label: 'Interés', value: 'UNESCO · Place de la Bourse · Miroir d’eau · Garona · casco histórico' },
      { label: 'Tiempo orientativo', value: '4 h – día completo' },
      { label: 'Base de visita', value: 'Place de la Bourse / Miroir d’eau' }
    ]
  },
  {
    id: 'fr-gironde-blaye-citadelle',
    tripId: 'pais-vasco-frances',
    name: 'Citadelle de Blaye',
    locality: 'Blaye, Gironde',
    categoryId: 'monument',
    latitude: 45.129242,
    longitude: -0.666475,
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Citadelle%20de%20Blaye%207.jpg?width=1600',
    imageSourceUrl: 'https://commons.wikimedia.org/wiki/File:Citadelle_de_Blaye_7.jpg',
    imageAttribution: 'Guiguilacagouille · CC BY-SA 3.0',
    alt: 'Fortificaciones y espacios interiores de la ciudadela de Blaye',
    description: 'Gran fortaleza de Vauban sobre el estuario de la Gironda, integrada en el sistema defensivo del Verrou de l’Estuaire y declarada Patrimonio Mundial. Se puede recorrer libremente por sus calles, puertas, bastiones y miradores.',
    tips: [
      'La visita exterior por la ciudadela puede hacerse por libre; merece la pena caminar por los bastiones para ver el estuario.',
      'Si quieres entender mejor el sistema defensivo, la visita guiada por los subterráneos es el complemento más interesante.',
      'Los parkings situados al pie de la ciudadela son una opción práctica para entrar andando y evitar maniobras dentro del recinto.'
    ],
    price: {
      label: 'Recorrido exterior de la ciudadela gratuito · visita guiada por los subterráneos: adulto 7,50 €, 5–12 años 5,50 €, menores de 5 años gratis'
    },
    dogAccess: 'conditional',
    dogNotes: 'Los perros pueden estar en el recinto exterior, pero deben ir con correa. Algunas actividades o espacios cerrados pueden aplicar restricciones propias; comprueba la visita concreta antes de reservar.',
    officialSourceUrl: 'https://boutique.tourisme-blaye.com/decouvrir-la-citadelle-de-blaye/visites-guidees/visite-de-la-citadelle-par-les-souterrains',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=45.129242%2C-0.666475',
    additionalInfo: [
      { label: 'Interés', value: 'Vauban · UNESCO · fortificaciones · estuario · panorámicas' },
      { label: 'Tiempo orientativo', value: '2 – 3 h' },
      { label: 'Extra', value: 'Visita guiada por los subterráneos' }
    ]
  },
  {
    id: 'fr-landes-seignosse-casernes',
    tripId: 'pais-vasco-frances',
    name: 'Plage des Casernes',
    locality: 'Seignosse, Landes',
    categoryId: 'beach',
    latitude: 43.72246,
    longitude: -1.43157,
    imageUrl: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Beach%20of%20Seignosse.jpg?width=1600',
    imageSourceUrl: 'https://commons.wikimedia.org/wiki/File:Beach_of_Seignosse.jpg',
    imageAttribution: 'Eldidi82 · CC BY-SA 3.0',
    alt: 'Dunas y gran playa atlántica de Seignosse, paisaje característico de Les Casernes',
    description: 'La playa más salvaje del frente marítimo de Seignosse, algo apartada hacia el norte y encajada entre dunas, pinar y océano. Tiene un ambiente menos urbano que otras playas de la zona y es muy apreciada por surfistas y amantes de espacios abiertos.',
    tips: [
      'En 2026 la zona vigilada funciona del 27 de junio al 30 de agosto, con horarios más amplios en julio y agosto.',
      'El parking es gratuito; desde él queda un acceso a pie por el entorno dunar.',
      'Es costa atlántica abierta: revisa bandera, corrientes y parte de mar antes de bañarte aunque veas poca gente.'
    ],
    price: null,
    dogAccess: 'conditional',
    dogNotes: 'Los animales no están autorizados dentro de la zona reglamentada y vigilada. Fuera de esa zona, respeta la señalización vigente del acceso concreto antes de entrar con el perro.',
    officialSourceUrl: 'https://www.seignosse-tourisme.com/fiche/plage-des-casernes/',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=43.72246%2C-1.43157',
    additionalInfo: [
      { label: 'Interés', value: 'Playa salvaje · dunas · pinar · surf · puesta de sol' },
      { label: 'Servicios', value: 'Parking gratuito · socorrismo estival · aseos' },
      { label: 'Tiempo orientativo', value: '1 h 30 – media jornada' }
    ]
  }
]

const existingIds = new Set(trip.places.map((place) => place.id))
trip.places.push(...places.filter((place) => !existingIds.has(place.id)))

await writeFile(path, `${JSON.stringify(trip, null, 2)}\n`, 'utf8')
