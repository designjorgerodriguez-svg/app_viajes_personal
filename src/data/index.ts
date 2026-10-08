import categoriesJson from './categories.json'
import tripsJson from './trips/index.json'
import frenchBasqueCountryJson from './trips/pais-vasco-frances.json'
import almeriaCaboDeGataJson from './trips/almeria-cabo-de-gata.json'
import type { Category, TripData, TripSummary } from '../types/data'

export const categories = categoriesJson as Category[]
export const trips = tripsJson as TripSummary[]

export const tripDataById: Record<string, TripData> = {
  'pais-vasco-frances': frenchBasqueCountryJson as TripData,
  'almeria-cabo-de-gata': almeriaCaboDeGataJson as TripData,
}

export const categoryById = Object.fromEntries(
  categories.map((category) => [category.id, category]),
) as Record<string, Category>
