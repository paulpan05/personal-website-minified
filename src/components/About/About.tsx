import { aboutMeText, aboutThisSiteText, repoLink } from '@/data/paragraphs'

export default function About() {
  return (
    <section className="about" aria-labelledby="about-heading">
      <h2 id="about-heading">About</h2>
      <h3>Me</h3>
      <p>{aboutMeText}</p>
      <h3>This site</h3>
      <p>{aboutThisSiteText}</p>
      <br />
      <br />
      <p>
        <b>Repo Link: </b>
        <a href={repoLink} target="_blank" rel="noopener noreferrer">personal-website-minified</a>
      </p>
    </section>
  )
}