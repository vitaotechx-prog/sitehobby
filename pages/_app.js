import Layout from '../Layout';
import '@/styles/globals.css';
import { AuthProvider } from '../contexts/AuthContext';
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from '@vercel/analytics/react';

function MyApp({ Component, pageProps }) {
  return (
  <AuthProvider>
     <Layout>
        <Component {...pageProps} />
     </Layout>

     {/* O Toaster fica aqui para exibir as notificações */}
     <Toaster />
     <Analytics />
    </AuthProvider>
  );
}

export default MyApp;