import type { NextComponentType } from 'next'
import styles from './index.module.scss'
import {AboutMe, AboutThisSite} from '../../_assets/text/paragraphs';

const About: NextComponentType = () => {
  return (
    <div className={styles['about']}>
      <h2>About</h2>
      <h3>Me</h3>
      {AboutMe}
      <h3>This site</h3>
      {AboutThisSite}
    </div>
  );
}

export default About;