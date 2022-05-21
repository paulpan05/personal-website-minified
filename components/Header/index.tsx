import type { NextComponentType } from 'next'
import Image from 'next/image'
import ProfilePicture from '../../assets/img/profile_picture.jpg'
import styles from './index.module.scss'

const Header: NextComponentType = () => {
  return (
    <>
      <Image src={ProfilePicture} alt='Profile Picture' className={styles['profile-image']} />
      <h1>Hi everyone! I&apos;m Paul.</h1>
      <h2>Welcome to my homepage!</h2>
    </>
  );
}

export default Header;