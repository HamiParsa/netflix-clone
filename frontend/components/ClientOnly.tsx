'use client';

import { useEffect, useState, useRef } from 'react';

export default function ClientOnly({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      setMounted(true);
    }
  }, []);

  if (!mounted) return null;

  return <>{children}</>;
}