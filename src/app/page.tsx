import Header from '@/components/Header/Header'
import About from '@/components/About/About'
import Experience from '@/components/Experience/Experience'
import HighlightedProjects from '@/components/HighlightedProjects/HighlightedProjects'
import Writing from '@/components/Writing/Writing'
import MoreAboutMe from '@/components/MoreAboutMe/MoreAboutMe'

export default function Home() {
  return (
    <>
      <Header />
      <main className="content">
        <About />
        <Experience />
        <HighlightedProjects />
        <Writing />
        <MoreAboutMe />
      </main>
    </>
  )
}