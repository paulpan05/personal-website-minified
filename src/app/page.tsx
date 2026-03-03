import Header from '@/components/Header'
import About from '@/components/About'
import Experience from '@/components/Experience'
import HighlightedProjects from '@/components/HighlightedProjects'
import MoreAboutMe from '@/components/MoreAboutMe'
import styles from './page.module.scss'

export default function Home() {
  return (
    <>
      <Header />
      <div className={styles['content']}>
        <About />
        <Experience />
        <HighlightedProjects />
        <MoreAboutMe />
      </div>
    </>
  )
}