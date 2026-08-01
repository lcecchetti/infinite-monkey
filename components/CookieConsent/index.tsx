'use client';

import { useContext } from 'react';
import ConsentContext from 'lib/ConsentContext';
import styles from 'styles/components/CookieConsent.module.scss';

const CookieConsent = () => {
  const { status, accept } = useContext(ConsentContext);

  if (status !== 'declined') {
    return null;
  }

  return (
    <div className={styles.banner}>
      <span className={styles.text}>
        This site uses cookies to improve your experience.
      </span>
      <button className={styles.button} onClick={accept}>ACCEPT</button>
    </div>
  );
};

export default CookieConsent;
