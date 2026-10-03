import { Link } from 'react-router-dom';
import { Sparkles, Terminal, Code2, ShieldCheck, Cpu, Globe, Compass } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

export function AboutPage() {
  useSEO({
    title: 'Editorial Manifesto & Architecture',
    description: 'Learn about the mission, journalistic values, and engineering standards behind EduAI publication.',
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#635BFF]/10 text-[#635BFF] text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          Editorial Manifesto
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-neutral-900 dark:text-white tracking-tight leading-tight">
          Demystifying the Frontier of Artificial Intelligence
        </h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto leading-relaxed">
          EduAI is an independent technical publication dedicated to high-signal reporting, deep architecture teardowns, and rigorous engineering journalism.
        </p>
      </div>

      <div className="aspect-video w-full rounded-2xl overflow-hidden bg-neutral-900 relative shadow-lg">
        <img
          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&auto=format&fit=crop&q=80"
          alt="EduAI Editorial Board"
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent flex items-end p-8">
          <div className="text-white">
            <h3 className="font-bold text-xl">The EduAI Foundation</h3>
            <p className="text-xs text-neutral-300 mt-1">Founded in 2026 to report on the agentic compute transition.</p>
          </div>
        </div>
      </div>

      {/* Pillars */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
          Our Three Pillars
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center mb-4 font-bold">
              <Terminal className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-neutral-900 dark:text-white mb-2">
              Engineering First
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              We inspect source code, examine latency benchmarks, and reproduce model results before publishing conclusions.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
            <div className="w-10 h-10 rounded-xl bg-[#635BFF]/10 text-[#635BFF] flex items-center justify-center mb-4 font-bold">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-neutral-900 dark:text-white mb-2">
              Autonomous Systems
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              We focus on the monumental shift from static chatbots to autonomous multi-agent environments with real-world tool execution.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-4 font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-neutral-900 dark:text-white mb-2">
              Transparency &amp; Ethics
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Every sponsored article or affiliate collaboration is clearly disclosed to uphold pristine editorial independence.
            </p>
          </div>
        </div>
      </section>

      {/* Editorial standards */}
      <section className="space-y-4 text-neutral-700 dark:text-neutral-300 leading-relaxed text-sm">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
          Our Editorial Standards
        </h2>
        <p>
          We write for practicing AI researchers, principal engineers, tech founders, and curious technologists. We avoid superficial hype cycles and provide deep, actionable architectural analysis.
        </p>
        <p>
          If you have research disclosures, open-source models, or critical technical findings you want our team to review, reach out to our editorial desk.
        </p>
        <div className="pt-4">
          <Link
            to="/contact"
            className="inline-flex items-center px-5 py-2.5 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-bold hover:bg-[#635BFF] dark:hover:bg-[#635BFF] dark:hover:text-white transition"
          >
            Submit an Inquiry or Editorial Pitch →
          </Link>
        </div>
      </section>
    </div>
  );
}
