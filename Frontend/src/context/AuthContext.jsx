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
      // Check for mock user first
      if (localStorage.getItem('neuralyn_mock_user') === 'true') {
        setUser({
          uid: localStorage.getItem('mock_uid') || 'mock-123',
          name: localStorage.getItem('mock_name') || 'Mock User',
          email: localStorage.getItem('mock_email') || 'test@example.com',
          role: localStorage.getItem('neuralyn_role') || 'user',
        });
        setLoading(false);
        return;
      }

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
    // MOCK CREDENTIALS INTERCEPT
    if (email === 'peer@nuralyn.com' && password === 'password123') {
      localStorage.setItem('neuralyn_mock_user', 'true');
      localStorage.setItem('mock_uid', 'peer-123');
      localStorage.setItem('mock_name', 'Alex (Peer Mentor)');
      localStorage.setItem('mock_email', email);
      localStorage.setItem('neuralyn_role', 'peer_mentor');
      const mockUser = { uid: 'peer-123', name: 'Alex (Peer Mentor)', email, role: 'peer_mentor' };
      setUser(mockUser);
      return mockUser;
    }
    if (email === 'pro@nuralyn.com' && password === 'password123') {
      localStorage.setItem('neuralyn_mock_user', 'true');
      localStorage.setItem('mock_uid', 'pro-123');
      localStorage.setItem('mock_name', 'Dr. Sarah (Professional)');
      localStorage.setItem('mock_email', email);
      localStorage.setItem('neuralyn_role', 'professional');
      const mockUser = { uid: 'pro-123', name: 'Dr. Sarah (Professional)', email, role: 'professional' };
      setUser(mockUser);
      return mockUser;
    }
    if (email === 'ngo@nuralyn.com' && password === 'password123') {
      localStorage.setItem('neuralyn_mock_user', 'true');
      localStorage.setItem('mock_uid', 'ngo-123');
      localStorage.setItem('mock_name', 'Hope Foundation (NGO)');
      localStorage.setItem('mock_email', email);
      localStorage.setItem('neuralyn_role', 'ngo');
      const mockUser = { uid: 'ngo-123', name: 'Hope Foundation (NGO)', email, role: 'ngo' };
      setUser(mockUser);
      return mockUser;
    }

    localStorage.removeItem('neuralyn_mock_user');
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
    if (localStorage.getItem('neuralyn_mock_user') === 'true') {
      localStorage.removeItem('neuralyn_mock_user');
      setUser(null);
    } else {
      await signOut(auth);
      setUser(null);
    }
    // Clear session mood flag so user is asked again on next login
    sessionStorage.removeItem('neuralyn_mood_given');
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
