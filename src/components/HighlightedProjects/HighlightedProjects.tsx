import { highlightedProjectsCards } from '@/data/subsections'

export default function HighlightedProjects() {
  return (
    <div className="highlighted-projects">
      <h2>Highlighted Projects</h2>
      {highlightedProjectsCards.map((card, index) => (
        <div key={index} className="card">
          <h3>{card.shortDescription}</h3>
          <h4>{card.mediumDescription}</h4>
          <p>{card.longDescription}</p>
          <br />
          <br />
          <p>
            <b>Links: </b>
            {card.links.map((link, linkIndex) => (
              <span key={linkIndex}>
                <a href={link.url}>{link.label}</a>
                {linkIndex < card.links.length - 1 ? ' ' : ''}
              </span>
            ))}
          </p>
        </div>
      ))}
    </div>
  )
}