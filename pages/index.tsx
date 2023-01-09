import type { NextPage } from 'next'
import Head from 'next/head'
import styles from './index.module.scss'
import About from '../components/About'
import Header from '../components/Header'
import Experience from '../components/Experience'
import HighlightedProjects from '../components/HighlightedProjects'
import MoreAboutMe from '../components/MoreAboutMe'

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Paul&apos;s Main Website</title>
        <link rel='icon' type='image/x-icon' href='/favicon.ico' />
        <link rel='icon' type='image/png' sizes='16x16' href='/favicon-16x16.png' />
        <link rel='icon' type='image/png' sizes='32x32' href='/favicon-32x32.png' />
        <link rel='apple-touch-icon' href='/apple-touch-icon.png' />
        <link rel='manifest' href='/manifest.json' />
      </Head>
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

export default Home
