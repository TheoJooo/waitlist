'use client';

import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import StarBorder from '@/components/ui/star-border';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

const CATEGORIES = ['Bags', 'Clothing', 'Shoes', 'Accessories', 'Jewelry'];

type Gender = 'Women\'s' | 'Men\'s' | 'Both' | null;

export default function ThankYouPage() {
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState<Gender>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [designers, setDesigners] = useState('');
  const [firstName, setFirstName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('waitlist_email');
      if (stored) setEmail(stored);
    } catch {}
  }, []);

  const toggleCategory = (cat: string) => {
    setCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError('');

    const payload = {
      email,
      gender,
      categories: categories.join(', '),
      favourite_designers: designers.trim(),
      first_name: firstName.trim(),
    };

    if (supabase && email) {
      const { error } = await supabase.from('waitlist_preferences').insert(payload);
      if (error && error.code !== 'PGRST204') {
        // Fallback: try updating the waitlist row directly
        await supabase.from('waitlist').update({
          gender: payload.gender,
          categories: payload.categories,
          favourite_designers: payload.favourite_designers,
          first_name: payload.first_name,
        }).eq('email', email);
      }
    }

    setIsSaving(false);
    setSaved(true);
  };

  return (
    <main className="min-h-screen bg-[var(--body-background)] text-[var(--main-black)]">
      <div className="mx-auto w-full max-w-xl px-6 py-16">

        {/* Zone 1 — Confirmation */}
        <section>
          <h1 className="text-3xl font-semibold">You&apos;re on the list.</h1>
          <p className="mt-3 text-base text-[var(--text-grey)]">
            We&apos;ll be in touch with early access details and first looks. Check your inbox for a confirmation.
          </p>
        </section>

        {/* Zone 2 — Preferences */}
        <section className="mt-12 border-t border-[var(--outline)] pt-10">
          <h2 className="text-xl font-semibold">Tell us what you&apos;re looking for.</h2>
          <p className="mt-2 text-sm text-[var(--text-grey)]">
            Optional. 20 seconds. So we show you the right pieces first.
          </p>

          {saved ? (
            <div className="mt-8 border border-[var(--alt-grey)] p-5">
              <p className="text-base font-medium">Preferences saved.</p>
              <p className="mt-1 text-sm text-[var(--text-grey)]">You can update these anytime.</p>
            </div>
          ) : (
            <div className="mt-8 space-y-8">

              {/* Gender */}
              <div>
                <p className="text-sm font-medium mb-3">I&apos;m looking for</p>
                <div className="flex gap-2 flex-wrap">
                  {(["Women's", "Men's", "Both"] as const).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGender(g)}
                      className={`border px-4 py-2 text-sm transition-colors ${
                        gender === g
                          ? 'border-[var(--main-black)] bg-[var(--main-black)] text-white'
                          : 'border-[var(--alt-grey)] hover:border-[var(--main-black)]'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div>
                <p className="text-sm font-medium mb-3">I&apos;m interested in</p>
                <div className="flex gap-2 flex-wrap">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => toggleCategory(cat)}
                      className={`border px-4 py-2 text-sm transition-colors ${
                        categories.includes(cat)
                          ? 'border-[var(--main-black)] bg-[var(--main-black)] text-white'
                          : 'border-[var(--alt-grey)] hover:border-[var(--main-black)]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Designers */}
              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="designers">
                  Favourite designers
                </label>
                <input
                  id="designers"
                  type="text"
                  value={designers}
                  onChange={(e) => setDesigners(e.target.value)}
                  placeholder="e.g. Margiela, Prada, Helmut Lang"
                  className="h-11 w-full border border-neutral-300 bg-white px-3 text-black outline-none transition focus:border-black"
                />
              </div>

              {/* First name */}
              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="firstName">
                  First name
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Your first name"
                  className="h-11 w-full border border-neutral-300 bg-white px-3 text-black outline-none transition focus:border-black"
                />
              </div>

              <div>
                <StarBorder
                  as="button"
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="w-full"
                  color="rgba(17, 17, 17, 0.75)"
                  speed="3.5s"
                  thickness={1.5}
                >
                  {isSaving ? 'Saving...' : 'Save my preferences'}
                </StarBorder>
                <p className="mt-3 text-xs text-neutral-500">You can update these anytime.</p>
                {saveError ? <p className="mt-2 text-sm text-red-700">{saveError}</p> : null}
              </div>

            </div>
          )}
        </section>

      </div>
    </main>
  );
}
