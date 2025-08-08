import React from "react";
import Link from 'next/link';
import { createPageUrl } from "@/utils";
import { useRouter } from 'next/router';
import { useAuth } from "@/contexts/AuthContext";
import SearchBar from "@/components/SearchBar";
import { 
    Home, 
    Grid3X3, 
    Clock, 
    Star, 
    Tag, 
    Bell,
    Menu,
    LogIn,
    Edit,
    LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetClose
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

const navigationItems = [
    { title: "Início", url: "/", icon: Home },
    { title: "Categorias", url: "/Categories", icon: Grid3X3 },
    { title: "Recentes", url: "/Recent", icon: Clock },
    { title: "Destaques", url: "/Featured", icon: Star },
    { title: "Cupons", url: "/Coupons", icon: Tag },
    { title: "Alertas", url: "/Alerts", icon: Bell },
];

const SocialIcon = ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
        {children}
    </a>
);

export default function Layout({ children }) {
    const router = useRouter();
    const { user, profile, signOut } = useAuth();

    // Determina a inicial do avatar
    const userInitial = profile?.full_name?.charAt(0) || user?.email?.charAt(0) || '?';


    // Lógica para a busca (exemplo)
    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            // Redireciona para a página inicial com o parâmetro de busca
            router.push(`/?search=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                                <span className="text-white font-bold text-lg">V</span>
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                VitaoTech
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center space-x-1">
                            {navigationItems.map((item) => (
                                <Link
                                    key={item.title}
                                    href={item.url}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                                        router.pathname === item.url
                                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                    }`}
                                >
                                    <item.icon className="w-4 h-4" />
                                    {item.title}
                                </Link>
                            ))}
                        </nav>

                        {/* Ações do Header (Login/Logout e Menu Mobile) */}
                        <div className="flex items-center gap-4">
                            <div className="hidden md:flex items-center gap-3">
                                {user ? (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                                                <Avatar>
                                                    <AvatarImage src={profile?.avatar_url} alt={profile?.full_name || user.email} />
                                                    <AvatarFallback>{userInitial.toUpperCase()}</AvatarFallback>
                                                </Avatar>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="w-56" align="end" forceMount>
                                            <DropdownMenuLabel className="font-normal">
                                                <div className="flex flex-col space-y-1">
                                                    <p className="text-sm font-medium leading-none">{profile?.full_name || 'Usuário'}</p>
                                                    <p className="text-xs leading-none text-muted-foreground truncate">{user.email}</p>
                                                </div>
                                            </DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <Link href="/profile">
                                                <DropdownMenuItem className="cursor-pointer">
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    <span>Editar Perfil</span>
                                                </DropdownMenuItem>
                                            </Link>
                                            <DropdownMenuItem onClick={signOut} className="cursor-pointer">
                                                <LogOut className="mr-2 h-4 w-4" />
                                                <span>Sair</span>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                ) : (
                                    <Link href="/Login">
                                        <Button>
                                            <LogIn className="mr-2 h-4 w-4" /> Entrar
                                        </Button>
                                    </Link>
                                )}
                            </div>
                            
                                {/* Mobile Menu Trigger */}
                                <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon" className="md:hidden">
                                        <Menu className="w-5 h-5" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="right" className="w-full max-w-xs p-6 flex flex-col">
                                    <nav className="flex flex-col space-y-2">
                                        {navigationItems.map((item) => (
                                            <SheetClose asChild key={item.title}>
                                                <Link
                                                    href={item.url}
                                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium ${
                                                        router.pathname === item.url ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                                                    }`}
                                                >
                                                    <item.icon className="w-5 h-5" />
                                                    {item.title}
                                                </Link>
                                            </SheetClose>
                                        ))}
                                    </nav>
                                    <div className="mt-auto border-t pt-4">
                                            {user ? (
                                                <div className="space-y-2 text-center">
                                                    <Link href="/profile" className="text-sm font-medium text-gray-700 hover:underline">
                                                        {user.email}
                                                    </Link>
                                                    <Button variant="outline" className="w-full" onClick={signOut}>
                                                        Sair
                                                    </Button>
                                                </div>
                                            ) : (
                                                <SheetClose asChild>
                                                    <Link href="/Login" className="w-full">
                                                        <Button className="w-full">
                                                            <LogIn className="mr-2 h-4 w-4" /> Entrar
                                                        </Button>
                                                    </Link>
                                                </SheetClose>
                                            )}
                                        </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>
                </div>
                <div className="hidden md:flex flex-1 justify-center px-8">
                    <SearchBar />
                </div>
            </header>
                                        

            {/* Main Content */}
            <main className="flex-grow container mx-auto px-4">
            
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 text-white mt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="col-span-1 md:col-span-1">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                                    <span className="text-white font-bold text-lg">V</span>
                                </div>
                                <span className="text-2xl font-bold">VitaoTech</span>
                            </div>

                            <div className="flex space-x-6 mt-6">
                                <SocialIcon href="https://x.com/VitaoTechX">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22.46,6C21.69,6.35 20.86,6.58 20,6.69C20.88,6.16 21.56,5.32 21.88,4.31C21.05,4.81 20.13,5.16 19.16,5.36C18.37,4.5 17.26,4 16,4C13.65,4 11.73,5.92 11.73,8.29C11.73,8.63 11.77,8.96 11.84,9.28C8.28,9.09 5.11,7.38 2.9,4.79C2.53,5.42 2.33,6.15 2.33,6.94C2.33,8.43 3.11,9.75 4.26,10.54C3.55,10.51 2.88,10.31 2.3,10.03C2.3,10.05 2.3,10.06 2.3,10.08C2.3,12.25 3.84,14.08 5.91,14.49C5.58,14.58 5.22,14.62 4.85,14.62C4.59,14.62 4.34,14.6 4.1,14.56C4.66,16.34 6.25,17.62 8.12,17.65C6.59,18.84 4.7,19.52 2.67,19.52C2.34,19.52 2,19.5 1.67,19.45C3.55,20.69 5.75,21.4 8.12,21.4C16,21.4 20.33,14.96 20.33,9.23C20.33,9.03 20.33,8.82 20.32,8.62C21.16,8.03 21.88,7.28 22.46,6Z"></path></svg>
                                </SocialIcon>
                                <SocialIcon href="https://www.tiktok.com/@vitaotech?lang=pt-BR">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 512 512"><path d="M412.19,118.66a109.27,109.27,0,0,1-9.45-5.5,132.87,132.87,0,0,1-24.27-20.62c-18.1-20.71-24.86-41.72-27.35-56.43h.1C349.14,23.9,350,16,350.13,16H267.69V334.78c0,4.28,0,8.51-.18,12.69,0,.52-.05,1-.08,1.56,0,.23,0,.47-.05.71,0,.06,0,.12,0,.18a70,70,0,0,1-35.22,55.56,68.8,68.8,0,0,1-34.11,9c-38.41,0-69.54-31.32-69.54-70s31.13-70,69.54-70a68.9,68.9,0,0,1,21.41,3.39l.1-83.94a153.14,153.14,0,0,0-118,34.52,161.79,161.79,0,0,0-35.3,43.53c-3.48,6-16.61,30.11-18.2,69.24-1,22.21,5.67,45.22,8.85,54.73v.2c2,5.6,9.75,24.71,22.38,40.82A167.53,167.53,0,0,0,115,470.66v-.2l.2.2C155.11,497.78,199.36,496,199.36,496c7.66-.31,33.32,0,62.46-13.81,32.32-15.31,50.72-38.12,50.72-38.12a158.46,158.46,0,0,0,27.64-45.93c7.46-19.61,9.95-43.13,9.95-52.53V176.49c1,.6,14.32,9.41,14.32,9.41s19.19,12.3,49.13,20.31c21.48,5.7,50.42,6.9,50.42,6.9V131.27C453.86,132.37,433.27,129.17,412.19,118.66Z"/></svg>
                                </SocialIcon>
                                <SocialIcon href="https://www.instagram.com/vitaotechx/">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M7.8,2H16.2C19.4,2 22,4.6 22,7.8V16.2A5.8,5.8 0 0,1 16.2,22H7.8C4.6,22 2,19.4 2,16.2V7.8A5.8,5.8 0 0,1 7.8,2M7.6,4A3.6,3.6 0 0,0 4,7.6V16.4C4,18.39 5.61,20 7.6,20H16.4A3.6,3.6 0 0,0 20,16.4V7.6C20,5.61 18.39,4 16.4,4H7.6M17.25,5.5A1.25,1.25 0 0,1 18.5,6.75A1.25,1.25 0 0,1 17.25,8A1.25,1.25 0 0,1 16,6.75A1.25,1.25 0 0,1 17.25,5.5M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9Z"></path></svg>
                                </SocialIcon>
                                <SocialIcon href="https://www.facebook.com/profile.php?id=61578812965379">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17,2H7A5,5 0 0,0 2,7V17A5,5 0 0,0 7,22H17A5,5 0 0,0 22,17V7A5,5 0 0,0 17,2M17,14H14.5V20H11.5V14H9V11H11.5V9C11.5,6.5 13,5 15.5,5H18V8H16C15.2,8 14.5,8.2 14.5,9.2V11H18L17,14Z"></path></svg>
                                </SocialIcon>
                            </div>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-4">Navegação</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li><Link href={createPageUrl("Categories")} className="hover:text-white transition-colors">Categorias</Link></li>
                                <li><Link href={createPageUrl("Featured")} className="hover:text-white transition-colors">Destaques</Link></li>
                                <li><Link href={createPageUrl("Coupons")} className="hover:text-white transition-colors">Cupons</Link></li>
                            </ul>
                        </div>                        
                        <div>
                            <h3 className="font-semibold mb-4">Lojas Parceiras</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li>Amazon</li>
                                <li>Mercado Livre</li>
                                <li>Shopee</li>
                                <li>AliExpress</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-4">Ajuda</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li><Link href="#" className="hover:text-white transition-colors">Perguntas Frequentes</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">Contate-nos</Link></li>
                            </ul>
                        </div>
                    </div>
                    
                    <div className="border-t border-gray-800 mt-5 pt-6 text-center text-gray-400">
                        <p>&copy; 2024 VitaoTech. Todos os direitos reservados.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
