import { createContext, useContext, useState, useEffect } from 'react';
import {
  auth,
  googleProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from '../services/firebase';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  /* Listen to Firebase auth state */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL,
          role: localStorage.getItem('neuralyn_role') || 'user',
        });

        // Check if first-time user
        const onboarded = localStorage.getItem(`neuralyn_onboarded_${firebaseUser.uid}`);
        setNeedsOnboarding(!onboarded);
      } else {
        setUser(null);
        setNeedsOnboarding(false);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  /* ── Register with email/password ── */
  const register = async (email, password, name, role = 'user') => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: name });
    localStorage.setItem('neuralyn_role', role);
    return cred.user;
  };

  /* ── Login with email/password ── */
  const login = async (email, password) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return cred.user;
  };

  /* ── Google sign-in ── */
  const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    if (!localStorage.getItem('neuralyn_role')) {
      localStorage.setItem('neuralyn_role', 'user');
    }
    return result.user;
  };

  /* ── Logout ── */
  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  /* ── Complete onboarding ── */
  const completeOnboarding = (data = {}) => {
    if (user) {
      localStorage.setItem(`neuralyn_onboarded_${user.uid}`, 'true');
      if (data.role) localStorage.setItem('neuralyn_role', data.role);
      setUser(prev => ({ ...prev, ...data }));
      setNeedsOnboarding(false);
    }
  };

  /* ── Update user profile data ── */
  const updateUser = (data) => {
    setUser(prev => prev ? { ...prev, ...data } : prev);
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    needsOnboarding,
    register,
    login,
    loginWithGoogle,
    logout,
    completeOnboarding,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
