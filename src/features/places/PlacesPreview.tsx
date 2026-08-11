import { Heart, MapPin, Search, SlidersHorizontal, Trees, Waves } from 'lucide-react'

const cards = [
  {
    name: 'Rocher de la Vierge',
    place: 'Biarritz',
    category: 'Monumento',
    tone: 'terracotta',
    note: 'Perros con condiciones',
    icon: MapPin,
  },
  {
    name: 'Plage du Centre',
    place: 'Bidart',
    category: 'Playa',
    tone: 'blue',
    note: 'Consulta las condiciones',
    icon: Waves,
  },
  {
    name: 'Bosque de Ahetze',
    place: 'Ahetze',
    category: 'Naturaleza',
    tone: 'green',
    note: 'Sin información sobre perros',
    icon: Trees,
  },
]

export function PlacesPreview() {
  return (
    <section className="content-screen">
      <header className="content-header">
        <span className="eyebrow">En el mapa ahora</span>
        <h1>Lugares</h1>
        <p>3 lugares visibles en la zona de Biarritz y Bidart.</p>
      </header>

      <div className="content-toolbar">
        <label className="search-field search-field--page">
          <Search size={19} aria-hidden="true" />
          <input type="search" placeholder="Buscar por nombre" />
        </label>
        <button className="filter-button filter-button--square" type="button" aria-label="Abrir filtros">
          <SlidersHorizontal size={19} />
        </button>
      </div>

      <div className="active-filter-row" aria-label="Filtros activos">
        <button type="button" data-active="true">Todos</button>
        <button type="button">Costa</button>
        <button type="button">Naturaleza</button>
      </div>

      <div className="place-list">
        {cards.map(({ name, place, category, tone, note, icon: Icon }) => (
          <article className="place-card" key={name}>
            <div className={`place-card__visual place-card__visual--${tone}`} aria-hidden="true">
              <Icon size={25} />
            </div>
            <div className="place-card__content">
              <span className={`category-label category-label--${tone}`}>{category}</span>
              <h2>{name}</h2>
              <p>{place}</p>
              <span className="place-card__note">{note}</span>
            </div>
            <button className="icon-button icon-button--ghost" type="button" aria-label={`Añadir ${name} a favoritos`}>
              <Heart size={19} />
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}
