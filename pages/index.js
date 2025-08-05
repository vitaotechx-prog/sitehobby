import React, { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import FilterTabs from "../components/FiltersTabs";
import CommunityLinks from "../components/CommunityLinks";
import { Search, Loader2, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from '@/lib/supabaseClient';
import Layout from '../Layout'; // Importe o Layout

// 1. BUSCA DE DADOS NO SERVIDOR (AGORA SEM CACHE)

export async function getStaticProps() {
  const { data: products, error } = await supabase
    .from('products')
    .select('*, categories(id, name)') 
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erro ao buscar produtos:', error);
    return { props: { initialProducts: [] } };
  }

  return {
    props: {
      initialProducts: products,
    },
    revalidate: 600,
  };
}

// 2. COMPONENTE DA PÁGINA
// Ele recebe 'initialProducts' como uma propriedade.
export default function Home({ initialProducts }) {
    // 1. O nome do estado agora reflete melhor seu propósito.
    const [products, setProducts] = useState(initialProducts);
    const [loading, setLoading] = useState(false); // Estado para feedback de carregamento

    const [activeFilter, setActiveFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    // 2. Este useEffect agora ORQUESTRA as chamadas à API.
    useEffect(() => {
        const fetchFilteredProducts = async () => {
            setLoading(true);

            // Construímos a URL da API com os parâmetros corretos.
            const params = new URLSearchParams();
            if (activeFilter !== 'all') {
                params.append('filter', activeFilter);
            }
            if (searchQuery.trim()) {
                params.append('q', searchQuery.trim());
            }

            try {
                const response = await fetch(`/api/products?${params.toString()}`);
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error("Erro ao buscar produtos filtrados:", error);
                setProducts([]); // Limpa os produtos em caso de erro
            } finally {
                setLoading(false);
            }
        };

        // Não buscamos os dados iniciais de novo, apenas quando um filtro muda.
        if (activeFilter !== 'all' || searchQuery.trim()) {
            fetchFilteredProducts();
        } else {
            // Se nenhum filtro está ativo, voltamos aos produtos iniciais.
            setProducts(initialProducts);
        }
    }, [initialProducts, activeFilter, searchQuery]);

    // O return (JSX) continua o mesmo, mas agora é mais rápido
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-12">
            </div>

            <CommunityLinks />

            {/* Filtros */}
            <div className="space-y-6 mb-8">
                <FilterTabs activeFilter={activeFilter} onFilterChange={setActiveFilter} />
            </div>

            {/* Grid de Produtos */}
            <AnimatePresence>
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
                    </div>
                ) : products.length > 0 ? (
                    <motion.div
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                        {products.map((product) => (
                            <motion.div
                                key={product.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.2 }}
                            >
                                <ProductCard product={product} />
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <div className="text-center py-16">
                         <Zap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            Nenhum produto encontrado
                        </h3>
                        <p className="text-gray-600">
                            Tente ajustar seus filtros ou fazer uma nova busca.
                        </p>
                    </div>
                )}
            </AnimatePresence>
            
            {/* O botão "Carregar Mais" foi removido pois agora carregamos tudo de uma vez no servidor */}
        </div>
    );
}

Home.getLayout = function getLayout(page) {
  return (
    <Layout>{page}</Layout>
  )
}