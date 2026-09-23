import { highlightedProjectsCards } from '@/data/subsections'

export default function HighlightedProjects() {
  return (
    <section className="highlighted-projects" aria-labelledby="projects-heading">
      <h2 id="projects-heading">Highlighted Projects</h2>
      {highlightedProjectsCards.map((card, index) => (
        <article key={index} className="card">
          <h3>{card.shortDescription}</h3>
          <h4>{card.mediumDescription}</h4>
          <p>{card.longDescription}</p>
          <br />
          <br />
          <p>
            <b>Links: </b>
            {card.links.map((link, linkIndex) => (
              <span key={linkIndex}>
                <a href={link.url} target="_blank" rel="noopener noreferrer">{link.label}</a>
                {linkIndex < card.links.length - 1 ? ' ' : ''}
              </span>
            ))}
          </p>
        </article>
      ))}
    </section>
  )
}