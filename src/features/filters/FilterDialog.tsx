import { Check, Heart, RotateCcw, X } from 'lucide-react'
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

        <button
          className="favorite-filter"
          data-active={filters.favoritesOnly}
          onClick={() => onChange({ ...filters, favoritesOnly: !filters.favoritesOnly })}
          type="button"
        >
          <Heart size={18} fill={filters.favoritesOnly ? 'currentColor' : 'none'} />
          Solo favoritos
          {filters.favoritesOnly ? <Check size={17} /> : null}
        </button>

        <div className="dialog-actions">
          <button
            className="secondary-button secondary-button--inline"
            onClick={() => onChange({ query: '', categoryIds: [], favoritesOnly: false })}
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
