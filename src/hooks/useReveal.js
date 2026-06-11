import { useEffect, useRef } from 'react'

// Scroll-into-view reveal without an animation library: an IntersectionObserver
// flips one class, CSS transitions do the rest, and the global reduced-motion
// override makes it instant for users who opt out. Pair with className="reveal".
export function useReveal() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      el.classList.add('reveal-in')
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('reveal-in')
          io.disconnect()
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -30px 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return ref
}
