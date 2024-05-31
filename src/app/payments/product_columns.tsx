"use client";

import axios from "axios";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import { ProductEditForm } from "@/components/ProductEditForm";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
};

export const product_columns: ColumnDef<Product>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Nama
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "category",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Kategori
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "description",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Deskripsi
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <div className="text-right">
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="text-right">
            Harga
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"));
      const formatted = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(price);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const product = row.original;

      // Hapus produk
      const deleteProducts = async () => {
        try {
          const token = localStorage.getItem("accessToken");
          if (!token) {
            throw new Error("Access token tidak ditemukan!");
          }
          const headers = {
            Authorization: `Bearer ${token}`,
          };
          const response = await axios.delete(`http://localhost:5000/api/products/${product.id}`, { headers });
          console.log("Produk berhasil dihapus:", response.data);
        } catch (error) {
          console.error("Error menghapus produk:", error);
        }
      };

      return (
        <div className="text-center">
          <Dialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(product.id)}>Salin informasi produk</DropdownMenuItem>
                <DropdownMenuSeparator />

                {/* Tombol dialog pop-up */}
                <DialogTrigger className="w-full">
                  <DropdownMenuItem>
                    <DialogTrigger>Edit produk</DialogTrigger>
                  </DropdownMenuItem>
                </DialogTrigger>

                <DropdownMenuItem
                  onClick={() => {
                    deleteProducts();
                  }}
                >
                  Hapus produk
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Dialog content untuk edit produk */}
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit produk</DialogTitle>
                <DialogDescription>Form edit produk.</DialogDescription>
              </DialogHeader>
              <ProductEditForm
                productId={product.id}
                productName={product.name}
                productCategory={product.category}
                productDescription={product.description}
                productPrice={product.price}
                // onProductEdited={handleProductEdited}
              />
            </DialogContent>
          </Dialog>
        </div>
      );
    },
    size: 50,
  },
];
