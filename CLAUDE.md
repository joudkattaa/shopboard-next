# ROSEVEIL UI rules

- Preserve ROSEVEIL colors and typography. Prefer semantic utilities: bg-background, text-foreground, bg-primary, text-primary-foreground, border-border, text-muted-foreground. Raw palette utilities are for intentional brand decoration.
- Body: font-sans, DM Sans 400/500/600/700. Headings: font-heading, Cormorant Garamond 400/500/600. Do not substitute fonts or request unsupported weights.
- Keep all authored CSS in app/globals.css. Use Tailwind utilities in components; do not create component stylesheets.
- Reuse and compose the existing Base UI shadcn components without regenerating them. Retain accessible names, labels, keyboard behavior, and dialog semantics.
- Preserve visible keyboard focus: 2px semantic ring with 4px offset. Label inputs, communicate errors with text, respect reduced motion, and aim for 44px touch targets. Check contrast in both themes; decorative palette and chart aliases are not automatically suitable for body text.
- Use mobile-first responsive layouts with wrapping and no horizontal overflow. Original gutters: 16px, 24px at 480px, 40px at 900px, plus safe-area insets.
- Source radii are component-specific. Named xs/sm/md/lg/xl/2xl/3xl/4xl map to 2/3/5/8/10/16/20/32px. Exact uniform source values use rounded-roseveil-*; petal/editorial tokens preserve original asymmetric shapes. Preserve other source corner combinations when their components are migrated.
- Dark mode uses html[data-theme="dark"] and dark: utilities, never a .dark class. Server markup defaults explicitly to light. A future provider must synchronize saved/system preference safely; do not read browser storage during render or suppress hydration warnings.
- This phase provides foundations only. The starter page retains explicit demo colors; page styling and product features require their own approved phase.
