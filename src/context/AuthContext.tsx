import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { UserProfile, UserRole } from '../types';

const ADMIN_EMAIL = 'amaechisamuelugo@gmail.com';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  role: UserRole;
  isAdmin: boolean;
  isEditor: boolean;
  isAuthor: boolean;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (email: string, pass: string, name: string, username: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfileData: (updates: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Sync profile from Firestore whenever Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const snap = await getDoc(userDocRef);

          const isBootstrappedAdmin = firebaseUser.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

          if (snap.exists()) {
            const data = snap.data() as UserProfile;
            // Upgrade to admin if email matches bootstrapped admin
            if (isBootstrappedAdmin && data.role !== 'admin') {
              data.role = 'admin';
              await updateDoc(userDocRef, { role: 'admin' });
            }
            setProfile(data);
          } else {
            // Initialize new user profile
            const newRole: UserRole = isBootstrappedAdmin ? 'admin' : 'user';
            const baseUsername = firebaseUser.email
              ? firebaseUser.email.split('@')[0].replace(/[^a-zA-Z0-9_-]/g, '')
              : `user_${firebaseUser.uid.slice(0, 5)}`;

            const newProfile: UserProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || baseUsername || 'Reader',
              username: baseUsername,
              photoURL: firebaseUser.photoURL || undefined,
              role: newRole,
              createdAt: new Date().toISOString(),
            };

            await setDoc(userDocRef, newProfile);
            setProfile(newProfile);

            // Also register in /admins collection if bootstrapped admin
            if (isBootstrappedAdmin) {
              await setDoc(doc(db, 'admins', firebaseUser.uid), {
                email: firebaseUser.email,
                role: 'admin',
                addedAt: new Date().toISOString(),
              });
            }
          }
        } catch (err) {
          console.error('Error fetching user profile:', err);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const loginWithEmail = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const registerWithEmail = async (email: string, pass: string, name: string, username: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    await updateProfile(cred.user, { displayName: name });

    const isBootstrappedAdmin = email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
    const newProfile: UserProfile = {
      uid: cred.user.uid,
      email,
      displayName: name,
      username: username.toLowerCase().trim() || email.split('@')[0],
      role: isBootstrappedAdmin ? 'admin' : 'user',
      createdAt: new Date().toISOString(),
    };

    await setDoc(doc(db, 'users', cred.user.uid), newProfile);
    if (isBootstrappedAdmin) {
      await setDoc(doc(db, 'admins', cred.user.uid), {
        email,
        role: 'admin',
        addedAt: new Date().toISOString(),
      });
    }
    setProfile(newProfile);
  };

  const logout = async () => {
    await signOut(auth);
    setProfile(null);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const updateProfileData = async (updates: Partial<UserProfile>) => {
    if (!user || !profile) return;
    const docRef = doc(db, 'users', user.uid);
    const updated = {
      ...profile,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    await updateDoc(docRef, updated);
    setProfile(updated);
  };

  const currentRole: UserRole = profile?.role || (user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? 'admin' : 'user');
  const isAdmin = currentRole === 'admin';
  const isEditor = isAdmin || currentRole === 'editor';
  const isAuthor = isEditor || currentRole === 'author';

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        role: currentRole,
        isAdmin,
        isEditor,
        isAuthor,
        loading,
        signInWithGoogle,
        loginWithEmail,
        registerWithEmail,
        logout,
        resetPassword,
        updateProfileData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
