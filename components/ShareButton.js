"use client"; // Diretiva para indicar que este é um componente de cliente

import { useState, useEffect } from 'react';
import { Share2, Link as LinkIcon, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

// O componente agora aceita 'productName' e 'productUrl' como propriedades
export default function ShareButton({ productName, productUrl }) {
  const [copied, setCopied] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Garante que o código que usa 'window' só rode no navegador
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleShare = async (e) => {
    e.stopPropagation(); // Impede que o clique no botão acione o clique no card

    const fullUrl = `${window.location.origin}${productUrl}`;

    const shareData = {
      title: `Confira esta oferta: ${productName}`,
      text: `Encontrei "${productName}" com um ótimo preço no VitaoTech!`,
      url: fullUrl
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Erro ao compartilhar:", err);
      }
    } else {
      navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isClient) {
    return null; // Não renderiza o botão no servidor para evitar erros
  }

  return (
    <Button
      onClick={handleShare}
      variant="ghost" // 'ghost' para um visual mais sutil
      size="icon"     // 'icon' para um botão pequeno e quadrado
      className="rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-7 text-white rounded-x1 shadow-lg transition-transform hover:scale-105  ease-in-out" 
      title="Compartilhar oferta" // Dica de ferramenta
    >
    
      {copied ? (
        <Check className="w-4 h-4 text-green-500" />
      ) : (
        // Usamos LinkIcon para o fallback de copiar link
        navigator.share ? <Share2 className="w-4 h-4" /> : <LinkIcon className="w-4 h-4" />
      )}
    </Button>
  );
}