import Layout from '../Layout';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabaseClient'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils'; // Importe o utilitário cn

// Lista de avatares que você colocou na pasta public/avatars
const availableAvatars = [
    '/avatars/avatar1.png',
    '/avatars/avatar2.png',
    '/avatars/avatar3.png',
    '/avatars/avatar4.png',
    '/avatars/avatar5.png',
    '/avatars/avatar6.png',
    '/avatars/avatar7.png',
    '/avatars/avatar8.png',
    '/avatars/avatar9.png',
    '/avatars/avatar10.png',
    '/avatars/avatar11.png',
    '/avatars/avatar12.png',
    '/avatars/avatar13.png',
    '/avatars/avatar14.png',
    '/avatars/avatar15.png',
    '/avatars/avatar16.png',
    '/avatars/avatar17.png',
];


export default function ProfilePage() {
    // 2. Extraia a função `fetchProfile` do contexto.
    const { user, profile, fetchProfile } = useAuth();
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [fullName, setFullName] = useState('');
    const [avatarUrl, setAvatarUrl] = useState(''); // NOVO: Estado para o avatar
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!user) {
            router.push('/Login');
            return;
        }

        // Usamos os dados do 'profile' do contexto para carregar o estado inicial
        // Isto evita uma chamada extra à base de dados no carregamento da página
        if (profile) {
            setFullName(profile.full_name || '');
            setAvatarUrl(profile.avatar_url || '');
        }
        setLoading(false);

    }, [user, profile, router]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setMessage('');

        // Prepara os dados para atualização
        const updates = {
            full_name: fullName,
            avatar_url: avatarUrl, // Adiciona o avatar_url
            updated_at: new Date(),
        };

        const { error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', user.id);

        if (error) {
            setMessage(`Erro ao atualizar: ${error.message}`);
        } else {
            setMessage('Perfil atualizado com sucesso!');
            // AQUI ESTÁ A MUDANÇA
            // Forçamos a busca e esperamos o retorno dos novos dados.
            const updatedProfile = await fetchProfile(user);
            if (updatedProfile) {
                // Sincronizamos o estado local com os novos dados do contexto
                setFullName(updatedProfile.full_name || '');
                setAvatarUrl(updatedProfile.avatar_url || '');
            }
        }
        setLoading(false); // Remove o loading do botão
    }
    
    // O resto da lógica de loading e o return continuam...
    if (loading) {
      return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-2xl py-12">
            <h1 className="text-3xl font-bold mb-6">Meu Perfil</h1>
            {message && <Alert className="mb-4"><AlertDescription>{message}</AlertDescription></Alert>}

            <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={user.email} disabled className="bg-gray-100" />
                </div>
                <div>
                    <Label htmlFor="fullName">Nome Social</Label>
                    <Input id="fullName" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                </div>
                <div>
                    <Label>Avatar</Label>
                    <div className="mt-2 flex flex-wrap items-center gap-4">
                        {availableAvatars.map((url) => (
                            <button
                                type="button"
                                key={url}
                                onClick={() => setAvatarUrl(url)}
                                // O botão agora é um círculo um pouco maior que a imagem para dar espaço ao "ring"
                                className={cn(
                                    'rounded-full p-1 transition-all duration-200',
                                    avatarUrl === url
                                        ? 'ring-2 ring-offset-2 ring-blue-500' // O anel de seleção
                                        : ''
                                )}
                            >
                                {/* AQUI ESTÁ A MUDANÇA PRINCIPAL: Tamanho explícito na imagem */}
                                <img
                                    src={url}
                                    alt={`Avatar ${url}`}
                                    className="h-20 w-20 rounded-full object-cover transition-transform duration-200 hover:scale-110"
                                />
                            </button>
                        ))}
                    </div>
                </div>
                <Button type="submit">Salvar Alterações</Button>
            </form>
        </div>
    );
}
ProfilePage.getLayout = function getLayout(page) {
  return (
    <Layout>{page}</Layout>
  )
}