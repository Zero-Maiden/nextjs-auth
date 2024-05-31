"use client";

import React, { useEffect, useState } from "react";

import axios from "axios";

import { DataTable } from "@/app/payments/data-table";
// import { Product, product_columns } from "@/app/payments/columns";
import { Product, product_columns } from "@/app/payments/product_columns";
import ProductAddForm from "@/components/ProductAddForm";

// shadcn/ui
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

async function getProductData(): Promise<Product[]> {
  try {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      throw new Error("Access token tidak ditemukan!");
    }

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await axios.get("http://localhost:5000/api/products", { headers });

    const data = response.data.map((product: any) => ({
      id: product._id,
      name: product.name,
      category: product.category,
      description: product.description,
      price: product.price,
    }));

    return data;
  } catch (error) {
    console.error("Terjadi kesalahan pada saat fetching: ", error);
    return [];
  }
}

function ProductsTab() {
  const [productData, setProductData] = useState<Product[]>([]);
  const [productLoading, setProductLoading] = useState(true);
  const [productAdded, setProductAdded] = useState(false);

  // Refresh data produk pxada saat mounting
  useEffect(() => {
    const fetchData = async () => {
      const result = await getProductData();
      setProductData(result);
      setProductLoading(false);
    };
    fetchData();
  }, [productAdded]);

  if (productLoading) {
    return <div className="h-full flex items-center justify-center text-4xl">SmartPay</div>;
  }

  const handleProductAdded = () => {
    setProductAdded((prev) => !prev);
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button>Tambah</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah produk</DialogTitle>
            <DialogDescription>Form tambah produk.</DialogDescription>
            <ProductAddForm onProductAdded={handleProductAdded} />
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <DataTable columns={product_columns} data={productData} />
    </>
  );
}

export default ProductsTab;
