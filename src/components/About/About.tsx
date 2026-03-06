import { aboutMeText, aboutThisSiteText, repoLink } from '@/data/paragraphs'

export default function About() {
  return (
    <div className="about">
      <h2>About</h2>
      <h3>Me</h3>
      <p>{aboutMeText}</p>
      <h3>This site</h3>
      <p>{aboutThisSiteText}</p>
      <br />
      <br />
      <p>
        <b>Repo Link: </b>
        <a href={repoLink}>personal-website-minified</a>
      </p>
    </div>
  )
}