import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Support | Various Archives',
  description: 'Get help with Various Archives — contact our team or find answers to common questions.',
  alternates: {
    canonical: '/support',
  },
};

export default function SupportPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl px-6 py-14 text-[#1a140f]">
      <Link href="/waitlist" className="inline-flex text-sm underline underline-offset-2">
        Back to waitlist
      </Link>

      <h1 className="mt-8 text-4xl font-semibold tracking-tight">Support</h1>

      <div className="mt-6 space-y-3 text-sm leading-6 text-[#4b4032]">
        <p>
          Need help with Various Archives? We&apos;re here for buyers, sellers, and Shopify merchants
          using the Various Archives Connector.
        </p>
      </div>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-[#1a140f]">Contact us</h2>
        <div className="mt-2 space-y-3 text-sm leading-6 text-[#4b4032]">
          <p>
            Email us at{' '}
            <a
              href="mailto:support@various-archives.com"
              className="underline underline-offset-2"
            >
              support@various-archives.com
            </a>
            . We typically respond within 2 business days.
          </p>
          <p>
            For general inquiries, you can also reach us at{' '}
            <a
              href="mailto:contact@various-archives.com"
              className="underline underline-offset-2"
            >
              contact@various-archives.com
            </a>
            .
          </p>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-[#1a140f]">Shopify merchants</h2>
        <div className="mt-2 space-y-3 text-sm leading-6 text-[#4b4032]">
          <p>
            If you installed the Various Archives Connector app and need help with onboarding,
            product publishing, billing, or disconnecting your store, email{' '}
            <a
              href="mailto:support@various-archives.com"
              className="underline underline-offset-2"
            >
              support@various-archives.com
            </a>{' '}
            with your shop domain and a description of your issue.
          </p>
          <p>
            To disconnect your store at any time, open the app in your Shopify admin, go to
            Settings, and click <strong>Disconnect</strong>. You can reconnect at any time.
          </p>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-[#1a140f]">Privacy and data requests</h2>
        <div className="mt-2 space-y-3 text-sm leading-6 text-[#4b4032]">
          <p>
            To request access to, correction of, or deletion of personal data held by Various
            Archives, email{' '}
            <a
              href="mailto:contact@various-archives.com"
              className="underline underline-offset-2"
            >
              contact@various-archives.com
            </a>
            . See our{' '}
            <Link href="/privacy" className="underline underline-offset-2">
              Privacy Policy
            </Link>{' '}
            for details on your rights.
          </p>
        </div>
      </section>
    </main>
  );
}
