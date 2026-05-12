import { motion } from 'framer-motion'

function CinematicNav({ goals, selectedGoal, onSelectGoal, onJumpToMap }) {
  return (
    <motion.header
      className="cinematic-nav"
      style={{ x: '-50%' }}
      initial={{ opacity: 0, y: -18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="nav-brand">
        <span className="nav-brand__dot" aria-hidden="true" />
        <strong>Social Capital Map</strong>
      </div>

      <nav className="nav-goals" aria-label="Goal selector">
        {goals.map((goal) => (
          <button
            key={goal.id}
            type="button"
            className={`nav-pill ${selectedGoal === goal.id ? 'is-active' : ''}`}
            onClick={() => onSelectGoal(goal.id)}
          >
            {goal.shortLabel}
          </button>
        ))}
      </nav>

      <button type="button" className="nav-cta" onClick={onJumpToMap}>
        Map
      </button>
    </motion.header>
  )
}

export default CinematicNav
