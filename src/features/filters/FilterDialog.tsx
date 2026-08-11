import { Check, CircleDashed, RotateCcw, Star, X } from 'lucide-react'
import { CategoryIcon } from '../../components/categories/CategoryIcon'
import { categories } from '../../data'
import type { PlaceFilters } from './placeFilters'

interface FilterDialogProps {
  filters: PlaceFilters
  onChange: (filters: PlaceFilters) => void
  onClose: () => void
}

export function FilterDialog({ filters, onChange, onClose }: FilterDialogProps) {
  const toggleCategory = (categoryId: string) => {
    onChange({
      ...filters,
      categoryIds: filters.categoryIds.includes(categoryId)
        ? filters.categoryIds.filter((id) => id !== categoryId)
        : [...filters.categoryIds, categoryId],
    })
  }

  return (
    <div className="dialog-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        aria-labelledby="filter-dialog-title"
        aria-modal="true"
        className="trip-dialog filter-dialog"
        onMouseDown={(event) => event.stopPropagation()}
        role="dialog"
      >
        <header className="dialog-header">
          <div>
            <span className="eyebrow">Mostrar en el mapa</span>
            <h2 id="filter-dialog-title">Filtros</h2>
          </div>
          <button className="icon-button icon-button--ghost" onClick={onClose} type="button" aria-label="Cerrar filtros">
            <X size={20} />
          </button>
        </header>

        <div className="quick-filter-options" aria-label="Filtros rápidos">
          <button
            className="quick-filter"
            data-active={filters.favoritesOnly}
            onClick={() => onChange({ ...filters, favoritesOnly: !filters.favoritesOnly })}
            aria-pressed={filters.favoritesOnly}
            type="button"
          >
            <Star size={18} fill={filters.favoritesOnly ? 'currentColor' : 'none'} />
            <span>Solo favoritos</span>
            {filters.favoritesOnly ? <Check size={17} /> : null}
          </button>
          <button
            className="quick-filter"
            data-active={filters.unvisitedOnly}
            onClick={() => onChange({ ...filters, unvisitedOnly: !filters.unvisitedOnly })}
            aria-pressed={filters.unvisitedOnly}
            type="button"
          >
            <CircleDashed size={18} />
            <span>Por visitar</span>
            {filters.unvisitedOnly ? <Check size={17} /> : null}
          </button>
        </div>

        <div className="filter-options" aria-label="Categorías">
          {categories.map((category) => {
            const active = filters.categoryIds.includes(category.id)
            return (
              <button
                className="filter-option"
                data-active={active}
                key={category.id}
                onClick={() => toggleCategory(category.id)}
                type="button"
              >
                <span className="filter-option__icon" style={{ color: category.color }}>
                  <CategoryIcon category={category} size={19} />
                </span>
                <span>{category.label}</span>
                {active ? <Check size={17} /> : null}
              </button>
            )
          })}
        </div>

        <div className="dialog-actions">
          <button
            className="secondary-button secondary-button--inline"
            onClick={() => onChange({ query: '', categoryIds: [], favoritesOnly: false, unvisitedOnly: false })}
            type="button"
          >
            <RotateCcw size={17} /> Limpiar
          </button>
          <button className="primary-button" onClick={onClose} type="button">Ver resultados</button>
        </div>
      </section>
    </div>
  )
}
