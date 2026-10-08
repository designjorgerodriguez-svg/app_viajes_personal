# Almería - Cabo de Gata · fuentes y criterios

Revisión: 8 de octubre de 2026. Viaje del puente, 9–12 de octubre de 2026. Se añaden 20 lugares sin modificar los ID ni el contenido del País Vasco francés.

## Patrón de la aplicación

Se conserva el contrato TripPlace y el orden de sus campos, las categorías existentes y los componentes de fichas, búsqueda, favoritos, mapa y rutas. Las distancias y duraciones por carretera se calculan desde la ubicación del usuario, igual que en el viaje francés; no se introducen kilómetros fijos ni una base de alojamiento supuesta. El marcador de una playa no sustituye al aparcamiento señalizado: la conducción termina en el acceso disponible y el tramo final puede ser a pie.

Las fichas mantienen la previsión de siete días por coordenadas de Open-Meteo y el enlace a Meteoblue. No se guardan valores de viento, lluvia o temperatura del puente como datos permanentes. El enlace de San José se ha comprobado con GeoNames 2511357 (36.76048, -2.10912): la búsqueda con diez resultados devolvía homónimos de otros países. Se amplía a cien y se descartan resultados alejados del punto. El comportamiento de error conserva el estado sin enlace.

Referencias meteorológicas actuales: [AEMET Tabernas](https://www.aemet.es/es/eltiempo/prediccion/municipios/tabernas-id04088), [AEMET Níjar](https://www.aemet.es/es/eltiempo/prediccion/municipios/nijar-id04066), [AEMET Almería](https://www.aemet.es/es/eltiempo/prediccion/municipios/almeria-id04013). La predicción municipal se refiere a la capital municipal: no se extrapola la temperatura de la villa de Níjar a todas sus playas.

## Perros y acceso en octubre

- [Ordenanza municipal de playas de Níjar, artículo 10](https://www.dipalme.org/Servicios/Anexos/Anexos.nsf/A384BAC47B1317B8C125811A00287407/$file/Ordenanza%20de%20playas.rev01.pdf): la norma contempla restricciones estivales y posibles habilitaciones fuera de temporada. No se ha localizado un Plan de Playas 2026 que confirme la habilitación concreta de Genoveses, Mónsul, El Playazo u otras playas. Estas fichas usan **unknown**; los pueblos aclaran que el paseo exterior no supone permiso para la arena.
- [Bienestar Animal del Ayuntamiento de Níjar](https://nijar.es/ayuntamiento/areas/familias-bienestar-y-comercio/bienestar-animal/): control del animal, correa y recogida de deposiciones en espacios públicos; interiores según el recinto.
- [Ordenanza de animales de Almería](https://almeriaciudad.es/uploads/normativas/2024-05/4.-ordenanza-sobre-proteccion-bienestar-y-tenencia-de-animales-de-compania.pdf) y [comunicación municipal sobre playas caninas](https://almeriaciudad.es/actualidad/almeria-estrena-su-playa-para-perros-la-segunda-y-mas-grande-de-la-provincia-con-mas-de): la restricción estacional se refiere al verano y Semana Santa. San Miguel de Cabo de Gata usa **conditional** para octubre, sujeto a señalización y control del perro. Esa regla no se aplica por analogía a Níjar o Carboneras.
- No se han verificado permisos específicos en Los Muertos, salinas/observatorios, castillo de Tabernas, Cortijo del Fraile, cuevas e interiores de Guadix o todo el PR-A 269. Se mantiene **unknown**, con una explicación específica.
- Fort Bravo: [web oficial](https://fortbravo.org/) y [vendedor Traventia](https://www.traventia.com/parque/fort-bravo/entradas). El vendedor anuncia mascotas atadas para la visita, pero la web oficial consultada no ofrece una regla inequívoca. Se conserva **unknown** y se pide confirmación directa; no se confunde con el [camping, que publica que no admite mascotas](https://campingfortbravo.es/check-in-info-espana/). Tampoco se fija un horario, pues la portada ofrece varias franjas diferentes. Entrada de pago sin precio numérico no confirmado.

El [BOJA de 25 de marzo de 2026](https://www.juntadeandalucia.es/boja/2026/58/BOJA26-058-00003-4059-01_00335281.pdf) fija el control estival de vehículos de las playas de poniente de San José hasta el 27 de septiembre. Esa restricción de vehículos ya ha terminado para el viaje; no constituye una autorización para perros. Se mantienen las restricciones señalizadas de conservación y seguridad.

## Parada de camino

Guadix se incluye como **opcional**, únicamente para el itinerario por A-4 → A-44 → A-308 → A-92 hacia Tabernas/Almería. Comparación con OpenStreetMap/OSRM el 8 de octubre: Fuenlabrada → San José frente al mismo recorrido pasando por el centro de Guadix; diferencia aproximada de 8,4 minutos de conducción. No incluye la visita, búsqueda de aparcamiento, tráfico ni desvío adicional al barrio de cuevas. En la ficha se redondea a unos diez minutos y se explica que se omita si el navegador elige otra ruta. Se han excluido Úbeda/Baeza y Granada como paradas supuestamente sin desvío.

## Coordenadas y fotografías

Las coordenadas proceden de las fichas oficiales cuando se citan a continuación, y de los artículos georreferenciados de Wikipedia en los demás casos. La Amatista usa la posición en grados/minutos/segundos de Turismo Níjar. Para el sendero de Tabernas el punto es una **referencia de llegada al entorno de Oasys**, georreferenciada en Wikipedia; el inicio real debe buscarse en el panel municipal indicado por la topoguía. Para las salinas se marca el conjunto, no un aparcamiento. Guadix se marca en el centro de la ciudad, no en el mirador Padre Poveda. Estas diferencias se explican en los consejos.

Cada foto se comprobó con MediaWiki imageinfo (URL, descripción, autor y licencia), se descargó a public/images/almeria-cabo-de-gata y conserva la página de Commons y atribución en el JSON. La atribución se muestra sobre la foto con el estilo de figcaption ya existente. No se han generado imágenes ni sustituido una fotografía por otra localidad.

Las rutas de imágenes locales se resuelven con la base pública de Vite: funcionan tanto desde la raíz de Sites como desde la subcarpeta de GitHub Pages. Las URL externas mantienen su valor original.

| Lugar | Fuente principal de descripción y visita | Coordenadas | Fotografía y licencia |
| --- | --- | --- | --- |
| San José | [Fuente](https://turismonijar.es/descubre/pueblos/san-jose/) | [Coordenadas](https://es.wikipedia.org/wiki/San_Jos%C3%A9_(Almer%C3%ADa)) | [Benreis · CC BY-SA 3.0](https://commons.wikimedia.org/wiki/File:San_Jos%C3%A9,_en_el_municipio_de_N%C3%ADjar_(Almer%C3%ADa,_Espa%C3%B1a).jpg) |
| Playa de los Genoveses | [Fuente](https://turismonijar.es/descubre/playas/playa-los-genoveses/) | [Coordenadas](https://es.wikipedia.org/wiki/Playa_de_los_Genoveses) | [isol · CC BY-SA 3.0](https://commons.wikimedia.org/wiki/File:Panor%C3%A1mica_-_Playa_de_los_Genoveses_-_panoramio.jpg) |
| Playa de Mónsul | [Fuente](https://turismonijar.es/descubre/playas/playa-cala-de-monsul/) | [Coordenadas](https://es.wikipedia.org/wiki/Ensenada_de_M%C3%B3nsul) | [Nikater · CC BY-SA 3.0](https://commons.wikimedia.org/wiki/File:K%C3%BCste_bei_Monsul14.jpg) |
| San Miguel de Cabo de Gata | [Fuente](https://www.turismodealmeria.org/wp-content/uploads/2022/03/folleto-cabo-de-gata.pdf) | [Coordenadas](https://es.wikipedia.org/wiki/Cabo_de_Gata_(localidad)) | [Urci dream · CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:Plaza_de_la_Iglesia_de_Cabo_de_Gata_(2).jpg) |
| Faro de Cabo de Gata y Arrecife de las Sirenas | [Fuente](https://turismonijar.es/experiencias/miradores/las-sirenas/) | [Coordenadas](https://es.wikipedia.org/wiki/Faro_del_Cabo_de_Gata) | [Benreis · CC BY-SA 3.0](https://commons.wikimedia.org/wiki/File:Faro_de_Cabo_de_Gata.JPG) |
| Salinas de Cabo de Gata | [Fuente](https://www.juntadeandalucia.es/medioambiente/portal/web/ventanadelvisitante/detalle-buscador-mapa/-/asset_publisher/Jlbxh2qB3NwR/content/salinas-cabo-de-gata-5/255035) | [Coordenadas](https://es.wikipedia.org/wiki/Salinas_de_Cabo_de_Gata) | [Pamelaestertorres · CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:Lugares_m%C3%A1gicos_del_Cabo_de_Gata_13,_Las_Salinas.jpg) |
| Los Escullos y castillo de San Felipe | [Fuente](https://turismonijar.es/descubre/pueblos/los-escullos/) | [Coordenadas](https://es.wikipedia.org/wiki/Los_Escullos) | [Nikater · CC BY-SA 3.0](https://commons.wikimedia.org/wiki/File:Castillo_San_Felipe07.jpg) |
| La Isleta del Moro | [Fuente](https://turismonijar.es/descubre/pueblos/isleta-del-moro/) | [Coordenadas](https://es.wikipedia.org/wiki/La_Isleta_del_Moro) | [José Juan Sánchez · CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:La_Isleta_del_Moro.jpg) |
| Mirador de La Amatista | [Fuente](https://turismonijar.es/experiencias/miradores/la-amatista/) | [Coordenadas](https://turismonijar.es/experiencias/miradores/la-amatista/) | [Benreis · CC BY-SA 3.0](https://commons.wikimedia.org/wiki/File:Mirador_de_la_Amatista.JPG) |
| Rodalquilar y entorno minero | [Fuente](https://turismonijar.es/descubre/pueblos/rodalquilar/) | [Coordenadas](https://es.wikipedia.org/wiki/Rodalquilar) | [Veinticuatro de Jahén · CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:Rodalquilar_24J_02.jpg) |
| El Playazo de Rodalquilar | [Fuente](https://turismonijar.es/descubre/playas/playa-el-playazo-de-rodalquilar/) | [Coordenadas](https://es.wikipedia.org/wiki/Playazo_de_Rodalquilar) | [Sofía Cos · CC BY-SA 3.0](https://commons.wikimedia.org/wiki/File:El_Playazo,_Rodalquilar.JPG) |
| Las Negras | [Fuente](https://turismonijar.es/descubre/pueblos/las-negras/) | [Coordenadas](https://es.wikipedia.org/wiki/Las_Negras) | [ferran_casarramona · CC BY-SA 2.0](https://commons.wikimedia.org/wiki/File:Las_Negras_desde_el_Cerro_Negro.jpg) |
| Agua Amarga | [Fuente](https://turismonijar.es/descubre/pueblos/agua-amarga/) | [Coordenadas](https://es.wikipedia.org/wiki/Agua_Amarga) | [Ziegler175 · CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:Alm10AguaAmarga0.jpg) |
| Playa de los Muertos | [Fuente](https://turismocarboneras.es/descubre/playas/) | [Coordenadas](https://es.wikipedia.org/wiki/Playa_de_los_Muertos_(Carboneras)) | [Millars · CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:Playa_de_los_Muertos_11.jpg) |
| Villa de Níjar | [Fuente](https://turismonijar.es/descubre/pueblos/nijar/) | [Coordenadas](https://es.wikipedia.org/wiki/N%C3%ADjar) | [Urci dream · CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:Calle_de_la_Villa_de_N%C3%ADjar.jpg) |
| Cortijo del Fraile | [Fuente](https://turismonijar.es/experiencias/senderos/albaricoques-coertijo-del-fraile-rodalquilar/) | [Coordenadas](https://es.wikipedia.org/wiki/Cortijo_del_Fraile) | [Ventura Carmona · CC BY-SA 3.0](https://commons.wikimedia.org/wiki/File:El_Cortijo_del_Fraile.jpg) |
| Desierto de Tabernas · sendero PR-A 269 | [Fuente](https://www.tabernasturismo.com/attachments/secciones_pagina/31/es/99f8b58f6d361e29a700b4ea5.pdf) | [Coordenadas](https://es.wikipedia.org/wiki/Oasys_MiniHollywood) | [Rabealga · CC BY-SA 3.0](https://commons.wikimedia.org/wiki/File:Desierto_de_Tabernas.JPG) |
| Castillo de Tabernas | [Fuente](https://www.tabernasturismo.com/en/tb/monumentos-tabernas) | [Coordenadas](https://es.wikipedia.org/wiki/Castillo_de_Tabernas) | [Araceli Merino · CC BY-SA 3.0](https://commons.wikimedia.org/wiki/File:Tabernas_castell.jpg) |
| Fort Bravo · Texas Hollywood | [Fuente](https://fortbravo.org/) | [Coordenadas](https://en.wikipedia.org/wiki/Texas_Hollywood) | [REVUpminster · CC BY-SA 3.0](https://commons.wikimedia.org/wiki/File:Fort_Bravo_Texas_Hollywood_September_2013.JPG) |
| Guadix · casco histórico y barrio de cuevas | [Fuente](https://guadix.es/turismo/barrio-de-cuevas/) | [Coordenadas](https://es.wikipedia.org/wiki/Guadix) | [Gordito1869 · CC BY 3.0](https://commons.wikimedia.org/wiki/File:Guadix_H%C3%B6hlenwohnungen.jpg) |

La topoguía PR-A 269 estima 8,6 km y tres horas sin paradas; su edición es de 2010, por lo que la ficha exige verificar el estado actual del recorrido y no garantiza que los pasos descritos continúen abiertos.

## Validación del cambio

- `pnpm validate:data`: 2 viajes, 7 categorías, 74 lugares; sin duplicados.
- `pnpm typecheck` y `pnpm build`: completados correctamente.
- Los 20 enlaces de Meteoblue se contrastaron con los GeoNames esperados y se comprobó el rechazo de resultados de un homónimo lejano.
- Revisión en navegador de selección de viaje, mapa de Almería/Guadix, listado de 20 lugares, foto/crédito, previsión de San José, favoritos y diseño móvil a 390 × 844. Los estados temporales usados para la prueba se revirtieron.
- Compilación con `VITE_BASE_PATH=/app_viajes_personal/` y prueba en navegador de la fotografía de San José: carga desde la subcarpeta con 1280 píxeles de ancho. La publicación automática existente de GitHub Pages completó validación, compilación y despliegue para el primer commit del viaje.
- `pnpm lint`: no se pudo ejecutar; la política de Control de aplicaciones de Windows bloquea el componente nativo de Oxlint. No se han desactivado protecciones ni cambiado las dependencias del repositorio.
