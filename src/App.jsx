import { useMemo, useRef, useState } from 'react'
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
import './App.css'
import CinematicNav from './components/CinematicNav'
import MapChapter from './components/MapChapter'
import ResourceOverlay from './components/ResourceOverlay'
import {
  chapterPanels,
  goals,
  mapRegions,
  resources as seedResources,
  scenes,
  threadTags,
} from './data'

const initialPost = {
  author: 'First-year student',
  tag: threadTags[0],
  copy: '',
}

function useSceneProgress(ref) {
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  return useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.3 })
}

function App() {
  const reduceMotion = useReducedMotion()
  const [selectedGoal, setSelectedGoal] = useState(goals[0].id)
  const [resources, setResources] = useState(seedResources)
  const [activeResourceId, setActiveResourceId] = useState(null)
  const [newPost, setNewPost] = useState(initialPost)
  const [mapProgressValue, setMapProgressValue] = useState(0)

  const mapRef = useRef(null)
  const introRef = useRef(null)
  const buildRef = useRef(null)
  const mapSceneRef = useRef(null)

  const introProgress = useSceneProgress(introRef)
  const buildProgress = useSceneProgress(buildRef)
  const mapProgress = useSceneProgress(mapSceneRef)

  const selectedGoalMeta = useMemo(
    () => goals.find((goal) => goal.id === selectedGoal) ?? goals[0],
    [selectedGoal],
  )

  const activeResource = useMemo(
    () => resources.find((resource) => resource.id === activeResourceId) ?? null,
    [activeResourceId, resources],
  )

  const matchedResources = useMemo(
    () => resources.filter((resource) => resource.goals.includes(selectedGoal)),
    [resources, selectedGoal],
  )

  const chapterResources = useMemo(
    () =>
      chapterPanels.map((panel) => ({
        ...panel,
        items: matchedResources.filter((resource) => resource.chapter === panel.id).slice(0, 2),
      })),
    [matchedResources],
  )

  const peerPosts = activeResource ? activeResource.peerThoughts : []

  const introShift = useTransform(introProgress, [0, 1], reduceMotion ? [0, 0] : [0, -120])
  const introOpacity = useTransform(introProgress, [0, 0.65], [1, 0.22])
  const buildGlow = useTransform(buildProgress, [0, 0.4, 1], [0.16, 0.5, 0.22])
  const mapMask = useTransform(mapProgress, [0, 0.35, 0.7, 1], [0.95, 0.62, 0.18, 0.08])

  useMotionValueEvent(mapProgress, 'change', (latest) => {
    setMapProgressValue(latest)
  })

  function handleJumpToMap() {
    mapRef.current?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })
  }

  function handleSubmitPost(event) {
    event.preventDefault()

    if (!activeResource) {
      return
    }

    const copy = newPost.copy.trim()

    if (!copy) {
      return
    }

    const thought = {
      id: `${activeResource.id}-${Date.now()}`,
      author: newPost.author,
      tag: newPost.tag,
      copy,
    }

    setResources((current) =>
      current.map((resource) =>
        resource.id === activeResource.id
          ? { ...resource, peerThoughts: [thought, ...resource.peerThoughts] }
          : resource,
      ),
    )
    setNewPost(initialPost)
  }

  return (
    <div className="cinematic-app">
      <div className="cinematic-backdrop" aria-hidden="true" />
      <CinematicNav
        goals={goals}
        selectedGoal={selectedGoal}
        onSelectGoal={setSelectedGoal}
        onJumpToMap={handleJumpToMap}
      />

      <main className="cinematic-main">
        <section ref={introRef} className="scene scene--intro">
          <motion.div className="scene-shell scene-shell--intro" style={{ y: introShift, opacity: introOpacity }}>
            <div className="hero-copy">
              <span>{scenes[0].eyebrow}</span>
              <h1>{selectedGoalMeta.title}</h1>
              <p>{selectedGoalMeta.caption}</p>
            </div>

            <div className="hero-object" aria-hidden="true">
              <motion.div
                className="hero-halo"
                animate={reduceMotion ? { opacity: 0.6 } : { scale: [1, 1.08, 1], opacity: [0.45, 0.7, 0.45] }}
                transition={reduceMotion ? { duration: 0 } : { duration: 6.4, repeat: Infinity, ease: 'easeInOut' }}
              />
              <div className="hero-surface">
                <div className="surface-glass" />
                <div className="surface-line surface-line--top" />
                <div className="surface-line surface-line--mid" />
                <div className="surface-line surface-line--bottom" />
              </div>
            </div>
          </motion.div>
        </section>

        <section ref={buildRef} className="scene scene--build">
          <div className="sticky-shell">
            <motion.div className="section-glow" style={{ opacity: buildGlow }} />
            <div className="scene-copy scene-copy--split">
              <div>
                <span>{scenes[1].eyebrow}</span>
                <h2>{scenes[1].title}</h2>
              </div>
              <p>{scenes[1].body}</p>
            </div>

            <div className="chapter-grid">
              {chapterResources.map((panel, index) => (
                <motion.article
                  key={panel.id}
                  className="chapter-card"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.7, delay: index * 0.12 }}
                >
                  <span>{panel.title}</span>
                  <h3>{panel.body}</h3>
                  <div className="chapter-list">
                    {panel.items.map((resource) => (
                      <button
                        key={resource.id}
                        type="button"
                        className="chapter-list__item"
                        onClick={() => {
                          handleJumpToMap()
                          window.setTimeout(() => setActiveResourceId(resource.id), reduceMotion ? 0 : 560)
                        }}
                      >
                        <strong>{resource.title}</strong>
                        <small>{resource.visualLabel}</small>
                      </button>
                    ))}
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section ref={mapSceneRef} className="scene scene--map" id="map-chapter">
          <div ref={mapRef} className="sticky-shell sticky-shell--map">
            <motion.div className="map-mask" style={{ opacity: mapMask }} />
            <div className="scene-copy scene-copy--map">
              <div>
                <span>{scenes[2].eyebrow}</span>
                <h2>{scenes[2].title}</h2>
              </div>
              <p>{scenes[2].body}</p>
            </div>

            <MapChapter
              progress={mapProgressValue}
              regions={mapRegions}
              resources={resources}
              selectedGoal={selectedGoal}
              activeResourceId={activeResourceId}
              onSelectResource={setActiveResourceId}
            />

            <div className="map-stage-pills">
              <span className={mapProgressValue > 0.12 ? 'is-on' : ''}>Reveal</span>
              <span className={mapProgressValue > 0.32 ? 'is-on' : ''}>Focus</span>
              <span className={mapProgressValue > 0.58 ? 'is-on' : ''}>Open</span>
            </div>
          </div>
        </section>
      </main>

      <ResourceOverlay
        resource={activeResource}
        peerPosts={peerPosts}
        newPost={newPost}
        setNewPost={setNewPost}
        onClose={() => setActiveResourceId(null)}
        onSubmitPost={handleSubmitPost}
      />
    </div>
  )
}

export default App
