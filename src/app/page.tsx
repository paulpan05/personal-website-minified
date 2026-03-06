import Header from '@/components/Header/Header'
import About from '@/components/About/About'
import Experience from '@/components/Experience/Experience'
import HighlightedProjects from '@/components/HighlightedProjects/HighlightedProjects'
import MoreAboutMe from '@/components/MoreAboutMe/MoreAboutMe'

export default function Home() {
  return (
    <>
      <Header />
      <div className="content">
        <About />
        <Experience />
        <HighlightedProjects />
        <MoreAboutMe />
      </div>
    </>
  )
}