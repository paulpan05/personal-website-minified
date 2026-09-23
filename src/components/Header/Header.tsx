import Image from 'next/image'
import SiteNav from '@/components/SiteNav/SiteNav'

export default function Header() {
  return (
    <header className="header">
      <SiteNav />
      <Image
        src='/image/profile_picture.jpg'
        alt='Profile Picture'
        className="profile-image"
        width={250}
        height={250}
        priority
      />
      <h1>Hi everyone! I&apos;m Paul.</h1>
      <p className="header-subtitle">Welcome to my homepage!</p>
    </header>
  )
}