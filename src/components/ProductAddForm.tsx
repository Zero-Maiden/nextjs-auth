import React from "react";

import axios from "axios";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

// shadcn/ui
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";

const productSchema = z.object({
  name: z.string(),
  category: z.string(),
  price: z.coerce.number(),
  description: z.string(),
});

function ProductAddForm({ onProductAdded }: { onProductAdded: () => void }) {
  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      category: "",
      price: 0,
      description: "",
    },
  });

  function onSubmit(values: z.infer<typeof productSchema>) {
    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        throw new Error("Access token tidak ditemukan!");
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      axios.post("http://localhost:5000/api/products/", values, { headers });

      console.log("Berhasil menambah produk!");

      setTimeout(() => {
        onProductAdded();
      }, 1000);

      form.reset();
    } catch (error) {
      console.error("Error menambah produk!");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Nama produk */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama</FormLabel>
              <FormControl>
                <Input placeholder="Nama" {...field} />
              </FormControl>
              <FormDescription>Field nama produk.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Kategori produk */}
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kategori</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Kategori" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Elektronik">Elektronik</SelectItem>
                  <SelectItem value="Makanan">Makanan</SelectItem>
                  <SelectItem value="Minuman">Minuman</SelectItem>
                  <SelectItem value="Lainnya">Lainnya</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>Field kategori produk.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Harga produk */}
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Harga</FormLabel>
              <FormControl>
                <Input placeholder="Harga" {...field} />
              </FormControl>
              <FormDescription>Field harga produk.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Deskripsi produk */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deskripsi</FormLabel>
              <FormControl>
                <Textarea placeholder="Deskripsi" {...field} />
              </FormControl>
              <FormDescription>Field deskripsi produk.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Tambah
        </Button>
      </form>
    </Form>
  );
}

export default ProductAddForm;
