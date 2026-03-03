import styles from './HighlightedProjects.module.scss'
import { HighlightedProjectsCards } from '@/data/subsections'

export default function HighlightedProjects() {
  return (
    <div className={styles['highlighted-projects']}>
      <h2>Highlighted Projects</h2>
      {HighlightedProjectsCards.map((card, index) => (
        <div key={index} className={styles.card}>
          <h3>{card.short_description}</h3>
          <h4>{card.medium_description}</h4>
          {card.long_description}
        </div>
      ))}
    </div>
  )
}