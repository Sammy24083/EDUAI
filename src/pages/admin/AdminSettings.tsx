import { useState } from 'react';
import {
  Shield,
  Sparkles,
  CheckCircle2,
  Terminal,
  RefreshCw,
  Key,
  Database,
  ExternalLink,
  AlertTriangle,
  Server,
  HardDrive,
} from 'lucide-react';
import { AdminLayout } from './AdminLayout';
import { useAuth } from '../../context/AuthContext';
import { seedDatabase } from '../../services/seedService';
import { validateFirestoreConnection, db } from '../../services/firebase';
import firebaseConfig from '../../../firebase-applet-config.json';
import { useSEO } from '../../hooks/useSEO';

export function AdminSettings() {
  const { user, profile, isAdmin } = useAuth();
  const [seeding, setSeeding] = useState(false);
  const [seedDone, setSeedDone] = useState(false);
  const [seedError, setSeedError] = useState<string | null>(null);

  const [testingDb, setTestingDb] = useState(false);
  const [dbTestResult, setDbTestResult] = useState<{
    tested: boolean;
    success: boolean;
    message: string;
  } | null>(null);

  useSEO({ title: 'CMS System Settings — EduAI CMS', description: 'System configuration and admin credentials.' });

  const handleTestDatabase = async () => {
    setTestingDb(true);
    setDbTestResult(null);
    try {
      await validateFirestoreConnection();
      setDbTestResult({
        tested: true,
        success: true,
        message: 'Successfully reached Cloud Firestore service! Database is online and ready.',
      });
    } catch (err: unknown) {
      setDbTestResult({
        tested: true,
        success: false,
        message: err instanceof Error ? err.message : 'Database ping failed. Ensure Cloud Firestore is enabled in Firebase Console.',
      });
    } finally {
      setTestingDb(false);
    }
  };

  const handleSeed = async () => {
    if (!confirm('Populate database with default categories, taxonomy, and editorial articles?')) return;
    setSeeding(true);
    setSeedError(null);
    try {
      await seedDatabase();
      setSeedDone(true);
      setTimeout(() => setSeedDone(false), 5000);
    } catch (err) {
      console.error('Seeding failed:', err);
      setSeedError(err instanceof Error ? err.message : 'Failed to seed database.');
    } finally {
      setSeeding(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl space-y-8">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900 dark:text-white">
            System &amp; Database Settings
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Cloud Firestore database state, administrator authority, storage buckets, and content seeding.
          </p>
        </div>

        {/* Cloud Firestore Diagnostics Card */}
        <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Database className="w-5 h-5 text-[#635BFF]" />
              <div>
                <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
                  Cloud Firestore Configuration &amp; Health
                </h3>
                <p className="text-xs text-neutral-500">Live configuration for persistent database storage</p>
              </div>
            </div>

            <button
              onClick={handleTestDatabase}
              disabled={testingDb}
              className="px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-xs font-semibold text-neutral-800 dark:text-neutral-200 transition flex items-center gap-1.5 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testingDb ? 'animate-spin' : ''}`} />
              {testingDb ? 'Testing Connection...' : 'Test Connection'}
            </button>
          </div>

          {dbTestResult && (
            <div
              className={`p-3.5 rounded-xl border text-xs flex items-center gap-2.5 ${
                dbTestResult.success
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                  : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300'
              }`}
            >
              {dbTestResult.success ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
              )}
              <span>{dbTestResult.message}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-0.5">
                Firebase Project ID
              </span>
              <span className="font-mono font-bold text-neutral-900 dark:text-white">
                {firebaseConfig.projectId}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-0.5">
                Configured Database ID
              </span>
              <span className="font-mono font-bold text-[#635BFF]">
                {firebaseConfig.firestoreDatabaseId || '(default)'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-0.5">
                Firebase Storage Bucket
              </span>
              <span className="font-mono text-neutral-800 dark:text-neutral-200 truncate block">
                {firebaseConfig.storageBucket || 'Embedded Fallback Active'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-0.5">
                Authentication Domain
              </span>
              <span className="font-mono text-neutral-800 dark:text-neutral-200 truncate block">
                {firebaseConfig.authDomain}
              </span>
            </div>
          </div>

          {/* Quick Guide on Firebase Console Enablement */}
          <div className="p-4 rounded-xl bg-neutral-100 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700/60 space-y-2">
            <h4 className="font-bold text-xs text-neutral-900 dark:text-white flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-[#635BFF]" />
              How to enable Cloud Firestore in your Firebase Console:
            </h4>
            <ol className="list-decimal list-inside text-xs text-neutral-600 dark:text-neutral-400 space-y-1 pl-1">
              <li>
                Open the{' '}
                <a
                  href={`https://console.firebase.google.com/project/${firebaseConfig.projectId}/firestore`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#635BFF] hover:underline font-semibold inline-flex items-center gap-0.5"
                >
                  Firebase Firestore Console <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>Click the <strong>"Create database"</strong> button.</li>
              <li>Choose your preferred region (e.g., <em>europe-west2</em> or <em>us-central1</em>).</li>
              <li>Select <strong>"Start in production mode"</strong> (our hardened security rules are already deployed).</li>
              <li>Click <strong>Done</strong>. Your database will be active immediately and ready for publishing!</li>
            </ol>
          </div>
        </div>

        {/* Administrator Bootstrap Card */}
        <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-4 shadow-sm">
          <div className="flex items-center gap-2.5">
            <Shield className="w-5 h-5 text-[#635BFF]" />
            <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
              Root Administrator Authority
            </h3>
          </div>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Per the security specification in <code className="text-xs px-1 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 font-mono">firestore.rules</code>, master authority is hard-coded and bootstrapped for:
          </p>
          <div className="p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800/80 font-mono text-xs text-[#635BFF] font-bold flex items-center justify-between">
            <span>amaechisamuelugo@gmail.com</span>
            <span className="text-[10px] uppercase tracking-wider text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded font-sans font-bold">
              Root Superadmin
            </span>
          </div>
          <div className="text-xs text-neutral-500 space-y-1">
            <p>• Automatically granted full write access to all articles, comments, ads, and categories.</p>
            <p>• Any registered user can compose and publish articles directly using the "Write" tool in the top bar.</p>
          </div>
        </div>

        {/* Database Content Seeder */}
        <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-4 shadow-sm">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
              Content Database Seeder
            </h3>
          </div>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Populate your database with the complete category taxonomy (AI Engineering, Autonomous Agents, Software Systems, Startups), and default editorial articles and sample comments.
          </p>

          {seedDone && (
            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Database content successfully seeded!</span>
            </div>
          )}

          {seedError && (
            <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{seedError}</span>
            </div>
          )}

          <button
            onClick={handleSeed}
            disabled={seeding}
            className="px-4 py-2 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-bold hover:bg-[#635BFF] dark:hover:bg-[#635BFF] dark:hover:text-white transition flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${seeding ? 'animate-spin' : ''}`} />
            {seeding ? 'Executing Seeder...' : 'Execute Database Seeder'}
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
