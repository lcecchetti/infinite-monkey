import {useEffect, useState} from 'react';
import Cookies from 'js-cookie';
import styles from 'styles/components/CookieConsent.module.scss';

/**
 * @type {String}
 */
const COOKIE_NAME = 'cookie-consent-accepted';

const CookieConsent = () => {
  const [accepted, setAccepted] = useState(true);

  /**
   * Accept cookie policy
   */
  const accept = () => {
    setAccepted(true);
    Cookies.set(COOKIE_NAME, true, {
      expires: 365,
    })
  }

  /**
   * Show the cookie banner to the visitor
   */
  useEffect(() => {
    if (!Cookies.get(COOKIE_NAME)) {
      setAccepted(false);
    }
  }, [])

  return (!accepted &&
    <div className={styles.banner}>
      <span className={styles.text}>
        This site uses cookies to improve your experience.
      </span>
      <button className={styles.button} onClick={accept}>ACCEPT</button>
    </div>
  )
}

export default CookieConsent;