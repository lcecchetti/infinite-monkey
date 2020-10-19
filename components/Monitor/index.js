import { useState } from 'react';
import OnContext from "lib/OnContext";
import styles from 'styles/components/Monitor.module.scss';

const Monitor = ({ children }) => {
  const [isOn, setIsOn] = useState(false);

  // turn on/off the monitor
  const toggleOnOff = () => {
    setIsOn(!isOn);
  };

  return (
    <div className={`${styles.monitor} ${isOn ? styles.on : styles.off}`}>
      <div className={styles.screen}>
        <div className={styles.terminal}>
          <div className={styles.output}>
            <OnContext.Provider value={isOn}>
              {children}
            </OnContext.Provider>
          </div>
        </div>
      </div>
      <div className={styles.commandsWrapper}>
        <button className={styles.onOffToggle} onClick={toggleOnOff}>ON/OFF</button>
      </div>
    </div>
  );
};

export default Monitor;