// pages/Login.js
import Layout from '../Layout'; // Importe o Layout no topo
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Label } from "@/components/ui/label";
import { LogIn } from 'lucide-react';

export default function LoginPage() {
  // NOVO: Estado para controlar a visualização (login ou cadastro)
  const [isLoginView, setIsLoginView] = useState(true);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // NOVO: Campo de confirmação
  
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    if (isLoginView) {
      // --- Lógica de Login ---
      const { error } = await signIn({ email, password });
      if (error) setError(error.message);
      else router.push('/');
    } else {
      // --- Lógica de Cadastro ---
      if (password !== confirmPassword) {
        setError('As senhas não correspondem.');
        setLoading(false);
        return;
      }
      const { error } = await signUp({ email, password });
      if (error) {
        setError(error.message);
      } else {
        // CORREÇÃO: Define a mensagem de sucesso, não de erro
        setMessage('Cadastro realizado! Verifique seu e-mail para confirmação.');
        setIsLoginView(true); // Volta para a tela de login após o sucesso
      }
    }
    setLoading(false);
  };
  
  const handleGoogleLogin = async () => {
    setError('');
    const { error } = await signInWithGoogle();
    if (error) setError(error.message);
  };

  return (
    <div className="container mx-auto flex items-center justify-center py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          {/* Título dinâmico */}
          <h1 className="text-3xl font-bold">{isLoginView ? 'Acesse sua Conta' : 'Crie sua Conta'}</h1>
          <p className="text-gray-500">
            {isLoginView ? 'Entre para comentar e criar alertas.' : 'Preencha os campos para se cadastrar.'}
          </p>
        </div>
        
        {/* Exibição de Erros e Mensagens de Sucesso */}
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Ocorreu um erro</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {message && (
          <Alert variant="default" className="border-green-500 text-green-700">
            <AlertTitle>Sucesso!</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="password">Senha</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          {/* Campo de confirmação de senha (só aparece na tela de cadastro) */}
          {!isLoginView && (
            <div>
              <Label htmlFor="confirmPassword">Confirme a Senha</Label>
              <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            </div>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            <LogIn className="mr-2 h-4 w-4"/> {loading ? 'Aguarde...' : (isLoginView ? 'Entrar' : 'Cadastrar')}
          </Button>
        </form>
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Ou</span>
          </div>
        </div>

        <Button onClick={handleGoogleLogin} variant="outline" className="w-full">
          <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z">
            </path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z">
            </path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z">
            </path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
          </svg>
          Entrar com Google
        </Button>
        
        {/* Link para alternar entre as telas */}
        <p className="text-center text-sm text-gray-500">
          {isLoginView ? 'Não tem uma conta?' : 'Já tem uma conta?'}
          <Button variant="link" onClick={() => { setIsLoginView(!isLoginView); setError(''); setMessage(''); }}>
            {isLoginView ? 'Cadastre-se' : 'Faça Login'}
          </Button>
        </p>
      </div>
    </div>
  );
}
LogIn.getLayout = function getLayout(page) {
  return (
    <Layout>{page}</Layout>
  )
}