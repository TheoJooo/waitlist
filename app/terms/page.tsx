import Link from 'next/link';

export const metadata = {
  title: 'Terms | Various Archives',
};

export default function TermsPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl px-6 py-14 text-[#1a140f]">
      <h1 className="font-serif-heading text-4xl">Terms of Service</h1>
      <p className="mt-4 text-sm leading-relaxed text-[#4b4032]">
        This placeholder page exists so the landing page footer links resolve correctly. Replace
        this content with your legal terms before launch.
      </p>
      <Link href="/" className="mt-8 inline-flex text-sm underline underline-offset-2">
        Back to waitlist
      </Link>
    </main>
  );
}
