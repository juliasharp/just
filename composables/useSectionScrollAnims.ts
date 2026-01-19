import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

type PanelAnimOptions = {
  /** default: 'top 70%' */
  start?: string
  /** default: 'bottom top' */
  end?: string
  /** default: false */
  once?: boolean
  /** default: true */
  animateOnEnterBack?: boolean
  /** default: 24 */
  y?: number
  /** default: 0.8 */
  duration?: number
  /** default: 0.1 */
  staggerDelay?: number
}

export function useSectionScrollAnims() {
  const triggers: ScrollTrigger[] = []
  const timelines: gsap.core.Timeline[] = []

  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

  function ensureGsap() {
    if (process.client) gsap.registerPlugin(ScrollTrigger)
  }

  function killAll() {
    timelines.forEach((tl) => tl.kill())
    timelines.length = 0

    triggers.forEach((t) => t.kill())
    triggers.length = 0
  }

  /**
   * Animates any `.snap-panel` or `.snap-section` children inside `root`
   * that contain elements marked with data attributes:
   *  - [data-anim="media"]
   *  - [data-anim="copy"]
   *  - [data-anim="item"] (optional, stagger)
   */
  function initPanelAnims(root: HTMLElement, opts: PanelAnimOptions = {}) {
    ensureGsap()
    if (!root) return

    const {
      start = 'top 70%',
      end = 'bottom top',
      once = false,
      animateOnEnterBack = true,
      y = 24,
      duration = 0.8,
      staggerDelay = 0.08,
    } = opts

    const panels = Array.from(
      root.querySelectorAll<HTMLElement>('.snap-panel, .snap-section')
    )

    panels.forEach((panel) => {
      // If you only want to animate a subset, add data-animate="true"
      // and gate here. For now, we animate all panels.
      const media = panel.querySelector<HTMLElement>('[data-anim="media"]')
      const copy = panel.querySelector<HTMLElement>('[data-anim="copy"]')
      const items = Array.from(panel.querySelectorAll<HTMLElement>('[data-anim="item"]'))

      const targets: HTMLElement[] = []
      if (media) targets.push(media)
      if (copy) targets.push(copy)
      if (items.length) targets.push(...items)

      if (!targets.length) return

      if (prefersReduced) {
        gsap.set(targets, { clearProps: 'all' })
        return
      }

      // Initial state
      gsap.set(targets, { autoAlpha: 0, y })

      const tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } })

      // Media first, then copy, then staggered items
      if (media) tl.to(media, { autoAlpha: 1, y: 0, duration }, 0)
      if (copy) tl.to(copy, { autoAlpha: 1, y: 0, duration: duration * 0.9 }, 0.08)
      if (items.length) {
        tl.to(
          items,
          { autoAlpha: 1, y: 0, duration: duration * 0.75, stagger: staggerDelay },
          0.12
        )
      }

      timelines.push(tl)

      const st = ScrollTrigger.create({
        trigger: panel,
        start,
        end,
        once,
        onEnter: () => tl.play(),
        onEnterBack: () => {
          if (!animateOnEnterBack) return
          tl.restart()
        },
      })

      triggers.push(st)
    })
  }

  /**
   * Utility for v-for slides: pass a list of HTMLElements
   * and animate each individually. Great for ContentGrid slides.
   */
  function initElementsAnims(
    elements: HTMLElement[],
    opts: PanelAnimOptions = {}
  ) {
    ensureGsap()

    const {
      start = 'top 75%',
      end = 'bottom top',
      once = false,
      animateOnEnterBack = true,
      y = 24,
      duration = 0.75,
      staggerDelay = 0.08,
    } = opts

    elements.forEach((el) => {
      const media = el.querySelector<HTMLElement>('[data-anim="media"]')
      const copy = el.querySelector<HTMLElement>('[data-anim="copy"]')
      const items = Array.from(el.querySelectorAll<HTMLElement>('[data-anim="item"]'))

      const targets: HTMLElement[] = []
      if (media) targets.push(media)
      if (copy) targets.push(copy)
      if (items.length) targets.push(...items)

      if (!targets.length) return

      if (prefersReduced) {
        gsap.set(targets, { clearProps: 'all' })
        return
      }

      gsap.set(targets, { autoAlpha: 0, y })

      const tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } })
      if (media) tl.to(media, { autoAlpha: 1, y: 0, duration }, 0)
      if (copy) tl.to(copy, { autoAlpha: 1, y: 0, duration: duration * 0.9 }, 0.08)
      if (items.length) {
        tl.to(
          items,
          { autoAlpha: 1, y: 0, duration: duration * 0.75, stagger: staggerDelay },
          0.12
        )
      }

      timelines.push(tl)

      const st = ScrollTrigger.create({
        trigger: el,
        start,
        end,
        once,
        onEnter: () => tl.play(),
        onEnterBack: () => {
          if (!animateOnEnterBack) return
          tl.restart()
        },
      })

      triggers.push(st)
    })
  }

  return { initPanelAnims, initElementsAnims, killAll }
}