# Various Archives Waitlist

Landing page "waitlist" construite avec Next.js (App Router), Tailwind CSS v4 et Supabase.

## 1) Objectif du projet

Cette application affiche une page unique de pre-inscription (waitlist) pour "Various Archives".  
L'utilisateur saisit son email, qui est enregistre dans une table Supabase `waitlist`.

## 2) Stack technique

- Next.js `15.4.2` (App Router)
- React `19.1.0`
- TypeScript
- Tailwind CSS `v4` (via `@tailwindcss/postcss`)
- Supabase JS client `@supabase/supabase-js`
- OGL (`ogl`) pour un fond Aurora WebGL anime

## 3) Structure du code

```text
app/
  globals.css          # styles globaux + variables de theme
  layout.tsx           # layout racine + metadata + fonts
  page.tsx             # page d'accueil (composition UI)
components/
  Aurora.tsx           # fond anime WebGL (shader + OGL)
  SpotlightCard.tsx    # carte avec effet spotlight au survol
  WaitlistForm.tsx     # formulaire + envoi Supabase + gestion erreurs
public/
  logo.png             # logo affiche sur la landing
next.config.ts
postcss.config.mjs
tsconfig.json
```

## 4) Fonctionnement de l'application

### UI (page principale)

`app/page.tsx` assemble l'ecran:
- un `<main>` plein ecran
- le composant `Aurora` en fond absolu
- le logo (`public/logo.png`)
- une `SpotlightCard` contenant le `WaitlistForm`
- un texte legal en bas

### Formulaire waitlist

`components/WaitlistForm.tsx`:
- cree un client Supabase cote navigateur avec:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- valide l'email via regex (`EMAIL_RGX`)
- insere `{ email }` dans la table `waitlist`
- gere les cas:
  - succes: message de confirmation
  - doublon (`error.code === '23505'`): email deja inscrit
  - autre erreur: message generique
- affiche une modal d'erreur fermable

### Effets visuels

`components/Aurora.tsx`:
- initialise un contexte WebGL via `ogl`
- compile un shader (vertex + fragment)
- anime le rendu avec `requestAnimationFrame`
- adapte la resolution au resize

`components/SpotlightCard.tsx`:
- suit la position souris dans la carte
- applique un `radial-gradient` dynamique (effet halo)
- gere focus/blur/hover pour l'opacite

## 5) Prerequis

- Node.js 18+ (recommande: LTS recente)
- npm (ou yarn/pnpm/bun)
- un projet Supabase avec la table `waitlist`

## 6) Variables d'environnement

Creer un fichier `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

Important:
- les variables prefixees `NEXT_PUBLIC_` sont exposees au client
- il faut configurer les policies Supabase (RLS) correctement pour autoriser l'insertion attendue

## 7) Configuration Supabase minimale (exemple)

Exemple SQL (a adapter):

```sql
create table if not exists public.waitlist (
  id bigint generated always as identity primary key,
  email text not null unique,
  created_at timestamptz not null default now()
);
```

Le code detecte explicitement l'erreur Postgres `23505` (contrainte `unique`) pour signaler les emails deja inscrits.

## 8) Installation et lancement

```bash
npm install
npm run dev
```

Puis ouvrir: [http://localhost:3000](http://localhost:3000)

## 9) Scripts npm

- `npm run dev`: lance Next.js en mode developpement (Turbopack)
- `npm run build`: build de production
- `npm run start`: lance le serveur de production
- `npm run lint`: lint Next.js

## 10) Styles et theming

- Tailwind CSS v4 est importe dans `app/globals.css`
- des variables CSS (`--background`, `--foreground`) sont definies
- `layout.tsx` charge les polices Geist + Inter via `next/font/google`

## 11) Points d'attention

- Le projet est majoritairement "client-side" pour la page d'accueil (`'use client'`).
- La cle anonymisee Supabase est publique par design cote front; la securite repose sur les policies Supabase.
- `gsap` est present dans `package.json` mais non utilise dans les fichiers actuels.

## 12) Deploiement

Deploiement standard Next.js possible (Vercel ou autre):
1. definir les variables d'environnement de production
2. executer `npm run build`
3. demarrer avec `npm run start` (ou workflow plateforme)
