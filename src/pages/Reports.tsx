 import { usePOS } from '@/context/POSContext';
 import { Layout } from '@/components/Layout';
 import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
 import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
 import { BarChart3, DollarSign, ShoppingBag, TrendingUp } from 'lucide-react';
 
 const formatCurrency = (amount: number) => {
   return new Intl.NumberFormat('id-ID', {
     style: 'currency',
     currency: 'IDR',
     minimumFractionDigits: 0,
   }).format(amount);
 };
 
 const formatTime = (date: Date) => {
   return new Intl.DateTimeFormat('id-ID', {
     hour: '2-digit',
     minute: '2-digit',
   }).format(new Date(date));
 };
 
 export const Reports = () => {
   const { getTodayRevenue, getTodayTransactions, products } = usePOS();
 
   const todayRevenue = getTodayRevenue();
   const todayTransactions = getTodayTransactions();
   const totalItems = todayTransactions.reduce(
     (sum, t) => sum + t.items.reduce((itemSum, item) => itemSum + item.quantity, 0),
     0
   );
   const averageTransaction = todayTransactions.length > 0 
     ? todayRevenue / todayTransactions.length 
     : 0;
 
   return (
     <Layout>
       <div className="space-y-6">
         <div>
           <h1 className="text-2xl font-bold text-foreground">Laporan Hari Ini</h1>
           <p className="text-muted-foreground">
             {new Intl.DateTimeFormat('id-ID', { 
               weekday: 'long', 
               year: 'numeric', 
               month: 'long', 
               day: 'numeric' 
             }).format(new Date())}
           </p>
         </div>
 
         {/* Stats Cards */}
         <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
           <Card>
             <CardHeader className="flex flex-row items-center justify-between pb-2">
               <CardTitle className="text-sm font-medium text-muted-foreground">
                 Total Pendapatan
               </CardTitle>
               <DollarSign className="h-4 w-4 text-success" />
             </CardHeader>
             <CardContent>
               <p className="text-2xl font-bold text-foreground">{formatCurrency(todayRevenue)}</p>
             </CardContent>
           </Card>
 
           <Card>
             <CardHeader className="flex flex-row items-center justify-between pb-2">
               <CardTitle className="text-sm font-medium text-muted-foreground">
                 Jumlah Transaksi
               </CardTitle>
               <ShoppingBag className="h-4 w-4 text-primary" />
             </CardHeader>
             <CardContent>
               <p className="text-2xl font-bold text-foreground">{todayTransactions.length}</p>
             </CardContent>
           </Card>
 
           <Card>
             <CardHeader className="flex flex-row items-center justify-between pb-2">
               <CardTitle className="text-sm font-medium text-muted-foreground">
                 Item Terjual
               </CardTitle>
               <BarChart3 className="h-4 w-4 text-warning" />
             </CardHeader>
             <CardContent>
               <p className="text-2xl font-bold text-foreground">{totalItems}</p>
             </CardContent>
           </Card>
 
           <Card>
             <CardHeader className="flex flex-row items-center justify-between pb-2">
               <CardTitle className="text-sm font-medium text-muted-foreground">
                 Rata-rata Transaksi
               </CardTitle>
               <TrendingUp className="h-4 w-4 text-accent" />
             </CardHeader>
             <CardContent>
               <p className="text-2xl font-bold text-foreground">{formatCurrency(averageTransaction)}</p>
             </CardContent>
           </Card>
         </div>
 
         {/* Transaction History */}
         <Card>
           <CardHeader>
             <CardTitle className="flex items-center gap-2 text-lg">
               <ShoppingBag className="h-5 w-5" />
               Riwayat Transaksi Hari Ini
             </CardTitle>
           </CardHeader>
           <CardContent>
             {todayTransactions.length === 0 ? (
               <div className="flex flex-col items-center justify-center py-12 text-center">
                 <ShoppingBag className="mb-4 h-12 w-12 text-muted-foreground/50" />
                 <p className="text-muted-foreground">Belum ada transaksi hari ini</p>
                 <p className="text-sm text-muted-foreground">Transaksi akan muncul di sini</p>
               </div>
             ) : (
               <Table>
                 <TableHeader>
                   <TableRow>
                     <TableHead>Waktu</TableHead>
                     <TableHead>Item</TableHead>
                     <TableHead className="text-right">Total</TableHead>
                   </TableRow>
                 </TableHeader>
                 <TableBody>
                   {[...todayTransactions].reverse().map(transaction => (
                     <TableRow key={transaction.id}>
                       <TableCell className="font-medium">
                         {formatTime(transaction.createdAt)}
                       </TableCell>
                       <TableCell>
                         <div className="text-sm">
                           {transaction.items.map((item, i) => (
                             <span key={item.product.id}>
                               {item.product.name} ×{item.quantity}
                               {i < transaction.items.length - 1 && ', '}
                             </span>
                           ))}
                         </div>
                       </TableCell>
                       <TableCell className="text-right font-medium">
                         {formatCurrency(transaction.total)}
                       </TableCell>
                     </TableRow>
                   ))}
                 </TableBody>
               </Table>
             )}
           </CardContent>
         </Card>
       </div>
     </Layout>
   );
 };