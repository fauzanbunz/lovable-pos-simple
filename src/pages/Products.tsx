 import { useState } from 'react';
 import { usePOS } from '@/context/POSContext';
 import { Layout } from '@/components/Layout';
 import { Button } from '@/components/ui/button';
 import { Input } from '@/components/ui/input';
 import { Label } from '@/components/ui/label';
 import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
 import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
 } from '@/components/ui/dialog';
 import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
 } from '@/components/ui/table';
 import { Plus, Pencil, Trash2, Package } from 'lucide-react';
 import { Product } from '@/types/pos';
 
 const formatCurrency = (amount: number) => {
   return new Intl.NumberFormat('id-ID', {
     style: 'currency',
     currency: 'IDR',
     minimumFractionDigits: 0,
   }).format(amount);
 };
 
 export const Products = () => {
   const { products, addProduct, updateProduct, deleteProduct } = usePOS();
   const [isOpen, setIsOpen] = useState(false);
   const [editingProduct, setEditingProduct] = useState<Product | null>(null);
   const [formData, setFormData] = useState({ name: '', price: '', stock: '' });
 
   const resetForm = () => {
     setFormData({ name: '', price: '', stock: '' });
     setEditingProduct(null);
   };
 
   const handleOpenChange = (open: boolean) => {
     setIsOpen(open);
     if (!open) resetForm();
   };
 
   const handleEdit = (product: Product) => {
     setEditingProduct(product);
     setFormData({
       name: product.name,
       price: product.price.toString(),
       stock: product.stock.toString(),
     });
     setIsOpen(true);
   };
 
   const handleSubmit = (e: React.FormEvent) => {
     e.preventDefault();
     const data = {
       name: formData.name,
       price: parseFloat(formData.price),
       stock: parseInt(formData.stock),
     };
 
     if (editingProduct) {
       updateProduct(editingProduct.id, data);
     } else {
       addProduct(data);
     }
 
     handleOpenChange(false);
   };
 
   return (
     <Layout>
       <div className="space-y-6">
         <div className="flex items-center justify-between">
           <div>
             <h1 className="text-2xl font-bold text-foreground">Manajemen Produk</h1>
             <p className="text-muted-foreground">Kelola daftar produk toko Anda</p>
           </div>
 
           <Dialog open={isOpen} onOpenChange={handleOpenChange}>
             <DialogTrigger asChild>
               <Button className="gap-2">
                 <Plus className="h-4 w-4" />
                 Tambah Produk
               </Button>
             </DialogTrigger>
             <DialogContent>
               <DialogHeader>
                 <DialogTitle>
                   {editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}
                 </DialogTitle>
               </DialogHeader>
               <form onSubmit={handleSubmit} className="space-y-4">
                 <div className="space-y-2">
                   <Label htmlFor="name">Nama Produk</Label>
                   <Input
                     id="name"
                     value={formData.name}
                     onChange={e => setFormData({ ...formData, name: e.target.value })}
                     placeholder="Masukkan nama produk"
                     required
                   />
                 </div>
                 <div className="space-y-2">
                   <Label htmlFor="price">Harga (Rp)</Label>
                   <Input
                     id="price"
                     type="number"
                     min="0"
                     value={formData.price}
                     onChange={e => setFormData({ ...formData, price: e.target.value })}
                     placeholder="Masukkan harga"
                     required
                   />
                 </div>
                 <div className="space-y-2">
                   <Label htmlFor="stock">Stok</Label>
                   <Input
                     id="stock"
                     type="number"
                     min="0"
                     value={formData.stock}
                     onChange={e => setFormData({ ...formData, stock: e.target.value })}
                     placeholder="Masukkan jumlah stok"
                     required
                   />
                 </div>
                 <div className="flex gap-2 pt-4">
                   <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} className="flex-1">
                     Batal
                   </Button>
                   <Button type="submit" className="flex-1">
                     {editingProduct ? 'Simpan' : 'Tambah'}
                   </Button>
                 </div>
               </form>
             </DialogContent>
           </Dialog>
         </div>
 
         <Card>
           <CardHeader>
             <CardTitle className="flex items-center gap-2 text-lg">
               <Package className="h-5 w-5" />
               Daftar Produk ({products.length})
             </CardTitle>
           </CardHeader>
           <CardContent>
             {products.length === 0 ? (
               <div className="flex flex-col items-center justify-center py-12 text-center">
                 <Package className="mb-4 h-12 w-12 text-muted-foreground/50" />
                 <p className="text-muted-foreground">Belum ada produk</p>
                 <p className="text-sm text-muted-foreground">Klik tombol "Tambah Produk" untuk memulai</p>
               </div>
             ) : (
               <Table>
                 <TableHeader>
                   <TableRow>
                     <TableHead>Nama Produk</TableHead>
                     <TableHead className="text-right">Harga</TableHead>
                     <TableHead className="text-center">Stok</TableHead>
                     <TableHead className="text-right">Aksi</TableHead>
                   </TableRow>
                 </TableHeader>
                 <TableBody>
                   {products.map(product => (
                     <TableRow key={product.id}>
                       <TableCell className="font-medium">{product.name}</TableCell>
                       <TableCell className="text-right">{formatCurrency(product.price)}</TableCell>
                       <TableCell className="text-center">
                         <span className={product.stock <= 5 ? 'text-destructive font-medium' : ''}>
                           {product.stock}
                         </span>
                       </TableCell>
                       <TableCell className="text-right">
                         <div className="flex justify-end gap-2">
                           <Button
                             variant="ghost"
                             size="icon"
                             onClick={() => handleEdit(product)}
                           >
                             <Pencil className="h-4 w-4" />
                           </Button>
                           <Button
                             variant="ghost"
                             size="icon"
                             className="text-destructive hover:text-destructive"
                             onClick={() => deleteProduct(product.id)}
                           >
                             <Trash2 className="h-4 w-4" />
                           </Button>
                         </div>
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