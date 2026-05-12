import { AnimatePresence, motion } from 'framer-motion'
import { identityOptions, threadTags } from '../data'

const overlayTransition = { duration: 0.65, ease: [0.22, 1, 0.36, 1] }

function ResourceOverlay({
  resource,
  peerPosts,
  newPost,
  setNewPost,
  onClose,
  onSubmitPost,
}) {
  return (
    <AnimatePresence>
      {resource ? (
        <motion.aside
          className="resource-overlay"
          initial={{ opacity: 0, x: 64 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 64 }}
          transition={overlayTransition}
        >
          <button type="button" className="overlay-close" onClick={onClose} aria-label="Close resource">
            Close
          </button>

          <motion.section
            className="overlay-card overlay-card--identity"
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...overlayTransition, delay: 0.08 }}
          >
            <p>{resource.type}</p>
            <h3>{resource.title}</h3>
            <div className="overlay-tags">
              {resource.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </motion.section>

          <motion.section
            className="overlay-card"
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...overlayTransition, delay: 0.18 }}
          >
            <p>Action</p>
            <h4>{resource.firstAction}</h4>
          </motion.section>

          <motion.section
            className="overlay-card"
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...overlayTransition, delay: 0.28 }}
          >
            <p>Why now</p>
            <h4>{resource.whyNow}</h4>
          </motion.section>

          <motion.section
            className="overlay-card overlay-card--thread"
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...overlayTransition, delay: 0.42 }}
          >
            <div className="overlay-thread__head">
              <p>Peer notes</p>
              <span>{peerPosts.length}</span>
            </div>

            <div className="overlay-thread__list">
              {peerPosts.map((thought, index) => (
                <motion.article
                  key={thought.id}
                  className="overlay-note"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...overlayTransition, delay: 0.5 + index * 0.06 }}
                >
                  <div>
                    <strong>{thought.author}</strong>
                    <span>{thought.tag}</span>
                  </div>
                  <p>{thought.copy}</p>
                </motion.article>
              ))}
            </div>
          </motion.section>

          <motion.section
            className="overlay-card overlay-card--composer"
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...overlayTransition, delay: 0.58 }}
          >
            <p>Contribute</p>
            <form className="overlay-form" onSubmit={onSubmitPost}>
              <select
                value={newPost.author}
                onChange={(event) => setNewPost((current) => ({ ...current, author: event.target.value }))}
              >
                {identityOptions.map((identity) => (
                  <option key={identity} value={identity}>
                    {identity}
                  </option>
                ))}
              </select>

              <div className="overlay-form__tags">
                {threadTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    className={newPost.tag === tag ? 'is-active' : ''}
                    onClick={() => setNewPost((current) => ({ ...current, tag }))}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              <textarea
                value={newPost.copy}
                onChange={(event) => setNewPost((current) => ({ ...current, copy: event.target.value }))}
                placeholder="One thing the next student should know."
              />

              <button type="submit" className="overlay-submit">
                Add note
              </button>
            </form>
          </motion.section>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  )
}

export default ResourceOverlay
