import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
}

export default function Card({ children, className = '', onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-light-surface dark:bg-dark-surface rounded-card p-6 border border-light-border dark:border-dark-border shadow-sm hover:shadow-md transition-shadow ${className}`}
    >
      {children}
    </div>
  )
}
