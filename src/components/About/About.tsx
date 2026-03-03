import styles from './About.module.scss'
import { AboutMe, AboutThisSite } from '@/data/paragraphs'

export default function About() {
  return (
    <div className={styles.about}>
      <h2>About</h2>
      <h3>Me</h3>
      {AboutMe}
      <h3>This site</h3>
      {AboutThisSite}
    </div>
  )
}