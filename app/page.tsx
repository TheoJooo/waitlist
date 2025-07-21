'use client';

import WaitlistForm from '@/components/WaitlistForm';
import Aurora from '@/components/Aurora';
import SpotlightCard from '@/components/SpotlightCard';
  

export default function Home() {
  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Aurora
          colorStops={['#BABABA', '#FFFFFF', '#E0E0E0']}
          blend={0.5}
          amplitude={1}
          speed={0.5}
        />
      </div>
      <h1 className="uppercase text-white text-3xl font-semibold mb-4">V&nbsp;arious&nbsp;&nbsp;Archives</h1>
      <SpotlightCard className="bg-neutral-900/70 border-neutral-700/60 backdrop-blur-sm" spotlightColor="rgba(255, 255, 255, 0.2)">
        <WaitlistForm />
      </SpotlightCard> 
      <p className='flex flex-col items-center justify center m-4 text-xs text-center text-white max-w-sm mt-4 px-2'>No spam, never.<br/>By continuing, you agree to our Terms and Privacy Policy.</p>
    </main>
  );
}