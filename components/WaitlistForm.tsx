'use client';

import { createClient } from '@supabase/supabase-js';
import { useState } from 'react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    const { error } = await supabase.from('waitlist').insert({ email });
    if (error) {
      alert('Erreur, réessaye plus tard.');
      console.error(error);
      return;
    }
    setDone(true);
    setEmail('');
  };

  return (
    <div className="flex flex-col items-center">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          className="px-4 py-2 border rounded"
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          S’inscrire
        </button>
      </form>

      {done && (
        <p className="mt-4 text-green-600">Merci ! Tu es sur la liste ✅</p>
      )}
    </div>
  );
}
