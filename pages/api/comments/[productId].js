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
        return res.status(401).json({ error: 'Token de autenticação não fornecido.' });
    }

    // 2. Usa o token para obter os dados do utilizador
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return res.status(401).json({ error: 'Acesso não autorizado ou token inválido.' });
    }

  // 2. Usar o ID do usuário para criar o comentário
  const { content } = req.body; // Apenas o conteúdo é necessário do corpo da requisição
  const { data, error } = await supabase
    .from('comments')
    .insert([{
        product_id: productId,
        content,
        user_id: user.id // <<-- Usar o ID do usuário da sessão
        // O user_name será associado via JOIN com a tabela profiles na hora de buscar os comentários
    }]);

  if (error) return res.status(500).json({ error: error.message });
  return res.status(201).json(data);
  }
}