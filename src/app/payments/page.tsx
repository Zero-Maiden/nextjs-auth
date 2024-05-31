import React from "react";

import Header from "@/components/Header";
import CustomersTab from "@/components/payments/CustomersTab";
import OrdersTab from "@/components/payments/OrdersTab";
import ProductsTab from "@/components/payments/ProductsTab";

// shadcn/ui
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import TransactionsTab from "@/components/payments/TransactionsTab";
import DashboardTab from "@/components/payments/DashboardTab";

export default function Page() {
  return (
    <div className="h-screen flex flex-col">
      <Header />
      <Separator />
      <div className="flex-grow p-4">
        <Tabs className="h-full flex flex-col" defaultValue="home">
          {/* Tab */}
          <TabsList>
            <TabsTrigger value="home">Home</TabsTrigger>
            <TabsTrigger value="order">Order</TabsTrigger>
            <TabsTrigger value="transactions">Transaksi</TabsTrigger>
            <TabsTrigger value="customers">Customer</TabsTrigger>
            <TabsTrigger value="products">Produk</TabsTrigger>
          </TabsList>

          {/* Home */}
          <TabsContent value="home" className="h-full">
            <DashboardTab />
          </TabsContent>

          {/* Order */}
          <TabsContent value="order" className="h-full overflow-auto">
            <OrdersTab />
          </TabsContent>

          {/* Transaksi */}
          <TabsContent value="transactions" className="h-full">
            <TransactionsTab />
          </TabsContent>

          {/* Customer */}
          <TabsContent value="customers" className="h-full">
            <CustomersTab />
          </TabsContent>

          {/* Produk */}
          <TabsContent value="products" className="h-full">
            <ProductsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
