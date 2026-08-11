import { Heart, MapPinned } from 'lucide-react'

export function FavoritesPreview() {
  return (
    <section className="content-screen content-screen--centerable">
      <header className="content-header">
        <span className="eyebrow">País Vasco Francés</span>
        <h1>Favoritos</h1>
        <p>Guarda aquí los lugares que no quieres perderte.</p>
      </header>

      <div className="empty-state">
        <span className="empty-state__icon" aria-hidden="true">
          <Heart size={27} />
        </span>
        <h2>Tu próxima parada favorita</h2>
        <p>Marca un lugar con el corazón y aparecerá en esta lista.</p>
        <button className="secondary-button" type="button">
          <MapPinned size={18} /> Explorar lugares
        </button>
      </div>
    </section>
  )
}
