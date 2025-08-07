import { createClient } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';

export default async function handler(req, res) {
  const { productId } = req.query;

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('product_id', productId) // Filtra comentários pelo ID do produto
      .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === 'POST') {
  // 1. Obter o usuário autenticado
  const token = req.headers.authorization?.split('Bearer ')[1];

  if (!token) {
        return res.status(401).json({ error: 'Token não fornecido.' });
    }

    // Criamos um cliente Supabase autenticado com o token do utilizador
    const supabaseAuthed = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        { global: { headers: { Authorization: `Bearer ${token}` } } }
    );
    
    const { content } = req.body;

    //Chamamos a nossa função 'create_new_comment' via RPC
    const { error } = await supabaseAuthed.rpc('create_new_comment', {
      product_id_in: productId,
      content_in: content
    });

    if (error) {
        console.error('Erro ao chamar RPC create_new_comment:', error);
        return res.status(500).json({ error: 'Erro ao guardar o comentário.', details: error.message });
    }

    return res.status(201).json({ message: 'Comentário criado com sucesso!' });
  }
  // Adicionei esta linha para responder a outros métodos que não sejam GET ou POST
  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}