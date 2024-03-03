import type { NextComponentType } from "next";
import styles from "./index.module.scss";
import { HighlightedProjectsCards } from "../../assets/text/subsections";

const HighlightedProjects: NextComponentType = () => {
  return (
    <div className={styles["highlighted-projects"]}>
      <h2>Highlighted Projects</h2>
      {HighlightedProjectsCards.map((card, index) => (
        <div key={index} className={styles["card"]}>
          <h3>{card.short_description}</h3>
          <h4>{card.medium_description}</h4>
          {card.long_description}
        </div>
      ))}
    </div>
  );
};

export default HighlightedProjects;
