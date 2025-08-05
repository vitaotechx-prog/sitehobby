import { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from "@/hooks/use-toast";


const AuthContext = createContext(null); // Inicializa com null

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProfile = async (currentUser) => {
      if (currentUser) {
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('full_name, avatar_url')
          .eq('id', currentUser.id)
          .single();
        
        if (error) {
            console.error("Erro ao buscar perfil no context:", error);
            setProfile(null); // Limpa o perfil em caso de erro
            return null;
        }

        setProfile(profileData); // Atualiza o estado global
        return profileData;      // Retorna os dados para quem chamou
      }
      return null;
    };

  useEffect(() => {
    const fetchSessionAndProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const currentUser = session?.user;
      setUser(currentUser ?? null);

      if (currentUser) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('full_name, avatar_url')
          .eq('id', currentUser.id)
          .single();
        setProfile(profileData);
      }
      setLoading(false);
    };
    
    fetchSessionAndProfile();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session?.user;
        setUser(currentUser ?? null);
        if (event === 'SIGNED_IN') {
          toast({
            title: "Login realizado com sucesso!",
            description: `Bem-vindo(a) de volta, ${currentUser.email}`,
          });
          await fetchProfile(currentUser); // Usa a nova função
        } else if (event === 'SIGNED_OUT') {
          setProfile(null);
        }
      }
    );
    return () => { authListener.subscription.unsubscribe(); };
  }, [toast]);

  const value = {
    signUp: (data) => supabase.auth.signUp(data),
    signIn: (data) => supabase.auth.signInWithPassword(data),
    signInWithGoogle: () => supabase.auth.signInWithOAuth({ provider: 'google' }), // <-- ADICIONE ESTA LINHA
    signOut: () => supabase.auth.signOut(),
    user,
    profile,
    fetchProfile,
  };

  // Renderiza os filhos apenas quando o carregamento inicial terminar
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}