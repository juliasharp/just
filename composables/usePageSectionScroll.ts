export function usePageSectionScroll() {
  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

  function initSectionScroll(sectionSelectors: string[]) {
    if (typeof window === 'undefined' || prefersReduced) return

    // Find all sections
    const sections = sectionSelectors
      .map(selector => document.querySelector<HTMLElement>(selector))
      .filter(Boolean) as HTMLElement[]

    if (!sections.length) return

    // Add will-change for smoother transitions
    sections.forEach((section) => {
      section.style.willChange = 'transform'
    })
  }

  function cleanup() {
    // Cleanup if needed
  }

  return {
    initSectionScroll,
    cleanup
  }
}
