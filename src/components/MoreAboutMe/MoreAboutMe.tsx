import Image from 'next/image'
import styles from './MoreAboutMe.module.scss'
import { ProfileIconLinks, OldEmail, NewEmail, PhoneNumber } from '@/data/infos'

export default function MoreAboutMe() {
  return (
    <div className={styles.profile}>
      <h2>More About Me</h2>
      <div className={styles['profile-links']}>
        {ProfileIconLinks.map((profile, index) => (
          <a key={index} href={profile.link}>
            <Image
              src={profile.icon}
              alt={profile.site_name}
              width={50}
              height={50}
            />
          </a>
        ))}
      </div>
      <p><b>Old Email: </b><a href={`mailto:${OldEmail}`}>{OldEmail}</a></p>
      <p><b>New Email: </b><a href={`mailto:${NewEmail}`}>{NewEmail}</a></p>
      <p><b>Phone Number: </b><a href={`tel:${PhoneNumber}`}>{PhoneNumber}</a></p>
    </div>
  )
}