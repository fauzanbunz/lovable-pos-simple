 import { usePOS } from '@/context/POSContext';
 import { Layout } from '@/components/Layout';
 import { Button } from '@/components/ui/button';
 import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
 import { Input } from '@/components/ui/input';
 import { ScrollArea } from '@/components/ui/scroll-area';
 import { Separator } from '@/components/ui/separator';
 import { Plus, Minus, Trash2, ShoppingCart, Package, CheckCircle } from 'lucide-react';
 import { toast } from 'sonner';
 
 const formatCurrency = (amount: number) => {
   return new Intl.NumberFormat('id-ID', {
     style: 'currency',
     currency: 'IDR',
     minimumFractionDigits: 0,
   }).format(amount);
 };
 
 export const Cashier = () => {
   const {
     products,
     cart,
     addToCart,
     removeFromCart,
     updateCartQuantity,
     clearCart,
     cartTotal,
     completeTransaction,
   } = usePOS();
 
   const handleComplete = () => {
     if (cart.length === 0) {
       toast.error('Keranjang kosong');
       return;
     }
     completeTransaction();
     toast.success('Transaksi berhasil!', {
       description: `Total: ${formatCurrency(cartTotal)}`,
     });
   };
 
   const availableProducts = products.filter(p => p.stock > 0);
 
   return (
     <Layout>
       <div className="grid gap-6 lg:grid-cols-3">
         {/* Product List */}
         <div className="lg:col-span-2">
           <Card>
             <CardHeader>
               <CardTitle className="flex items-center gap-2 text-lg">
                 <Package className="h-5 w-5" />
                 Pilih Produk
               </CardTitle>
             </CardHeader>
             <CardContent>
               {availableProducts.length === 0 ? (
                 <div className="flex flex-col items-center justify-center py-12 text-center">
                   <Package className="mb-4 h-12 w-12 text-muted-foreground/50" />
                   <p className="text-muted-foreground">Tidak ada produk tersedia</p>
                   <p className="text-sm text-muted-foreground">Tambahkan produk di halaman Produk</p>
                 </div>
               ) : (
                 <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                   {availableProducts.map(product => {
                     const inCart = cart.find(item => item.product.id === product.id);
                     const remainingStock = product.stock - (inCart?.quantity || 0);
 
                     return (
                       <button
                         key={product.id}
                         onClick={() => addToCart(product)}
                         disabled={remainingStock <= 0}
                         className="group relative flex flex-col items-start rounded-lg border border-border bg-card p-4 text-left transition-all hover:border-primary hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                       >
                         <span className="font-medium text-foreground">{product.name}</span>
                         <span className="text-lg font-semibold text-primary">
                           {formatCurrency(product.price)}
                         </span>
                         <span className="text-xs text-muted-foreground">
                           Stok: {remainingStock}
                         </span>
                         {inCart && (
                           <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                             {inCart.quantity}
                           </span>
                         )}
                       </button>
                     );
                   })}
                 </div>
               )}
             </CardContent>
           </Card>
         </div>
 
         {/* Cart */}
         <div className="lg:col-span-1">
           <Card className="sticky top-24">
             <CardHeader>
               <CardTitle className="flex items-center justify-between text-lg">
                 <span className="flex items-center gap-2">
                   <ShoppingCart className="h-5 w-5" />
                   Keranjang
                 </span>
                 {cart.length > 0 && (
                   <Button variant="ghost" size="sm" onClick={clearCart} className="text-destructive hover:text-destructive">
                     Kosongkan
                   </Button>
                 )}
               </CardTitle>
             </CardHeader>
             <CardContent className="p-0">
               {cart.length === 0 ? (
                 <div className="flex flex-col items-center justify-center py-12 text-center">
                   <ShoppingCart className="mb-4 h-12 w-12 text-muted-foreground/50" />
                   <p className="text-muted-foreground">Keranjang kosong</p>
                   <p className="text-sm text-muted-foreground">Pilih produk untuk ditambahkan</p>
                 </div>
               ) : (
                 <ScrollArea className="h-[300px] px-6">
                   <div className="space-y-4 py-2">
                     {cart.map(item => (
                       <div key={item.product.id} className="flex items-start justify-between gap-2">
                         <div className="flex-1">
                           <p className="font-medium text-foreground">{item.product.name}</p>
                           <p className="text-sm text-muted-foreground">
                             {formatCurrency(item.product.price)} × {item.quantity}
                           </p>
                         </div>
                         <div className="flex items-center gap-1">
                           <Button
                             variant="outline"
                             size="icon"
                             className="h-7 w-7"
                             onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                           >
                             <Minus className="h-3 w-3" />
                           </Button>
                           <Input
                             type="number"
                             value={item.quantity}
                             onChange={e => updateCartQuantity(item.product.id, parseInt(e.target.value) || 0)}
                             className="h-7 w-12 text-center"
                             min={1}
                             max={item.product.stock}
                           />
                           <Button
                             variant="outline"
                             size="icon"
                             className="h-7 w-7"
                             onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                             disabled={item.quantity >= item.product.stock}
                           >
                             <Plus className="h-3 w-3" />
                           </Button>
                           <Button
                             variant="ghost"
                             size="icon"
                             className="h-7 w-7 text-destructive hover:text-destructive"
                             onClick={() => removeFromCart(item.product.id)}
                           >
                             <Trash2 className="h-3 w-3" />
                           </Button>
                         </div>
                       </div>
                     ))}
                   </div>
                 </ScrollArea>
               )}
             </CardContent>
             {cart.length > 0 && (
               <CardFooter className="flex-col gap-4 border-t border-border pt-4">
                 <div className="flex w-full items-center justify-between">
                   <span className="text-muted-foreground">Total</span>
                   <span className="text-2xl font-bold text-foreground">{formatCurrency(cartTotal)}</span>
                 </div>
                 <Button onClick={handleComplete} className="w-full gap-2" size="lg">
                   <CheckCircle className="h-5 w-5" />
                   Selesaikan Transaksi
                 </Button>
               </CardFooter>
             )}
           </Card>
         </div>
       </div>
     </Layout>
   );
 };