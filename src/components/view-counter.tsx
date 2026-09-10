'use client';

import { useEffect, useRef } from 'react';
import { incrementBeritaViews } from '@/lib/supabase';

interface ViewCounterProps {
  id: string | number;
  initialViews: number;
}

export default function ViewCounter({ id, initialViews }: ViewCounterProps) {
  const hasIncremented = useRef(false);

  useEffect(() => {
    if (!hasIncremented.current && id) {
      hasIncremented.current = true;
      incrementBeritaViews(id, initialViews);
    }
  }, [id, initialViews]);

  return null;
}
