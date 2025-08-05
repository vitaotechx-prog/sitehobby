import { supabase } from '@/lib/supabaseClient';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  // 1. Pegamos os parâmetros 'filter' e 'q' (de "query") da URL.
  const { filter, q } = req.query;

  // 2. Iniciamos a consulta ao Supabase, como antes.
  let query = supabase
    .from('products')
    .select('*, categories(id, name)') // Mantemos o join com categorias
    .order('created_at', { ascending: false });

  // 3. Aplicamos os filtros com base nos parâmetros recebidos.
  if (filter) {
    switch (filter) {
      case 'featured':
        query = query.eq('is_featured', true);
        break;
      case 'coupons':
        query = query.eq('has_coupon', true);
        break;
      case 'alerts':
        query = query.eq('is_alert', true);
        break;
      // O filtro "recent" ou "all" não precisa de modificação,
      // pois a ordenação por 'created_at' já faz isso.
    }
  }

  // 4. Adicionamos a lógica de busca por texto.
  //    'ilike' faz uma busca case-insensitive (não diferencia maiúsculas/minúsculas).
  //    `%${q}%` procura pelo termo em qualquer parte do nome do produto.
  if (q) {
    query = query.ilike('name', `%${q}%`);
  }

  // 5. Executamos a consulta já filtrada.
  const { data, error } = await query;

  if (error) {
    console.error('Erro na API de produtos:', error);
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json(data);
}