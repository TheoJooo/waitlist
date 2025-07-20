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
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDone(false);
    setError('');

    const { error } = await supabase.from('waitlist').insert({ email });

    if (error) {
      if (error.code === '23505') {
        // Code PostgreSQL pour violation de contrainte UNIQUE
        setError("Cet email est déjà sur la liste d’attente.");
      } else {
        setError("Une erreur est survenue. Réessaye plus tard.");
        console.error(error);
      }
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
        <p className="mt-4 text-green-600">Merci ! Tu es bien inscrit(e) ✅</p>
      )}

      {error && (
        <p className="mt-4 text-red-600">{error}</p>
      )}
    </div>
  );
}
