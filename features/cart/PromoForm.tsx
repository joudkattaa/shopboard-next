"use client"

import { useState } from 'react'

interface PromoFormProps {
  appliedCode: string
  onApply: (value: string) => void
}

export default function PromoForm({ appliedCode, onApply }: PromoFormProps) {
  const [value, setValue] = useState(appliedCode)
  const [error, setError] = useState('')
  return (
    <form
      className="my-5 [&_label]:mb-2 [&_label]:block [&_label]:text-xs [&_input]:min-h-11 [&_input]:min-w-0 [&_input]:flex-1 [&_input]:rounded-lg [&_input]:border [&_input]:border-border [&_input]:bg-card [&_input]:px-3 [&_input]:py-2.5 dark:[&_input]:bg-background"
      onSubmit={(event) => {
        event.preventDefault()
        if (appliedCode) {
          onApply('')
          setValue('')
          setError('Discount removed.')
          return
        }
        const code = value.trim().toUpperCase()
        if (code !== 'GLOW20') {
          setError('That code is not available. Try GLOW20.')
          return
        }
        setError('')
        onApply(code)
      }}
    >
      <label htmlFor="promo-code">Have a little treat? Enter your code.</label>
      <div className="flex flex-wrap gap-2.5">
        <input
          id="promo-code"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          readOnly={Boolean(appliedCode)}
          aria-describedby="promo-status"
          maxLength={20}
          autoComplete="off"
          placeholder="GLOW20"
        />
        <button className="min-h-11 rounded-lg border border-border bg-card px-5 py-3 text-xs font-semibold text-[var(--rose-dark)] dark:bg-background" type="submit">
          {appliedCode ? 'REMOVE' : 'APPLY'}
        </button>
      </div>
      <p id="promo-status" className="mt-3 min-h-[2.5em] text-xs text-[var(--rose-dark)]" role="status">
        {error ||
          (appliedCode ? 'GLOW20 applied — enjoy 20% off your items.' : '')}
      </p>
    </form>
  )
}
