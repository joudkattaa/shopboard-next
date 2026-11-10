import type { ReactNode, Ref } from 'react'

interface SearchFieldProps {
  children?: ReactNode
  id: string
  label: string
  value: string
  placeholder: string
  inputRef?: Ref<HTMLInputElement>
  onChange: (value: string) => void
}

export default function SearchField({
  id,
  label,
  value,
  placeholder,
  inputRef,
  onChange,
  children,
}: SearchFieldProps) {
  const input = (
    <input
      className="min-h-11 min-w-0 rounded-lg border border-[var(--discovery-input-border)] bg-background px-3 py-2.5 text-base text-muted-foreground placeholder:text-[var(--footer-placeholder)] dark:border-border dark:placeholder:text-muted-foreground"
      ref={inputRef}
      id={id}
      name="query"
      type="search"
      enterKeyHint="search"
      autoCapitalize="none"
      autoCorrect="off"
      autoComplete="off"
      placeholder={placeholder}
      value={value}
      aria-controls={id === "catalog-search" ? "product-grid" : undefined}
      onChange={(event) => onChange(event.target.value)}
    />
  )
  return (
    <>
      <label htmlFor={id}>{label}</label>
      {children ? (
        <div className="flex min-w-0 flex-wrap gap-2.5 [&_input]:flex-1">
          {input}
          {children}
        </div>
      ) : (
        input
      )}
    </>
  )
}
