'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-neutral-950 to-zinc-950 flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-4 animate-pulse">⏳</div>
        <p className="text-gray-400">Redirecting to dashboard...</p>
        </div>
    </div>
  );
}
