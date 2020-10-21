import { useState, useEffect } from 'react';
import IsOnContext from "lib/IsOnContext";
import styles from 'styles/components/Monitor.module.scss';

const Monitor = ({ children }) => {
  const [isOn, setIsOn] = useState(false);

  // turn on monitor at page load
  useEffect(() => {
    setIsOn(true);
  });

  return (
    <div className={`${styles.monitor} ${isOn ? styles.on : styles.off}`}>
      <div className={styles.screen}>
        <div className={styles.terminal}>
          <div className={styles.output}>
            <IsOnContext.Provider value={isOn}>
              {children}
            </IsOnContext.Provider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Monitor;