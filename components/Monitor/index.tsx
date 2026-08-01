'use client';

import { ReactNode, useEffect, useState } from 'react';
import IsMonitorOnContext from "lib/IsMonitorOnContext";
import styles from 'styles/components/Monitor.module.scss';

interface MonitorProps {
  children: ReactNode;
}

const Monitor = ({ children }: MonitorProps) => {
  // hydration-safe "have we mounted on the client yet" flag
  const [isOn, setIsOn] = useState(false);
  useEffect(() => setIsOn(true), []);

  return (
    <div className={`${styles.monitor} ${isOn ? styles.on : styles.off}`}>
      <div className={styles.screen}>
        <div className={styles.terminal}>
          <div className={styles.output}>
            <IsMonitorOnContext.Provider value={isOn}>
              {children}
            </IsMonitorOnContext.Provider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Monitor;
