import Image from 'next/image'
import styles from './Experience.module.scss'
import { ExperienceCards } from '@/data/subsections'

export default function Experience() {
  return (
    <div className={styles.experience}>
      <h2>Experience</h2>
      {ExperienceCards.map((card, index) => (
        <div className={styles.card} key={index}>
          <Image src={card.logo} alt={card.company} width={250} height={250} />
          <h3>{card.role}</h3>
          <h4>{card.employment_time}</h4>
          {card.description}
        </div>
      ))}
    </div>
  )
}