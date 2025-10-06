import {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from 'react'
import {
  User,
  Session,
} from '@supabase/supabase-js'
import { supabase } from '@/integrations/supabase/client' 
import { useToast } from '@/hooks/use-toast';


export interface Profile {
  username: string
  avatar_url: string
  is_seller: boolean
  role: string
}

interface AuthContextType {
  user: (User & { role?: string }) | null
  session: Session | null
  profile: Profile | null
  loading: boolean
  signInWithPassword: (email: string, pass: string) => Promise<any>
  signUpWithEmail: (email: string, pass: string, isSeller: boolean) => Promise<any>;
  signOut: () => Promise<void>;
  signInWithOtp: (email: string) => Promise<void>;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthContextType['user']>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      setLoading(true);
      const currentUser = session?.user ?? null;
      if (currentUser) {
        const { data, error } = await supabase
          .from('profiles')
          .select(`username, avatar_url, is_seller, role`)
          .eq('id', currentUser.id)
          .single();
        
        if (error) {
          console.error('Error fetching profile:', error);
          setUser(currentUser);
        } else {
          setUser({ ...currentUser, role: data.role });
          setProfile(data as Profile);
        }
      } else {
        setUser(null);
        setProfile(null);
      }
      setSession(session);
      setLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signInWithPassword = async (email: string, pass: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
      if (error) throw error;
    } catch (error: any) {
      toast({ title: 'Error signing in', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const signUpWithEmail = async (email: string, pass: string, isSeller: boolean) => {
    setLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password: pass,
      });

      if (authError) throw authError;

      if (authData.user) {
        const { error: profileError } = await supabase.from('profiles').insert([
          {
            id: authData.user.id,
            email: email,
            is_seller: isSeller,
            seller_request_status: isSeller ? 'pending' : null,
            username: email.split('@')[0],
            role: 'user', 
          },
        ]);
        if (profileError) throw profileError;
      }
      
      toast({ title: 'Check your email', description: "We've sent you a confirmation link to complete your registration." });

    } catch (error: any) {
      toast({ title: 'Error signing up', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };
  
  const signInWithOtp = async (email: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) throw error;
      toast({ title: 'Check your email', description: 'We sent you a login link!' });
    } catch (error: any) {
      toast({ title: 'Error sending magic link', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    session,
    profile,
    loading,
    signInWithPassword,
    signUpWithEmail,
    signOut,
    signInWithOtp
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}


export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
