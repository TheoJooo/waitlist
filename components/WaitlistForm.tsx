'use client';

import { createClient } from '@supabase/supabase-js';
import { useState } from 'react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// export default function WaitlistForm() {
//     const [email, setEmail] = useState('');
//     const [success, setSuccess] = useState(false);
//     const [errorMsg, setErrorMsg] = useState('');
  
//     const handleSubmit = async (e: React.FormEvent) => {
//       e.preventDefault();
//       setErrorMsg('');
  
//       const { error } = await supabase.from('waitlist').insert({ email });
  
//       if (error) {
//         if (error.code === '23505') {
//           setErrorMsg('Cet email est déjà inscrit.');
//         } else {
//           setErrorMsg('Une erreur est survenue. Réessaie plus tard.');
//         }
//         return;
//       }
  
//       setSuccess(true);
//       setEmail('');
//     };
  
//     return (
//       <div className="flex flex-col items-center">
//         {/* Formulaire */}
//         {!success && (
//           <form onSubmit={handleSubmit} className="flex gap-3">
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="you@example.com"
//               required
//               className="w-64 px-4 py-2 border rounded"
//             />
//             <button
//               type="submit"
//               className="px-4 py-2 font-medium text-white transition bg-indigo-600 rounded hover:bg-indigo-500"
//             >
//               S’inscrire
//             </button>
//           </form>
//         )}
  
//         {/* Message de succès */}
//         {success && (
//           <p className="mt-6 text-lg font-medium text-green-600">
//             Merci ! Tu es bien ajouté à la liste d’attente ✅
//           </p>
//         )}
  
//         {/* Modal d’erreur */}
//         {errorMsg && (
//           <div
//             className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
//             onClick={(e) => {
//               // ferme si on clique sur l’overlay, pas sur le contenu
//               if (e.target === e.currentTarget) setErrorMsg('');
//             }}
//           >
//             <div className="relative w-[90%] max-w-md p-6 text-center bg-white rounded-xl shadow-xl">
//               {/* bouton croix */}
//               <button
//                 aria-label="Fermer"
//                 onClick={() => setErrorMsg('')}
//                 className="absolute p-1 text-gray-500 rounded-full top-3 right-3 hover:bg-gray-100"
//               >
//                 ×
//               </button>
  
//               <h2 className="mb-4 text-xl font-semibold text-red-600">Oups…</h2>
//               <p className="mb-6 text-gray-700">{errorMsg}</p>
//               <button
//                 onClick={() => setErrorMsg('')}
//                 className="px-4 py-2 font-medium text-white transition bg-indigo-600 rounded hover:bg-indigo-500"
//               >
//                 Fermer
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   }  

const EMAIL_RGX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function WaitlistForm() {
    const [email, setEmail] = useState('');
    const [success, setSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [formatErr, setFormatErr] = useState('');
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setErrorMsg('');
      setFormatErr('');
  
      if (!EMAIL_RGX.test(email)) {
        setFormatErr('Invalid email address.');
        return;
      }
  
      const { error } = await supabase.from('waitlist').insert({ email });
  
      if (error) {
        if (error.code === '23505') {
          setErrorMsg('This email is already registered.');
        } else {
          setErrorMsg('An error occurred. Please try again later.');
        }
        return;
      }
  
      setSuccess(true);
      setEmail('');
    };
  
    return (
      <div className="flex flex-col items-center">

        <h1 className="mb-6 text-sm text-gray-200 font-semibold text-center">
          {success ? 'Thank you for signing up.' : 'Private Beta'}
        </h1>
  
        {!success && (
          <form onSubmit={handleSubmit} className="flex flex-col items-center gap-2">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="various@example.com"
              className={
                'w-64 px-4 py-2 border text-sm focus:outline-none ' +
                (formatErr ? 'border-red-500' : 'border-gray-300')
              }
            />

            {formatErr && <p className="text-sm text-red-300">{formatErr}</p>}
  
            <button
              type="submit"
              className="w-64 px-4 py-2 font-medium text-sm text-black transition bg-white hover:bg-lime-50"
            >
              Join the waitlist
            </button>
          </form>
        )}
  
        {success && (
          <p className="mt-4 text-green-300 text-sm font-medium">
            You’ll receive an email at launch ✅
          </p>
        )}
  
        {errorMsg && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
            onClick={(e) => {
              if (e.target === e.currentTarget) setErrorMsg('');
            }}
          >
            <div className="relative w-[90%] max-w-md p-6 text-sm text-center bg-black rounded-xl shadow-xl">
              <button
                aria-label="Close"
                onClick={() => setErrorMsg('')}
                className="absolute top-3 right-3 p-2 text-sm text-white rounded-full hover:bg-gray-800"
              >
                ×
              </button>
              <h2 className="mb-4 text-sm font-semibold text-red-300">Oups…</h2>
              <p className="mb-6 text-sm text-white">{errorMsg}</p>
              <button
                onClick={() => setErrorMsg('')}
                className="px-4 py-2 font-medium text-sm text-black transition bg-white rounded hover:bg-lime-50"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
  