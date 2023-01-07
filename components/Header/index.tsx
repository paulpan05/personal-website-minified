import type { NextComponentType } from 'next'
import Image from 'next/image'
import styles from './index.module.scss'

const Header: NextComponentType = () => {
  return (
    <>
      <Image src='/image/profile_picture.jpg' alt='Profile Picture' className={styles['profile-image']} width={500} height={500} />
      <h1>Hi everyone! I&apos;m Paul.</h1>
      <h2>Welcome to my homepage!</h2>
    </>
  );
}

export default Header;