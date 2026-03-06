import Image from 'next/image'

export default function Header() {
  return (
    <div className="header">
      <Image
        src='/image/profile_picture.jpg'
        alt='Profile Picture'
        className="profile-image"
        width={250}
        height={250}
      />
      <h1>Hi everyone! I&apos;m Paul.</h1>
      <h3>Welcome to my homepage!</h3>
    </div>
  )
}