import { motion } from 'framer-motion'

function MapChapter({
  progress,
  regions,
  resources,
  selectedGoal,
  activeResourceId,
  onSelectResource,
}) {
  const revealPins = progress > 0.3
  const revealLabels = progress > 0.18
  const glowStrength = Math.min(1, Math.max(0.2, progress + 0.15))

  return (
    <div className="map-chapter">
      <div className="map-scaffold">
        <motion.div
          className="map-heading"
          animate={{ opacity: progress < 0.12 ? 0.4 : 1, y: progress < 0.12 ? 18 : 0 }}
          transition={{ duration: 0.6 }}
        >
          <span>Map</span>
          <h2>Opportunity becomes place.</h2>
        </motion.div>

        <div className="cinematic-map">
          <div
            className="map-spotlight"
            aria-hidden="true"
            style={{ opacity: glowStrength }}
          />

          <svg className="map-routes" viewBox="0 0 920 680" aria-hidden="true">
            <path d="M126 190C236 126 312 126 396 164C484 206 514 324 636 348C730 366 812 304 870 228" />
            <path d="M178 424C286 354 374 376 460 442C542 508 628 530 748 480" />
            <path d="M288 560C398 516 456 260 572 214" />
          </svg>

          {regions.map((region, index) => {
            const hasGoalMatch = resources.some(
              (resource) =>
                resource.area === region.label && resource.goals.includes(selectedGoal),
            )

            return (
              <motion.div
                key={region.id}
                className={`cinematic-region ${hasGoalMatch ? 'is-match' : 'is-dim'}`}
                style={{
                  left: region.x,
                  top: region.y,
                  width: region.width,
                  height: region.height,
                  '--tint': region.tint,
                }}
                initial={false}
                animate={{
                  opacity: progress > 0.08 ? (hasGoalMatch ? 0.95 : 0.22) : 0.08,
                  scale: hasGoalMatch && progress > 0.45 ? 1.03 : 1,
                  filter: hasGoalMatch ? 'blur(0px)' : 'blur(2px)',
                }}
                transition={{ duration: 0.7, delay: index * 0.05 }}
              >
                {revealLabels ? <span>{region.label}</span> : null}
              </motion.div>
            )
          })}

          {resources.map((resource, index) => {
            const matchesGoal = resource.goals.includes(selectedGoal)
            const isActive = resource.id === activeResourceId
            const visible = revealPins && (matchesGoal || progress > 0.62)

            return (
              <motion.button
                key={resource.id}
                type="button"
                className={[
                  'cinematic-pin',
                  resource.type === 'event' ? 'is-event' : 'is-space',
                  isActive ? 'is-active' : '',
                  matchesGoal ? 'is-match' : '',
                ].join(' ')}
                style={{ left: resource.x, top: resource.y }}
                initial={false}
                animate={{
                  opacity: visible ? (matchesGoal || isActive ? 1 : 0.42) : 0,
                  scale: isActive ? 1.05 : matchesGoal ? 1 : 0.92,
                  y: visible ? 0 : 28,
                }}
                transition={{ duration: 0.6, delay: index * 0.06 }}
                onClick={() => onSelectResource(resource.id)}
                aria-label={resource.title}
              >
                <span className="cinematic-pin__core" />
                <span className="cinematic-pin__card">
                  <strong>{resource.title}</strong>
                  <span>{resource.visualLabel}</span>
                </span>
              </motion.button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default MapChapter
