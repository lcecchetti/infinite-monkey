'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import * as gtag from 'lib/gtag';

const Analytics = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const query = searchParams.toString();
    gtag.pageview(query ? `${pathname}?${query}` : pathname);
  }, [pathname, searchParams]);

  return null;
};

export default Analytics;
