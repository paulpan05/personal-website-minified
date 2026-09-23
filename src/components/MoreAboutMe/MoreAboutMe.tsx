import Image from 'next/image'
import { ProfileIconLinks, OldEmail, NewEmail, PhoneNumber } from '@/data/infos'

export default function MoreAboutMe() {
  const phoneHref = `tel:${PhoneNumber.replace(/[^+\d]/g, '')}`
  return (
    <section className="profile" aria-labelledby="profile-heading">
      <h2 id="profile-heading">More About Me</h2>
      <div className="profile-links">
        {ProfileIconLinks.map((profile, index) => (
          <a key={index} href={profile.link} aria-label={profile.site_name} target="_blank" rel="noopener noreferrer">
            <Image
              src={profile.icon}
              alt={profile.site_name}
              width={50}
              height={50}
              loading="lazy"
            />
          </a>
        ))}
      </div>
      <p><b>Primary email: </b><a href={`mailto:${NewEmail}`}>{NewEmail}</a></p>
      <p><b>Legacy email: </b><a href={`mailto:${OldEmail}`}>{OldEmail}</a></p>
      <p><b>Phone Number: </b><a href={phoneHref}>{PhoneNumber}</a></p>
    </section>
  )
}