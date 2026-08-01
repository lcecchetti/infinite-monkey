'use client';

import { useContext, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import ConsentContext from 'lib/ConsentContext';
import * as gtag from 'lib/gtag';

const Analytics = () => {
  const { status } = useContext(ConsentContext);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (status !== 'accepted') {
      return;
    }

    const query = searchParams.toString();
    gtag.pageview(query ? `${pathname}?${query}` : pathname);
  }, [status, pathname, searchParams]);

  return null;
};

export default Analytics;
