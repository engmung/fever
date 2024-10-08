import React from "react";
import styles from "../css/Background.module.css";

const Background = ({ mode }) => {
  return (
    <div className={`${styles.background} ${styles[mode]}`}>
      {mode === "idle" && (
        <>
          <div className={styles.topImages}>
            <div className={styles.topImage}></div>
            <div className={`${styles.topImage} ${styles.lowerOpacity}`}></div>
          </div>
          <div className={styles.dotBackground}></div>
          <div className={styles.bottomText}>SHAKE IT!</div>
        </>
      )}
      {mode === "active" && (
        <>
          <div className={styles.topText}>!! SHAKE IT LIKE FEVERTIME !!</div>
          <div className={styles.dotBackground}></div>
        </>
      )}
      {mode === "complete" && (
        <>
          <div className={styles.centerText}>FEVER TIME CLEAR</div>
          <div className={styles.gaugeTop}></div>
          <div className={styles.dotBackground}></div>
          <div className={styles.gaugeBottom}></div>
        </>
      )}
    </div>
  );
};

export default Background;
