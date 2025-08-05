// -website_pass_time/pages/api/products/create.js
import { createClient } from '@supabase/supabase-js';

// A service key é necessária para ignorar RLS na tabela 'products' se houver
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  // O productData agora inclui o 'category_id'
  const productData = req.body;

  console.log("Payload recebido pela API:", productData);

  try {
    // A inserção agora é uma única operação
    const { data: newProductData, error: insertError } = await supabaseAdmin
      .from('products')
      .insert([productData]) // O category_id será inserido junto
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }
   
    return res.status(201).json({ message: 'Produto criado com sucesso!', product: newProductData });

  } catch (error) {
    console.error('Erro na API create.js:', error);
    return res.status(500).json({ 
        error: 'Erro interno do servidor ao criar produto.',
        supabase_error: error.message 
    });
  }
}