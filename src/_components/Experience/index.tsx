import type { NextComponentType } from "next";
import Image from "next/image";
import styles from "./index.module.scss";
import { ExperienceCards } from "../../_assets/text/subsections";

const Experience: NextComponentType = () => {
  return (
    <div className={styles["experience"]}>
      <h2>Experience</h2>
      {ExperienceCards.map((card, index) => (
        <div className={styles['card']} key={index}>
          <Image src={card.logo} alt={card.company} width={250} height={250} />
          <h3>{card.role}</h3>
          <h4>{card.employment_time}</h4>
          {card.description}
        </div>
      ))}
    </div>
  );
};

export default Experience;
