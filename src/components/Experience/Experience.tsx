import Image from 'next/image'
import { experienceCards } from '@/data/subsections'

export default function Experience() {
  return (
    <div className="experience">
      <h2>Experience</h2>
      {experienceCards.map((card, index) => (
        <div className="card" key={index}>
          <Image src={card.logo} alt={card.company} width={250} height={250} />
          <h3>{card.role}</h3>
          <h4>{card.employmentTime}</h4>
          <p>{card.description}</p>
          <br />
          <br />
          <p><b>Programming Languages: </b>{card.programmingLanguages}</p>
          {card.additionalInfo?.split('\n').map((line, i) => (
            <p key={i}><b>{line.split(': ')[0]}: </b>{line.split(': ')[1]}</p>
          ))}
        </div>
      ))}
    </div>
  )
}