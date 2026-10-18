import { Fragment, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { content } from './data/content'
import { memories, type Memory } from './data/memories'

gsap.registerPlugin(ScrollTrigger)

const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`

function ArrowIcon({ diagonal = false }: { diagonal?: boolean }) {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={diagonal ? 'M5 19 19 5M7 5h12v12' : 'M4 12h15m-6-6 6 6-6 6'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
}

function AnimatedHeroTitle({ title }: { title: string }) {
  return <h1 id="hero-title" aria-label={title}>
    {title.split(' ').map((word, wordIndex) => <Fragment key={`${word}-${wordIndex}`}>
      {wordIndex > 0 && ' '}
      <span className="hero-word" aria-hidden="true">
        {Array.from(word).map((char, charIndex) => <span className="hero-char-clip" key={charIndex}><span className="hero-char">{char}</span></span>)}
      </span>
    </Fragment>)}
  </h1>
}

function PhotoSurface({ memory, eager = false }: { memory: Memory; eager?: boolean }) {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)

  return <div className={`photo-surface ${loaded ? 'is-loaded' : ''}`}>
    {!failed && <img src={asset(memory.src)} alt={memory.alt} loading={eager ? 'eager' : 'lazy'} decoding="async" onLoad={() => setLoaded(true)} onError={() => setFailed(true)} />}
    {!loaded && <div className="photo-placeholder" aria-hidden="true">
      <span className="placeholder-sun" />
      <span className="placeholder-horizon" />
      <span className="placeholder-label">Место для вашего фото</span>
      <span className="placeholder-number">{memory.id} / воспоминание</span>
    </div>}
  </div>
}

function PhotoCard({ memory, index, onOpen }: { memory: Memory; index: number; onOpen: (memory: Memory) => void }) {
  return <button className={`memory-card memory-card-${index % 4}`} data-memory-card type="button" onClick={() => onOpen(memory)} aria-label={`Открыть фото: ${memory.moment ?? memory.caption}`}>
    <div className="memory-card-paper">
      <div className="memory-card-image" style={memory.aspectRatio ? { aspectRatio: memory.aspectRatio } : undefined}><PhotoSurface memory={memory} /></div>
      <div className="memory-card-meta"><span>{memory.moment ?? `Момент ${memory.id}`}</span><span>↗</span></div>
      <p className="memory-card-caption">{memory.caption}</p>
    </div>
  </button>
}

function MemoryGallery({ onOpen }: { onOpen: (memory: Memory) => void }) {
  const chunks: Memory[][] = []
  for (let i = 0; i < memories.length; i += 3) chunks.push(memories.slice(i, i + 3))

  return <section id="story" className="gallery-section section-light" aria-labelledby="gallery-title">
    <div className="section-heading gallery-heading">
      <span className="eyebrow" data-reveal>{content.gallery.eyebrow}</span>
      <div className="heading-row"><h2 id="gallery-title" data-reveal>{content.gallery.title}</h2><span className="chapter-index" data-reveal>01 — {String(memories.length).padStart(2, '0')}</span></div>
      <p data-reveal>{content.gallery.intro}</p>
    </div>
    <div className="film-divider" aria-hidden="true"><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /></div>
    {chunks.map((chunk, groupIndex) => <div className="gallery-chapter" key={groupIndex}>
      <div className={`gallery-cluster gallery-cluster-${groupIndex % 3} gallery-cluster-count-${chunk.length}`}>
        {chunk.map((memory, index) => <PhotoCard key={memory.id} memory={memory} index={groupIndex * 3 + index} onOpen={onOpen} />)}
      </div>
      {(chunks.length > 3 ? groupIndex % 2 === 1 : true) && content.gallery.phrases[chunks.length > 3 ? Math.floor(groupIndex / 2) : groupIndex] && <blockquote className="memory-quote" data-reveal><span className="quote-mark">“</span>{content.gallery.phrases[chunks.length > 3 ? Math.floor(groupIndex / 2) : groupIndex]}</blockquote>}
    </div>)}
  </section>
}

function Gratitude() {
  return <section className="gratitude-section section-dark" aria-labelledby="gratitude-title">
    <div className="gratitude-glow" aria-hidden="true" />
    <div className="gratitude-inner">
      <span className="eyebrow eyebrow-gold" data-reveal>{content.gratitude.eyebrow}</span>
      <div className="gratitude-intro"><span className="small-star" aria-hidden="true">✳</span><p data-reveal>{content.gratitude.opening}</p></div>
      <h2 id="gratitude-title" data-reveal>{content.gratitude.title}</h2>
      <div className="gratitude-lines">{content.gratitude.lines.map((line, index) => <p className="gratitude-line" data-gratitude-line key={line}><span className="line-index">0{index + 1}</span><span>{line}</span></p>)}</div>
      <p className="gratitude-closing" data-reveal>{content.gratitude.closing}</p>
    </div>
  </section>
}

function LetterSection() {
  const [open, setOpen] = useState(false)
  const [opening, setOpening] = useState(false)
  const reducedMotion = useReducedMotion()
  const revealTimer = useRef<number | null>(null)
  const closeButton = useRef<HTMLButtonElement>(null)
  const triggerButton = useRef<HTMLButtonElement>(null)

  useEffect(() => () => { if (revealTimer.current !== null) window.clearTimeout(revealTimer.current) }, [])
  const closeLetter = () => { setOpen(false); setOpening(false) }
  const openLetter = () => {
    if (opening || open) return
    setOpening(true)
    revealTimer.current = window.setTimeout(() => setOpen(true), reducedMotion ? 0 : 700)
  }

  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') closeLetter() }
    window.addEventListener('keydown', onKeyDown)
    const focusTimer = window.setTimeout(() => closeButton.current?.focus(), 500)
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener('keydown', onKeyDown); window.clearTimeout(focusTimer); triggerButton.current?.focus() }
  }, [open])

  return <section id="letter" className="letter-section section-light" aria-labelledby="letter-title">
    <div className="letter-ambient letter-ambient-one" aria-hidden="true" /><div className="letter-ambient letter-ambient-two" aria-hidden="true" />
    <span className="eyebrow" data-reveal>{content.letter.eyebrow}</span>
    <h2 id="letter-title" data-reveal>{content.letter.prompt}</h2>
    <button ref={triggerButton} type="button" className={`envelope-button ${opening || open ? 'envelope-is-open' : ''}`} onClick={openLetter} aria-label="Открыть письмо для папы">
      <span className="envelope-shadow" />
      <span className="envelope-back" />
      <span className="envelope-letter-preview"><span>Для папы</span><span className="preview-line" /><span className="preview-line short" /></span>
      <span className="envelope-flap" />
      <span className="envelope-front" />
      <span className="envelope-seal">♥</span>
    </button>
    <p className="envelope-hint" data-reveal>{content.letter.hint} <span>↗</span></p>
    <AnimatePresence>
      {open && <motion.div className="letter-overlay" role="presentation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reducedMotion ? 0 : 0.35 }} onMouseDown={(event) => { if (event.target === event.currentTarget) closeLetter() }}>
        <motion.article role="dialog" aria-modal="true" aria-labelledby="open-letter-title" className="letter-paper" initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 100, rotate: -3, scale: 0.82 }} animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }} exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 70, rotate: 2, scale: 0.9 }} transition={reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 110, damping: 19, delay: 0.18 }}>
          <div className="letter-paper-header"><span>Письмо для тебя</span><button ref={closeButton} type="button" onClick={closeLetter} aria-label={content.letter.close}>×</button></div>
          <div className="letter-paper-content"><span className="letter-ornament">✳</span><h3 id="open-letter-title">{content.letter.salutation}</h3>{content.letter.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}<p className="letter-signoff">{content.letter.signoff}</p></div>
        </motion.article>
      </motion.div>}
    </AnimatePresence>
  </section>
}

function Finale({ onOpen }: { onOpen: (memory: Memory) => void }) {
  const collage = memories.filter((memory) => memory.inFinalCollage).slice(0, 6)
  return <section id="finale" className="finale-section section-dark" aria-labelledby="finale-title">
    <span className="eyebrow eyebrow-gold" data-reveal>{content.finale.eyebrow}</span>
    <div className="finale-stage">
      <div className="collage" aria-label="Коллаж семейных фотографий">
        {collage.map((memory, index) => <button type="button" className={`collage-photo collage-photo-${index}`} data-collage-photo key={memory.id} onClick={() => onOpen(memory)} aria-label={`Открыть фото: ${memory.moment ?? memory.caption}`}><PhotoSurface memory={memory} /><span className="sr-only">{memory.caption}</span></button>)}
      </div>
      <div className="finale-copy"><p className="finale-first" data-finale-line>{content.finale.first}</p><h2 id="finale-title" data-finale-line>{content.finale.second}</h2></div>
    </div>
    <div className="finale-bottom"><div className="finale-heart" aria-hidden="true">♥</div><p className="finale-greeting" data-reveal>{content.finale.greeting.includes('❤️') ? <>{content.finale.greeting.replace('❤️', '').trimEnd()}<span className="finale-inline-heart" role="img" aria-label="люблю">♥</span></> : content.finale.greeting}</p><p className="finale-signature" data-reveal>{content.finale.signature}</p><button className="replay-button" type="button" onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })}>{content.finale.replay}<ArrowIcon /></button></div>
    <footer><span>Сделано с любовью</span><span>Папа, спасибо за всё · ♡</span></footer>
  </section>
}

function MusicButton() {
  const [available, setAvailable] = useState(false)
  const [playing, setPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const musicUrl = asset('audio/music.mp3')

  useEffect(() => {
    const controller = new AbortController()
    fetch(musicUrl, { method: 'HEAD', signal: controller.signal }).then((response) => {
      setAvailable(response.ok && (response.headers.get('content-type') ?? '').startsWith('audio/'))
    }).catch(() => setAvailable(false))
    return () => controller.abort()
  }, [musicUrl])

  if (!available) return null
  return <div className="music-control"><audio ref={audioRef} src={musicUrl} loop preload="none" onEnded={() => setPlaying(false)} onError={() => setAvailable(false)} /><button type="button" className={playing ? 'music-playing' : ''} onClick={async () => { const audio = audioRef.current; if (!audio) return; if (playing) { audio.pause(); setPlaying(false) } else { try { await audio.play(); setPlaying(true) } catch { setPlaying(false) } } }} aria-label={playing ? 'Выключить музыку' : 'Включить музыку'} aria-pressed={playing}><span className="music-bars" aria-hidden="true"><i /><i /><i /></span><span>{playing ? 'Музыка включена' : 'Включить музыку'}</span></button></div>
}

function Lightbox({ memory, onClose }: { memory: Memory | null; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const reducedMotion = useReducedMotion()
  useEffect(() => {
    if (!memory) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKeyDown)
    closeRef.current?.focus()
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener('keydown', onKeyDown) }
  }, [memory, onClose])

  return <AnimatePresence>{memory && <motion.div className="lightbox" role="presentation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reducedMotion ? 0 : 0.3 }} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}><motion.div className="lightbox-frame" role="dialog" aria-modal="true" aria-label={`Фотография: ${memory.moment ?? memory.caption}`} initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 30, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 25, scale: 0.96 }} transition={{ duration: reducedMotion ? 0 : 0.35 }}><button ref={closeRef} type="button" className="lightbox-close" onClick={onClose} aria-label="Закрыть фотографию">×</button><div className="lightbox-image"><img src={asset(memory.src)} alt={memory.alt} /></div><div className="lightbox-caption"><span>{memory.moment ?? `Момент ${memory.id}`}</span><p>{memory.caption}</p></div></motion.div></motion.div>}</AnimatePresence>
}

function useSceneAnimations(root: React.RefObject<HTMLDivElement | null>) {
  useLayoutEffect(() => {
    if (!root.current) return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) return
    const context = gsap.context(() => {
      gsap.from('.hero-char', { yPercent: 110, opacity: 0, stagger: 0.035, duration: 1.15, ease: 'power3.out', delay: 0.25 })
      gsap.from('.hero-lead, .hero-button, .hero-bottom', { y: 25, opacity: 0, stagger: 0.14, duration: 0.8, ease: 'power2.out', delay: 1.05 })
      gsap.fromTo('.hero-sun', { opacity: 0.2, scale: 0.85 }, { opacity: 1, scale: 1.07, duration: 2.5, ease: 'power2.out' })

      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((element) => {
        gsap.from(element, { y: 38, opacity: 0, duration: 0.95, ease: 'power2.out', scrollTrigger: { trigger: element, start: 'top 88%', once: true } })
      })
      gsap.utils.toArray<HTMLElement>('[data-memory-card]').forEach((element, index) => {
        const fromX = index % 3 === 0 ? -65 : index % 3 === 2 ? 65 : 0
        gsap.from(element, { x: fromX, y: 85, rotation: index % 2 === 0 ? -7 : 7, opacity: 0, scale: 0.92, duration: 1.15, ease: 'power3.out', scrollTrigger: { trigger: element, start: 'top 93%', once: true } })
      })
      gsap.utils.toArray<HTMLElement>('[data-gratitude-line]').forEach((element) => {
        gsap.fromTo(element, { opacity: 0.32, x: 30 }, { opacity: 1, x: 0, ease: 'none', scrollTrigger: { trigger: element, start: 'top 90%', end: 'top 55%', scrub: 0.7 } })
      })
      gsap.utils.toArray<HTMLElement>('[data-collage-photo]').forEach((element, index) => {
        gsap.from(element, { y: 110, x: index % 2 ? 35 : -35, rotation: index % 2 ? 14 : -14, opacity: 0, scale: 0.75, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: '.finale-stage', start: 'top 75%', once: true }, delay: index * 0.12 })
      })
      gsap.utils.toArray<HTMLElement>('[data-finale-line]').forEach((element, index) => {
        gsap.from(element, { y: 45, opacity: 0, duration: 1, ease: 'power2.out', scrollTrigger: { trigger: '.finale-stage', start: 'top 62%', once: true }, delay: 0.55 + index * 0.85 })
      })
      const desktop = gsap.matchMedia()
      desktop.add('(min-width: 768px)', () => {
        gsap.to('.hero-sun', { yPercent: 17, ease: 'none', scrollTrigger: { trigger: '.hero-section', start: 'top top', end: 'bottom top', scrub: 0.8 } })
        gsap.utils.toArray<HTMLElement>('.memory-card-image').forEach((element) => {
          gsap.fromTo(element, { yPercent: -4 }, { yPercent: 4, ease: 'none', scrollTrigger: { trigger: element.closest('.memory-card'), start: 'top bottom', end: 'bottom top', scrub: 0.8 } })
        })
      })
    }, root)
    return () => context.revert()
  }, [root])
}

function App() {
  const root = useRef<HTMLDivElement>(null)
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null)
  useSceneAnimations(root)

  return <div ref={root} className="site-shell">
    <div className="grain" aria-hidden="true" />
    <header className="site-header"><a className="wordmark" href="#top" aria-label="В начало страницы">папе<span>♡</span></a><span className="header-note">Маленькое письмо о самом важном</span><MusicButton /></header>
    <main>
      <section id="top" className="hero-section section-light" aria-labelledby="hero-title"><div className="hero-sun" aria-hidden="true" /><div className="hero-curve" aria-hidden="true" /><div className="hero-content"><span className="hero-overline"><span className="overline-rule" />{content.hero.eyebrow}</span><AnimatedHeroTitle title={content.hero.title} /><p className="hero-lead">{content.hero.lead}</p><a className="hero-button" href="#story"><span>{content.hero.button}</span><span className="button-arrow"><ArrowIcon /></span></a></div><div className="hero-bottom"><span>01 / 05&nbsp; · &nbsp;История для тебя</span><a href="#story" aria-label="Прокрутить к истории">Листай вниз <span>↓</span></a></div><span className="hero-side-note">С любовью, твой сын — 2026</span></section>
      <MemoryGallery onOpen={setSelectedMemory} />
      <Gratitude />
      <LetterSection />
      <Finale onOpen={setSelectedMemory} />
    </main>
    <Lightbox memory={selectedMemory} onClose={() => setSelectedMemory(null)} />
  </div>
}

export default App
