import {
  Building2,
  Droplets,
  House,
  Landmark,
  Mountain,
  Trees,
  Waves,
  type LucideProps,
} from 'lucide-react'
import type { Category } from '../../types/data'

const icons = { Building2, Droplets, House, Landmark, Mountain, Trees, Waves }

interface CategoryIconProps extends LucideProps {
  category: Category
}

export function CategoryIcon({ category, ...props }: CategoryIconProps) {
  const Icon = icons[category.icon as keyof typeof icons] ?? Landmark
  return <Icon {...props} />
}
