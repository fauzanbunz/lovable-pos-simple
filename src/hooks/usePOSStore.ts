 import { useState, useEffect } from 'react';
 import { Product, Transaction, CartItem } from '@/types/pos';
 
 const PRODUCTS_KEY = 'pos_products';
 const TRANSACTIONS_KEY = 'pos_transactions';
 
 export const usePOSStore = () => {
   const [products, setProducts] = useState<Product[]>([]);
   const [transactions, setTransactions] = useState<Transaction[]>([]);
   const [cart, setCart] = useState<CartItem[]>([]);
 
   // Load from localStorage on mount
   useEffect(() => {
     const savedProducts = localStorage.getItem(PRODUCTS_KEY);
     const savedTransactions = localStorage.getItem(TRANSACTIONS_KEY);
     
     if (savedProducts) {
       setProducts(JSON.parse(savedProducts));
     }
     if (savedTransactions) {
       setTransactions(JSON.parse(savedTransactions));
     }
   }, []);
 
   // Save products to localStorage
   useEffect(() => {
     localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
   }, [products]);
 
   // Save transactions to localStorage
   useEffect(() => {
     localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
   }, [transactions]);
 
   // Product operations
   const addProduct = (product: Omit<Product, 'id' | 'createdAt'>) => {
     const newProduct: Product = {
       ...product,
       id: crypto.randomUUID(),
       createdAt: new Date(),
     };
     setProducts(prev => [...prev, newProduct]);
   };
 
   const updateProduct = (id: string, updates: Partial<Omit<Product, 'id' | 'createdAt'>>) => {
     setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
   };
 
   const deleteProduct = (id: string) => {
     setProducts(prev => prev.filter(p => p.id !== id));
   };
 
   // Cart operations
   const addToCart = (product: Product) => {
     setCart(prev => {
       const existing = prev.find(item => item.product.id === product.id);
       if (existing) {
         if (existing.quantity >= product.stock) return prev;
         return prev.map(item =>
           item.product.id === product.id
             ? { ...item, quantity: item.quantity + 1 }
             : item
         );
       }
       if (product.stock <= 0) return prev;
       return [...prev, { product, quantity: 1 }];
     });
   };
 
   const removeFromCart = (productId: string) => {
     setCart(prev => prev.filter(item => item.product.id !== productId));
   };
 
   const updateCartQuantity = (productId: string, quantity: number) => {
     if (quantity <= 0) {
       removeFromCart(productId);
       return;
     }
     setCart(prev => prev.map(item =>
       item.product.id === productId ? { ...item, quantity } : item
     ));
   };
 
   const clearCart = () => setCart([]);
 
   const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
 
   // Transaction operations
   const completeTransaction = () => {
     if (cart.length === 0) return;
 
     const transaction: Transaction = {
       id: crypto.randomUUID(),
       items: [...cart],
       total: cartTotal,
       createdAt: new Date(),
     };
 
     // Update stock
     cart.forEach(item => {
       updateProduct(item.product.id, {
         stock: item.product.stock - item.quantity,
       });
     });
 
     setTransactions(prev => [...prev, transaction]);
     clearCart();
   };
 
   const getTodayRevenue = () => {
     const today = new Date();
     today.setHours(0, 0, 0, 0);
     
     return transactions
       .filter(t => new Date(t.createdAt) >= today)
       .reduce((sum, t) => sum + t.total, 0);
   };
 
   const getTodayTransactions = () => {
     const today = new Date();
     today.setHours(0, 0, 0, 0);
     
     return transactions.filter(t => new Date(t.createdAt) >= today);
   };
 
   return {
     products,
     addProduct,
     updateProduct,
     deleteProduct,
     cart,
     addToCart,
     removeFromCart,
     updateCartQuantity,
     clearCart,
     cartTotal,
     transactions,
     completeTransaction,
     getTodayRevenue,
     getTodayTransactions,
   };
 };