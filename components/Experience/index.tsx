import type { NextComponentType } from "next";
import styles from "./index.module.scss";

const Experience: NextComponentType = () => {
  return (
    <div className={styles['experience']}>
      <h2>Experience</h2>
    </div>
  );
};

export default Experience;
