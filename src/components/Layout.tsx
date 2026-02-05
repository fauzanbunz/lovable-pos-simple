 import { ReactNode } from 'react';
 import { Link, useLocation } from 'react-router-dom';
 import { Package, ShoppingCart, BarChart3 } from 'lucide-react';
 import { cn } from '@/lib/utils';
 
 interface LayoutProps {
   children: ReactNode;
 }
 
 const navItems = [
   { path: '/products', label: 'Produk', icon: Package },
   { path: '/cashier', label: 'Kasir', icon: ShoppingCart },
   { path: '/reports', label: 'Laporan', icon: BarChart3 },
 ];
 
 export const Layout = ({ children }: LayoutProps) => {
   const location = useLocation();
 
   return (
     <div className="min-h-screen bg-background">
       {/* Header */}
       <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-sm">
         <div className="container mx-auto flex h-16 items-center justify-between px-4">
           <Link to="/" className="flex items-center gap-2">
             <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
               <ShoppingCart className="h-5 w-5 text-primary-foreground" />
             </div>
             <span className="text-xl font-semibold text-foreground">SimplePOS</span>
           </Link>
 
           <nav className="flex items-center gap-1">
             {navItems.map(({ path, label, icon: Icon }) => (
               <Link
                 key={path}
                 to={path}
                 className={cn(
                   'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                   location.pathname === path
                     ? 'bg-primary text-primary-foreground'
                     : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                 )}
               >
                 <Icon className="h-4 w-4" />
                 <span className="hidden sm:inline">{label}</span>
               </Link>
             ))}
           </nav>
         </div>
       </header>
 
       {/* Main Content */}
       <main className="container mx-auto px-4 py-6">
         {children}
       </main>
     </div>
   );
 };