import { useState } from 'react';
import { Mail, MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

export function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Editorial Inquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useSEO({
    title: 'Contact Editorial Desk & Press',
    description: 'Reach out to the EduAI editorial team for story tips, sponsorships, or general inquiries.',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
          Contact EduAI
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          Have an AI research tip, feedback on an article, or partnership proposition?
        </p>
      </div>

      {submitted ? (
        <div className="p-10 rounded-2xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-950/20 text-center space-y-4">
          <CheckCircle2 className="w-12 h-12 text-emerald-600 dark:text-emerald-400 mx-auto" />
          <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
            Message Dispatched
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-md mx-auto">
            Thank you for reaching out, {name}. Our editorial team reviews inbound dispatches within 24 hours.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="text-xs font-bold text-[#635BFF] hover:underline"
          >
            Send another message
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm space-y-5"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Ada Lovelace"
                className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#635BFF]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
                Work Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="ada@example.com"
                className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#635BFF]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
              Subject Category
            </label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm text-neutral-900 dark:text-white focus:outline-none"
            >
              <option value="Editorial Inquiry">Editorial Inquiry &amp; Story Tip</option>
              <option value="Technical Corrections">Technical Correction / Errata</option>
              <option value="Sponsorship & Ads">Sponsorship &amp; Commercial Partnerships</option>
              <option value="Press Inquiries">Press &amp; Media Interview Request</option>
              <option value="Careers">Writing for EduAI</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={5}
              placeholder="Provide context, research links, or pitch details..."
              className="w-full px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#635BFF]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-bold hover:bg-[#635BFF] dark:hover:bg-[#635BFF] dark:hover:text-white transition flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            Send Inquiry
          </button>
        </form>
      )}
    </div>
  );
}
