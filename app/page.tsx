'use client';

import WaitlistForm from '@/components/WaitlistForm';
import Aurora from '@/components/Aurora';
import SpotlightCard from '@/components/SpotlightCard';
import Image from 'next/image';
import logo from '../public/logo.png';
  

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
      {/* <h1 className="uppercase text-white text-3xl font-semibold mb-4">V&nbsp;arious&nbsp;&nbsp;Archives</h1> */}
      <div><Image src={logo} alt="Various Archives logo" width={200} height={200}/></div>
      <SpotlightCard className="bg-neutral-900/40 border-neutral-700/20 backdrop-blur-xs" spotlightColor="rgba(255, 255, 255, 0.2)">
        <WaitlistForm />
      </SpotlightCard> 
      <p className='flex flex-col items-center justify center m-4 text-xs text-center text-white max-w-sm mt-6 px-2'>
        By continuing, you agree to our<br/>Terms and Privacy Policy.
      </p>
    </main>
  );
}