# Various Archives Waitlist

Landing page "waitlist" construite avec Next.js (App Router), Tailwind CSS v4, Supabase et Brevo.

## 1) Objectif du projet

Cette application affiche une page unique de pre-inscription (waitlist) pour "Various Archives".  
L'utilisateur saisit son email, qui est enregistre dans une table Supabase `waitlist`, puis synchronise vers une liste Brevo `Waitlist`.

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
- collecte l'email et appelle `POST /api/waitlist`
- la route serveur normalise le payload, upsert la ligne dans Supabase puis tente la sync Brevo
- en cas d'echec Brevo, l'inscription reste acceptee si Supabase a bien persiste la ligne

### Sync Brevo

Le projet utilise Brevo comme outil d'envoi et d'automation:
- `POST /api/waitlist` ajoute ou met a jour le contact dans la liste Brevo `Waitlist`
- `POST /api/waitlist/preferences` reenvoie le contact pour enrichir les attributs `PRENOM`, `NOM`, `GENDER_PIECES`, `CATEGORIES`, `FAVOURITE_DESIGNERS`
- `scripts/backfill-brevo.mjs` permet de resynchroniser tous les contacts existants depuis la table Supabase `waitlist`

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
SUPABASE_SECRET_KEY=...
# ou SUPABASE_SERVICE_ROLE_KEY=...
BREVO_API_KEY=...
BREVO_WAITLIST_LIST_ID=123
```

Important:
- les variables prefixees `NEXT_PUBLIC_` sont exposees au client
- les routes serveur utilisent `SUPABASE_SECRET_KEY` avec fallback sur `SUPABASE_SERVICE_ROLE_KEY`
- il faut creer au prealable la liste Brevo `Waitlist` et recuperer son `listId`
- si tu veux enrichir les contacts avec les preferences, verifier dans Brevo les attributs `PRENOM`, `NOM`, `GENDER_PIECES`, `CATEGORIES`, `FAVOURITE_DESIGNERS`
- `CATEGORIES` doit etre un attribut Brevo de type `multiple-choice`

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
- `npm run backfill:brevo`: relit la table Supabase `waitlist` par lots et pousse les contacts vers Brevo

Exemple de backfill manuel:

```bash
npm run backfill:brevo
```

Optionnel:
- `BREVO_BACKFILL_BATCH_SIZE=500 npm run backfill:brevo`

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
