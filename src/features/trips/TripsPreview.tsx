import { CalendarDays, ChevronRight, Map, MapPin, Plus } from 'lucide-react'

export function TripsPreview() {
  return (
    <section className="content-screen">
      <header className="content-header content-header--with-action">
        <div>
          <span className="eyebrow">Tu colección</span>
          <h1>Viajes</h1>
          <p>Los próximos viajes y los recuerdos que ya recorriste.</p>
        </div>
        <span className="private-pill">Privado</span>
      </header>

      <h2 className="section-title">Próximos</h2>
      <article className="trip-card">
        <div className="trip-card__map" aria-hidden="true">
          <Map size={30} />
          <span className="mini-marker mini-marker--one"><MapPin size={14} /></span>
          <span className="mini-marker mini-marker--two"><MapPin size={14} /></span>
        </div>
        <div className="trip-card__body">
          <span className="status-pill">Viaje activo</span>
          <h2>País Vasco Francés</h2>
          <p><CalendarDays size={15} /> Agosto 2026</p>
          <span>El contenido demo se añadirá en la siguiente fase.</span>
        </div>
        <button className="icon-button icon-button--ghost" type="button" aria-label="Abrir viaje">
          <ChevronRight size={21} />
        </button>
      </article>

      <div className="repo-note">
        <span><Plus size={18} /></span>
        <div>
          <strong>Los viajes se añaden desde el proyecto</strong>
          <p>Así la aplicación se mantiene limpia y tus datos son fáciles de revisar.</p>
        </div>
      </div>
    </section>
  )
}
