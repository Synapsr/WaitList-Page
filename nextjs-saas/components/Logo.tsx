interface LogoProps {
  variant?: number
  color: string
  size?: number
}

export function Logo({ variant = 1, color, size = 64 }: LogoProps) {
  const getLogo = () => {
    const normalizedVariant = ((variant - 1) % 10) + 1
    
    switch (normalizedVariant) {
      case 1:
        // Cube moderne
        return (
          <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="12" y="20" width="24" height="24" rx="4" fill={color} opacity="0.9"/>
            <rect x="20" y="12" width="24" height="24" rx="4" fill={color} opacity="0.6"/>
            <rect x="28" y="28" width="24" height="24" rx="4" fill={color}/>
          </svg>
        )
      case 2:
        // Cercle avec gradient
        return (
          <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="32" cy="32" r="24" fill={color} opacity="0.2"/>
            <circle cx="32" cy="32" r="16" fill={color} opacity="0.5"/>
            <circle cx="32" cy="32" r="8" fill={color}/>
          </svg>
        )
      case 3:
        // Flèche moderne
        return (
          <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M32 8L48 32H38L40 48L32 40L24 48L26 32H16L32 8Z" fill={color}/>
          </svg>
        )
      case 4:
        // Hexagone
        return (
          <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M32 8L48 18V38L32 48L16 38V18L32 8Z" fill={color} opacity="0.8"/>
            <path d="M32 16L42 22V34L32 40L22 34V22L32 16Z" fill={color}/>
          </svg>
        )
      case 5:
        // Lignes parallèles
        return (
          <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="12" y="16" width="40" height="6" rx="3" fill={color} opacity="0.9"/>
            <rect x="12" y="29" width="40" height="6" rx="3" fill={color} opacity="0.7"/>
            <rect x="12" y="42" width="40" height="6" rx="3" fill={color}/>
          </svg>
        )
      case 6:
        // Étoile moderne
        return (
          <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M32 8L36 24L52 24L40 34L44 50L32 40L20 50L24 34L12 24L28 24L32 8Z" fill={color}/>
          </svg>
        )
      case 7:
        // Cercle avec barres
        return (
          <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="32" cy="32" r="20" fill={color} opacity="0.2"/>
            <rect x="20" y="30" width="24" height="4" rx="2" fill={color}/>
            <rect x="20" y="38" width="18" height="4" rx="2" fill={color} opacity="0.7"/>
          </svg>
        )
      case 8:
        // Triangle empilé
        return (
          <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M32 12L52 44H12L32 12Z" fill={color} opacity="0.6"/>
            <path d="M32 20L44 40H20L32 20Z" fill={color} opacity="0.8"/>
            <path d="M32 28L36 36H28L32 28Z" fill={color}/>
          </svg>
        )
      case 9:
        // Grille moderne
        return (
          <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="12" y="12" width="16" height="16" rx="2" fill={color} opacity="0.8"/>
            <rect x="36" y="12" width="16" height="16" rx="2" fill={color} opacity="0.6"/>
            <rect x="12" y="36" width="16" height="16" rx="2" fill={color} opacity="0.6"/>
            <rect x="36" y="36" width="16" height="16" rx="2" fill={color}/>
          </svg>
        )
      case 10:
        // Vague moderne
        return (
          <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 32C8 32 16 24 32 24C48 24 56 32 56 32C56 32 48 40 32 40C16 40 8 32 8 32Z" fill={color} opacity="0.7"/>
            <path d="M8 40C8 40 16 32 32 32C48 32 56 40 56 40C56 40 48 48 32 48C16 48 8 40 8 40Z" fill={color}/>
          </svg>
        )
      default:
        // Cube moderne par défaut
        return (
          <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="12" y="20" width="24" height="24" rx="4" fill={color} opacity="0.9"/>
            <rect x="20" y="12" width="24" height="24" rx="4" fill={color} opacity="0.6"/>
            <rect x="28" y="28" width="24" height="24" rx="4" fill={color}/>
          </svg>
        )
    }
  }

  return getLogo()
}
