import type { NextPage } from 'next'
import Image from 'next/image'
import ProfilePicture from '../public/profile_picture.jpg'

const Home: NextPage = () => {
  return (
    <>
      <h1>Hi everyone! I&apos;m Paul.</h1>
      <h2>Welcome to my homepage!</h2>
      <Image src={ProfilePicture} alt='Profile Picture' />
    </>
  )
}

export default Home
