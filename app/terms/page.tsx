import type { Metadata } from 'next';
import Link from 'next/link';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Terms of Service | Various Archives',
  description: 'Terms governing access to and use of the Various Archives service.',
  alternates: {
    canonical: '/terms',
  },
};

const lastUpdated = 'March 8, 2026';

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-8">
      <h2 className="text-lg font-semibold text-[#1a140f]">{title}</h2>
      <div className="mt-2 space-y-3 text-sm leading-6 text-[#4b4032]">{children}</div>
    </section>
  );
}

function List({ items }: { items: readonly ReactNode[] }) {
  return (
    <ul className="space-y-1 pl-5">
      {items.map((item, index) => (
        <li key={index} className="list-disc">
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function TermsPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl px-6 py-14 text-[#1a140f]">
      <Link href="/waitlist" className="inline-flex text-sm underline underline-offset-2">
        Back to waitlist
      </Link>

      <h1 className="mt-8 text-4xl font-semibold tracking-tight">Terms of Service</h1>
      <p className="mt-3 text-sm text-[#4b4032]">Last updated: {lastUpdated}</p>

      <div className="mt-6 space-y-3 text-sm leading-6 text-[#4b4032]">
        <p>
          These Terms of Service (&quot;Terms&quot;) govern your access to and use of the Various
          Archives website and related services (&quot;Service&quot;). By accessing or using the
          Service, you agree to these Terms.
        </p>
        <p>If you do not agree, do not use the Service.</p>
      </div>

      <Section title="1. Who we are">
        <p>Data Controller / Publisher: Various Archives</p>
        <p>Legal status: Various Archives</p>
        <p>Registered address: Tokyo, Seoul, Paris.</p>
        <p>
          Email:{' '}
          <a href="mailto:contact@various-archives.com" className="underline underline-offset-2">
            contact@various-archives.com
          </a>
        </p>
      </Section>

      <Section title="2. What Various Archives is (and is not)">
        <p>
          Various Archives is a curated discovery platform for luxury vintage and archival fashion,
          featuring selections sourced from professional sellers.
        </p>
        <p>
          Purchases are completed on sellers&apos; own websites. Various Archives does not process
          payments and is not a party to the sale contract between you and the seller.
        </p>
        <p>
          The seller is the merchant of record and is responsible for checkout, invoicing,
          shipping, returns, refunds, taxes, duties, and after-sales support.
        </p>
      </Section>

      <Section title="3. Eligibility">
        <p className="font-medium text-[#1a140f]">3.1 General use</p>
        <p>
          You may use the Service only if you can form a legally binding contract under applicable
          law.
        </p>

        <p className="font-medium text-[#1a140f]">3.2 Newsletter and consent-based features</p>
        <p>
          You may only subscribe to our newsletter or use any feature that relies on your consent
          if you are old enough to provide valid consent under the laws of your country.
        </p>
        <p>
          If you are located in the European Economic Area, this generally means you must be at
          least 16 years old, unless your country sets a lower age, and never below 13.
        </p>
        <p>
          If you are below the applicable age, you must not use consent-based features unless a
          parent or legal guardian provides or authorizes consent where required by law.
        </p>

        <p className="font-medium text-[#1a140f]">3.3 Sellers</p>
        <p>
          If you apply as a seller or act on behalf of a business, you represent that you are at
          least 18 years old and have authority to bind the business.
        </p>
      </Section>

      <Section title="4. No user accounts (current MVP)">
        <p>
          At this stage, the Service does not offer user accounts. Certain features, such as
          wishlists, may be stored locally in your browser through local storage or similar
          technologies.
        </p>
        <p>If and when accounts are introduced, we will update these Terms.</p>
      </Section>

      <Section title="5. Professional sellers only">
        <p className="font-medium text-[#1a140f]">5.1 Definition</p>
        <p>
          A &quot;Professional Seller&quot; is a seller operating as a business, including as a
          secondary professional activity, with a curated offer and expertise in sourcing, and
          selling in a professional capacity rather than as a private individual.
        </p>

        <p className="font-medium text-[#1a140f]">5.2 Selection and verification</p>
        <p>
          Seller onboarding is curated and reviewed manually. We may request proof of professional
          status, such as business registration information, store documentation, or other
          verification materials. Acceptance is at our discretion.
        </p>

        <p className="font-medium text-[#1a140f]">5.3 Removal and dereferencing</p>
        <p>
          We may refuse, suspend, or remove a seller or listings from the Service if we reasonably
          believe that:
        </p>
        <List
          items={[
            'the seller or listings may involve counterfeit goods or illegal activity',
            'the seller violates these Terms',
            'we receive credible reports or repeated complaints',
            'the seller fails to provide requested verification information',
            'continued listing could harm users or the integrity of the Service',
          ]}
        />
      </Section>

      <Section title="6. Curation, ranking, and discovery">
        <p>The Service may display and organize listings using:</p>
        <List
          items={[
            'filters, for example brand, size, category, seller location, condition, price, collectability, color, or era',
            'sorting options, for example new, trending, price low to high, or price high to low',
            'editorial selections and themed highlights',
          ]}
        />
        <p>We do not currently offer paid placement or sponsored ranking. If that changes, we will clearly disclose it.</p>
      </Section>

      <Section title="7. Seller content on Various Archives">
        <p className="font-medium text-[#1a140f]">7.1 License to display seller content</p>
        <p>
          Sellers grant Various Archives a non-exclusive, worldwide, royalty-free license to host,
          display, reproduce, and make available seller-provided content, including photos,
          descriptions, and product information, solely to operate, improve, and promote the
          Service.
        </p>
        <p>
          We may apply technical formatting changes, such as resizing, compression, or layout
          adjustments, without changing the meaning of the content.
        </p>

        <p className="font-medium text-[#1a140f]">7.2 Seller warranties</p>
        <p>
          Sellers represent and warrant that they own or control the necessary rights to the
          content they provide, and that the content does not infringe third-party rights or
          contain misleading or unlawful material.
        </p>
      </Section>

      <Section title="8. Your obligations and prohibited uses">
        <p>You agree not to:</p>
        <List
          items={[
            'use the Service for unlawful purposes',
            'attempt to purchase, promote, or list counterfeit goods through the Service',
            'scrape, harvest, crawl, or extract data from the Service using automated means without our prior written permission',
            'interfere with the Service, its security, or its performance, including by introducing malware or conducting denial-of-service attempts',
            'reverse engineer, copy, or reproduce substantial parts of the Service, its structure, or its content for commercial use without authorization',
            'impersonate others or misrepresent your affiliation with a person or entity',
          ]}
        />
        <p>
          We may implement technical measures to protect the Service, including rate limiting,
          abuse prevention, and logging.
        </p>
      </Section>

      <Section title="9. Reporting and notice and action">
        <p>
          If you believe content on the Service is illegal, including counterfeit listings or
          intellectual property infringement, you may report it by email to{' '}
          <a href="mailto:contact@various-archives.com" className="underline underline-offset-2">
            contact@various-archives.com
          </a>
          .
        </p>
        <p>To help us process a report, include:</p>
        <List
          items={[
            'a clear description of the content and where it appears, such as a URL or screenshots',
            'why you believe it is illegal',
            'your name and email address, unless you are legally entitled to submit an anonymous notice',
            'a statement confirming you have a good-faith belief that the information is accurate',
          ]}
        />
        <p>We will review notices and may remove content or dereference sellers.</p>
      </Section>

      <Section title="10. Actions we may take and reasons">
        <p>
          We may restrict or remove access to content or take measures against sellers or users who
          violate these Terms, or where required for legal compliance and safety. Where applicable,
          we will provide a clear statement of reasons to the affected party.
        </p>
      </Section>

      <Section title="11. Third-party websites and external links">
        <p>
          The Service links to third-party websites, including sellers&apos; websites. We do not
          control those websites and are not responsible for their content, terms, privacy
          practices, availability, or any transactions conducted there.
        </p>
      </Section>

      <Section title="12. Authenticity and product information">
        <p>
          Sellers are responsible for authenticating items they offer, and for the accuracy of
          listings, pricing, availability, and condition information.
        </p>
        <p>
          Various Archives does not independently authenticate items at this stage and does not
          guarantee authenticity, quality, legality, or compliance of items sold by sellers.
        </p>
      </Section>

      <Section title="13. Disclaimers">
        <p>
          The Service is provided on an &quot;as is&quot; and &quot;as available&quot; basis. We
          may modify, suspend, or discontinue parts of the Service at any time, including for
          maintenance, updates, or technical reasons.
        </p>
        <p>
          To the maximum extent permitted by law, we disclaim all warranties, whether express or
          implied, including fitness for a particular purpose and non-infringement.
        </p>
      </Section>

      <Section title="14. Limitation of liability">
        <p>To the maximum extent permitted by law:</p>
        <List
          items={[
            'Various Archives is not liable for transactions between buyers and sellers, including payment, delivery, returns, refunds, or disputes',
            'Various Archives is not liable for any indirect, incidental, special, consequential, or punitive damages',
            'our total liability for any claim related to the Service will not exceed the amount you paid to Various Archives in the 12 months preceding the event giving rise to the claim, which is expected to be zero at this stage, unless mandatory law provides otherwise',
          ]}
        />
        <p>Nothing in these Terms limits liability where such limitation is prohibited by applicable law.</p>
      </Section>

      <Section title="15. Intellectual property">
        <p>
          The Service, including its design, structure, branding, logo, and original content
          created by Various Archives, is protected by intellectual property laws.
        </p>
        <p>
          You may use the Service for personal, non-commercial purposes only. You must not
          reproduce or exploit Service content except as permitted by law or with our prior written
          permission.
        </p>
      </Section>

      <Section title="16. Changes to these Terms">
        <p>
          We may update these Terms from time to time. We will update the &quot;Last updated&quot;
          date and may provide additional notice if changes are material. Your continued use of the
          Service after updates means you accept the updated Terms.
        </p>
      </Section>

      <Section title="17. Privacy and cookies">
        <p>
          Our processing of personal data is described in our{' '}
          <Link href="/privacy" className="underline underline-offset-2">
            Privacy Policy
          </Link>
          .
        </p>
        <p>Cookies and consent management are described in our Cookie Policy.</p>
      </Section>

      <Section title="18. Governing law and jurisdiction">
        <p>These Terms are governed by French law.</p>
        <p>
          If you are acting as a consumer, any dispute will fall under the jurisdiction determined
          by applicable consumer protection rules.
        </p>
        <p>
          If you are acting for professional purposes, and unless mandatory rules provide
          otherwise, the courts of Tokyo shall have
          exclusive jurisdiction.
        </p>
      </Section>

      <Section title="19. Contact">
        <p>
          For questions about these Terms or the Service, contact us at{' '}
          <a href="mailto:contact@various-archives.com" className="underline underline-offset-2">
            contact@various-archives.com
          </a>
          .
        </p>
      </Section>
    </main>
  );
}
