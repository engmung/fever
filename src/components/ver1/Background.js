import React from "react";
import styles from "../../css/ver1/Background.module.css";

const Background = ({ mode }) => {
  return (
    <div className={`${styles.background} ${styles[mode]}`}>
      <div className={`${styles.dotBackground} ${styles[`dot${mode}`]}`}></div>
      {mode === "idle" && (
        <>
          <img src="/images/gauge.png" alt="Top Gauge 1" className={styles.idleTopImage1} />
          <img src="/images/gauge.png" alt="Top Gauge 2" className={styles.idleTopImage2} />
          <img src="/images/shakebox.png" alt="Shake Box" className={styles.shakeBox} />
          <img src="/images/shake.png" alt="Shake It" className={styles.shakeText} />
        </>
      )}
      {mode === "active" && (
        <img src="/images/shakefever.png" alt="Shake It Like Fevertime" className={styles.shakeFever} />
      )}
      {mode === "complete" && (
        <>
          <img src="/images/clear.png" alt="Fever Time Clear" className={`${styles.clearImage} ${styles.slideIn}`} />
          <img src="/images/gauge.png" alt="Gauge" className={styles.completeGaugeTop} />
          <img src="/images/gauge.png" alt="Gauge" className={styles.completeGaugeBottom} />
        </>
      )}
    </div>
  );
};

export default Background;