'use client';

import { createContext } from 'react';

export type ConsentStatus = 'pending' | 'accepted' | 'declined';

export interface ConsentContextValue {
  status: ConsentStatus;
  accept: () => void;
}

const ConsentContext = createContext<ConsentContextValue>({
  status: 'pending',
  accept: () => {},
});

export default ConsentContext;
