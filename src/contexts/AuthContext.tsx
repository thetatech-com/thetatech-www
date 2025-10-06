import { createContext } from 'react';
import { Session, User } from '@supabase/supabase-js';

interface Profile {
  username: string;
  avatar_url: string;
  // Add other profile properties as needed
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  logout: () => Promise<void>;
  signInWithPassword: (email, password) => Promise<any>;
  signUpWithEmail: (email, password, isSeller) => Promise<any>;
  signUpWithPhone: (phone: string) => Promise<any>;
  verifyPhoneSignUpOtp: (phone: string, token: string) => Promise<any>;
  login: (email: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setProfile: (profile: Profile | null) => void;
  setLoading: (loading: boolean) => void;
}


export const AuthContext = createContext<AuthContextType | undefined>(undefined);
