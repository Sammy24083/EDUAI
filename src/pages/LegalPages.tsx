import { useSEO } from '../hooks/useSEO';

export function PrivacyPage() {
  useSEO({ title: 'Privacy Policy', description: 'EduAI Privacy Policy and GDPR compliance details.' });

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 prose prose-neutral dark:prose-invert">
      <h1>Privacy Policy</h1>
      <p className="lead text-sm text-neutral-500">Last updated: September 2026</p>
      <h2>1. Information We Collect</h2>
      <p>
        EduAI operates on minimal user data collection. When you register or subscribe to our newsletter, we securely store your email address and authentication credentials in Google Cloud Firebase.
      </p>
      <h2>2. How We Use Information</h2>
      <p>
        Your data is strictly used to deliver editorial newsletters, authenticate comment submissions, and preserve your saved reading list. We never sell your personal data to third-party data brokers.
      </p>
      <h2>3. Third-Party Services</h2>
      <p>
        We utilize Google Firebase Authentication, Firestore databases, and industry-standard analytics to understand publication readership trends in aggregate.
      </p>
      <h2>4. Your Rights</h2>
      <p>
        You may request deletion of your account and associated comments at any time by contacting privacy@eduai.media.
      </p>
    </div>
  );
}

export function TermsPage() {
  useSEO({ title: 'Terms of Service', description: 'EduAI Terms of Service and editorial licensing.' });

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 prose prose-neutral dark:prose-invert">
      <h1>Terms of Service</h1>
      <p className="lead text-sm text-neutral-500">Last updated: September 2026</p>
      <h2>1. Acceptance of Terms</h2>
      <p>
        By accessing EduAI, you agree to comply with and be bound by these terms of service and our community guidelines.
      </p>
      <h2>2. Intellectual Property</h2>
      <p>
        All original editorial articles, research charts, and written content published on EduAI are the property of EduAI and its respective contributing authors.
      </p>
      <h2>3. Code Examples &amp; Open Source</h2>
      <p>
        Code snippets and architectural diagrams in technical tutorials are provided under permissive MIT terms for developer experimentation unless otherwise stated.
      </p>
    </div>
  );
}

export function CookiePage() {
  useSEO({ title: 'Cookie Policy', description: 'Cookie usage and tracking preferences.' });

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 prose prose-neutral dark:prose-invert">
      <h1>Cookie Policy</h1>
      <p className="lead text-sm text-neutral-500">Last updated: September 2026</p>
      <p>
        EduAI uses strictly necessary cookies and local storage tokens to preserve your login session, saved article bookmarks, and dark/light mode appearance preferences.
      </p>
    </div>
  );
}
