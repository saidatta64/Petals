import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

interface Option {
  label: string
  value: string | number
}

interface SelectProps {
  value: string | number
  onChange: (value: any) => void
  options: Option[]
  placeholder?: string
}

export default function Select({ value, onChange, options, placeholder }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find((opt) => opt.value === value)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative w-full" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-workspace-bg border border-workspace-border text-workspace-text rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-workspace-primary/50 transition-shadow flex items-center justify-between"
      >
        <span>{selectedOption ? selectedOption.label : placeholder || 'Select...'}</span>
        <ChevronDown
          size={16}
          className={`text-workspace-text-secondary transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-workspace-card border border-workspace-border rounded-xl shadow-glass-card overflow-hidden py-1 max-h-60 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value)
                setIsOpen(false)
              }}
              className={`w-full text-left px-4 py-2 text-sm transition-colors hover:bg-workspace-bg ${
                value === option.value
                  ? 'text-workspace-primary bg-workspace-primary/10'
                  : 'text-workspace-text'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
