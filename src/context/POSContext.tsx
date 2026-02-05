 import React, { createContext, useContext, ReactNode } from 'react';
 import { usePOSStore } from '@/hooks/usePOSStore';
 
 type POSContextType = ReturnType<typeof usePOSStore>;
 
 const POSContext = createContext<POSContextType | null>(null);
 
 export const POSProvider = ({ children }: { children: ReactNode }) => {
   const store = usePOSStore();
   return <POSContext.Provider value={store}>{children}</POSContext.Provider>;
 };
 
 export const usePOS = () => {
   const context = useContext(POSContext);
   if (!context) {
     throw new Error('usePOS must be used within a POSProvider');
   }
   return context;
 };