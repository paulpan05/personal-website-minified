import type { NextPage } from 'next'
import Image from 'next/image'
import Head from 'next/head'
import ProfilePicture from '../public/profile_picture.jpg'

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Paul&apos;s Main Website</title>
        <link rel='icon' type='image/x-icon' href='/favicon.ico' />
        <link rel='icon' type='image/png' sizes='16x16' href='/favicon-16x16' />
        <link rel='icon' type='image/png' sizes='32x32' href='/favicon-32x32' />
        <link rel='apple-touch-icon' href='/apple-touch-icon.png' />
        <link rel='manifest' href='/manifest.json' />
      </Head>
      <h1>Hi everyone! I&apos;m Paul.</h1>
      <h2>Welcome to my homepage!</h2>
      <Image src={ProfilePicture} alt='Profile Picture' />
    </>
  )
}

export default Home
