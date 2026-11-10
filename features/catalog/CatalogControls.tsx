"use client"

import { useEffect, useRef, useState } from 'react'
import type { CatalogFilters } from '@/features/catalog/DiscoveryProvider'
import {
  isCategory,
  isSortOrder,
  productCategories,
} from '@/features/catalog/products.logic'
import SearchField from '@/features/catalog/SearchField'

interface CatalogControlsProps {
  filters: CatalogFilters
  onChange: (filters: CatalogFilters) => void
}

const tools = [
  { id: 'search', label: 'Search products', icon: 'search' },
  { id: 'category', label: 'All categories', icon: 'filter' },
  { id: 'sort', label: 'Sort products by price', icon: 'sort' },
]

export default function CatalogControls({
  filters,
  onChange,
}: CatalogControlsProps) {
  const [open, setOpen] = useState<string | null>(null)
  const root = useRef<HTMLFormElement>(null)
  const trigger = useRef<HTMLElement | null>(null)
  useEffect(() => {
    if (!open) return
    // Scoped DOM access is for native control focus only; React owns rendering.
    root.current
      ?.querySelector<HTMLElement>('details[open] input, details[open] select')
      ?.focus()
    function outside(event: PointerEvent) {
      if (
        !(event.target instanceof Node) ||
        root.current?.contains(event.target)
      )
        return
      const restore = root.current?.contains(document.activeElement)
      setOpen(null)
      if (restore) trigger.current?.focus()
    }
    document.addEventListener('pointerdown', outside)
    return () => document.removeEventListener('pointerdown', outside)
  }, [open])
  return (
    <form
      ref={root}
      id="catalog-controls"
      className="flex min-h-11 w-full max-w-full flex-wrap items-center gap-2.5"
      role="search"
      aria-label="Filter the collection"
      onSubmit={(event) => event.preventDefault()}
      onKeyDown={(event) => {
        if (event.key === 'Escape' && open) {
          event.preventDefault()
          event.stopPropagation()
          setOpen(null)
          trigger.current?.focus()
        }
      }}
    >
      {tools.map((tool) => (
        <details
          key={tool.id}
          className="shrink-0 open:flex open:min-w-0 open:max-w-[360px] open:flex-[1_1_280px] open:items-center open:gap-2.5 [&[open]::details-content]:contents"
          open={open === tool.id}
        >
          <summary
            className="grid size-11 shrink-0 cursor-pointer list-none place-items-center rounded-full border border-[var(--discovery-control-border)] bg-[var(--discovery-control-bg)] text-[var(--rose-dark)] hover:bg-[var(--discovery-control-hover)] [[open]>&]:border-[var(--rose-dark)] [[open]>&]:bg-[var(--rose-dark)] [[open]>&]:text-white [&::-webkit-details-marker]:hidden dark:border-border dark:bg-background dark:text-primary dark:[[open]>&]:bg-primary dark:[[open]>&]:text-primary-foreground"
            aria-label={tool.label}
            title={tool.label}
            onClick={(event) => {
              event.preventDefault()
              trigger.current = event.currentTarget
              setOpen((current) => (current === tool.id ? null : tool.id))
            }}
          >
            <svg className="size-[18px] fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{tool.icon === "search" ? <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></> : <path d={tool.icon === "filter" ? "M4 5h16l-6 7v6l-4 2v-8L4 5Z" : "M8 4v16m-4-4 4 4 4-4M16 20V4m-4 4 4-4 4 4"} />}</svg>
          </summary>
          <div
            className="min-w-0 flex-1 [&_label]:sr-only [&_input]:w-full [&_select]:w-full [&_select]:min-h-11 [&_select]:min-w-0 [&_select]:rounded-lg [&_select]:border [&_select]:border-[var(--discovery-input-border)] [&_select]:bg-background [&_select]:px-3 [&_select]:py-2.5 [&_select]:text-base [&_select]:text-muted-foreground dark:[&_select]:border-border"
          >
            {tool.id === 'search' ? (
              <SearchField
                id="catalog-search"
                label="Search products"
                placeholder="Find your next little luxury"
                value={filters.query}
                onChange={(query) =>
                  onChange({ ...filters, query, featured: false })
                }
              />
            ) : tool.id === 'category' ? (
              <>
                <label htmlFor="category-select">All Categories</label>
                <select
                  id="category-select"
                  name="category"
                  value={filters.category}
                  aria-controls="product-grid"
                  onChange={(event) => {
                    const category = event.target.value
                    if (isCategory(category))
                      onChange({ ...filters, category, featured: false })
                  }}
                >
                  <option value="All">All Categories</option>
                  {productCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </>
            ) : (
              <>
                <label htmlFor="price-sort">Sort by</label>
                <select
                  id="price-sort"
                  name="sort"
                  value={filters.sort}
                  aria-controls="product-grid"
                  onChange={(event) => {
                    const sort = event.target.value
                    if (isSortOrder(sort))
                      onChange({ ...filters, sort, featured: false })
                  }}
                >
                  <option value="default">Default</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </>
            )}
          </div>
        </details>
      ))}
    </form>
  )
}
