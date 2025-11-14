// useClickOutside.ts
import { onMounted, onBeforeUnmount, unref } from 'vue'
import type { Ref } from 'vue'

export default function useClickOutside(
  target: Ref<HTMLElement | null>,
  callback: () => void
) {
  const listener = (e: Event) => {
    const el = unref(target)
    if (!el) return

    // If click is inside the element, ignore
    // composedPath fallback for older browsers
    const path = (e as any).composedPath?.() as EventTarget[] | undefined
    if (el === e.target || (path && path.includes(el)) || (e.target instanceof Node && el.contains(e.target as Node))) {
      return
    }

    callback?.()
  }

  onMounted(() => {
    window.addEventListener('pointerdown', listener, { passive: true })
  })

  onBeforeUnmount(() => {
    window.removeEventListener('pointerdown', listener)
  })

  // optional manual cleanup
  return () => window.removeEventListener('pointerdown', listener)
}
