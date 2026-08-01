'use client';

import { ReactNode, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import ConsentContext, { ConsentStatus } from 'lib/ConsentContext';

const COOKIE_NAME = 'cookie-consent-accepted';

interface ConsentProviderProps {
  children: ReactNode;
}

const ConsentProvider = ({ children }: ConsentProviderProps) => {
  const [status, setStatus] = useState<ConsentStatus>('pending');

  // resolve consent from the cookie once we're on the client; not a
  // subscribable store, so useSyncExternalStore doesn't apply here
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStatus(Cookies.get(COOKIE_NAME) === 'true' ? 'accepted' : 'declined');
  }, []);

  const accept = () => {
    Cookies.set(COOKIE_NAME, 'true', { expires: 365 });
    setStatus('accepted');
  };

  return (
    <ConsentContext.Provider value={{ status, accept }}>
      {children}
    </ConsentContext.Provider>
  );
};

export default ConsentProvider;
