 export interface Product {
   id: string;
   name: string;
   price: number;
   stock: number;
   createdAt: Date;
 }
 
 export interface CartItem {
   product: Product;
   quantity: number;
 }
 
 export interface Transaction {
   id: string;
   items: CartItem[];
   total: number;
   createdAt: Date;
 }