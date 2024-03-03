import type { NextComponentType } from 'next'
import Image from 'next/image'
import styles from './index.module.scss'

const Header: NextComponentType = () => {
  return (
    <div className={styles['header']}>
      <Image src='/image/profile_picture.jpg' alt='Profile Picture' className={styles['profile-image']}  width={250} height={250}/>
      <h1>Hi everyone! I&apos;m Paul.</h1>
      <h3>Welcome to my homepage!</h3>
    </div>
  );
}

export default Header;