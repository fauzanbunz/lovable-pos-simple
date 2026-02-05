import { Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { usePOS } from '@/context/POSContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, ShoppingCart, BarChart3, ArrowRight, DollarSign } from 'lucide-react';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

const Index = () => {
  const { products, getTodayRevenue, getTodayTransactions } = usePOS();
  
  const todayRevenue = getTodayRevenue();
  const todayTransactionCount = getTodayTransactions().length;
  const lowStockProducts = products.filter(p => p.stock <= 5).length;

  return (
    <Layout>
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
            Selamat Datang di SimplePOS
          </h1>
          <p className="mt-2 text-muted-foreground">
            Kelola penjualan toko Anda dengan mudah dan efisien
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pendapatan Hari Ini
              </CardTitle>
              <DollarSign className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">{formatCurrency(todayRevenue)}</p>
              <p className="text-xs text-muted-foreground">{todayTransactionCount} transaksi</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Produk
              </CardTitle>
              <Package className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">{products.length}</p>
              {lowStockProducts > 0 && (
                <p className="text-xs text-destructive">{lowStockProducts} stok rendah</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Transaksi Hari Ini
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">{todayTransactionCount}</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Link to="/products" className="group">
            <Card className="h-full transition-all hover:border-primary hover:shadow-lg">
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <Package className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">Kelola Produk</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Tambah, edit, atau hapus produk
                </p>
                <Button variant="ghost" className="mt-4 gap-2 group-hover:text-primary">
                  Buka <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link to="/cashier" className="group">
            <Card className="h-full transition-all hover:border-primary hover:shadow-lg">
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-success/10">
                  <ShoppingCart className="h-7 w-7 text-success" />
                </div>
                <h3 className="font-semibold text-foreground">Kasir</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Proses transaksi penjualan
                </p>
                <Button variant="ghost" className="mt-4 gap-2 group-hover:text-success">
                  Buka <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link to="/reports" className="group">
            <Card className="h-full transition-all hover:border-primary hover:shadow-lg">
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-warning/10">
                  <BarChart3 className="h-7 w-7 text-warning" />
                </div>
                <h3 className="font-semibold text-foreground">Laporan</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Lihat pendapatan hari ini
                </p>
                <Button variant="ghost" className="mt-4 gap-2 group-hover:text-warning">
                  Buka <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
