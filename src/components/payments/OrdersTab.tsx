"use client";

import React, { useEffect, useState } from "react";

import axios from "axios";

import { Product } from "@/app/payments/product_columns";

import { Plus } from "lucide-react";

// shadcn/ui
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

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

function OrdersTab() {
  const [productData, setProductData] = useState<Product[]>([]);
  const [orderData, setOrderData] = useState<{ product: Product; quantity: number }[]>([]);

  const [productLoading, setProductLoading] = useState(true);

  // Refresh data produk pada saat mounting
  useEffect(() => {
    const fetchData = async () => {
      const result = await getProductData();
      setProductData(result);
      setProductLoading(false);
    };
    fetchData();
  }, []);

  // Mengubah mata uang ke IDR (Indonesian Rupiah)
  const formatCurrency = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(price);
  };

  // Menambah produk ke list order
  const addToOrder = (product: Product) => {
    setOrderData((prevOrderData) => {
      const existingOrder = prevOrderData.find((order) => order.product.id === product.id);
      if (existingOrder) {
        return prevOrderData.map((order) => (order.product.id === product.id ? { ...order, quantity: order.quantity + 1 } : order));
      } else {
        return [...prevOrderData, { product, quantity: 1 }];
      }
    });
  };

  // Menghapus produk dari list order
  const removeFromOrder = (product: Product) => {
    setOrderData((prevOrderData) => {
      const existingOrder = prevOrderData.find((order) => order.product.id === product.id);
      if (existingOrder) {
        if (existingOrder.quantity > 1) {
          return prevOrderData.map((order) => (order.product.id === product.id ? { ...order, quantity: order.quantity - 1 } : order));
        } else {
          return prevOrderData.filter((order) => order.product.id !== product.id);
        }
      } else {
        return prevOrderData;
      }
    });
  };

  const calculateTotalPrice = () => {
    return orderData.reduce((total, order) => total + order.product.price * order.quantity, 0);
  };

  function onSubmit() {
    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        throw new Error("Access token tidak ditemukan!");
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const orderTotalPrice = calculateTotalPrice();
      const orderObject = { order_list: orderData, order_total_price: orderTotalPrice };
      console.log(JSON.stringify(orderObject));

      axios.post("http://localhost:5000/api/transactions", orderObject, { headers });

      console.log("Berhasil menambah transaksi!");

      // setTimeout(() => {
      //   onProductAdded();
      // }, 1000);

      // form.reset();
    } catch (error) {
      console.error("Error menambah produk!");
    }
  }

  if (productLoading) {
    return <div className="h-full flex items-center justify-center text-4xl">SmartPay</div>;
  }

  return (
    <div className="flex h-full gap-4">
      {/* Kategori */}
      <div className="flex flex-col gap-2 w-60">
        Kategori
        <Separator />
        <Button variant="outline" className="h-[156px]">
          <Plus />
        </Button>
        <div className="flex flex-col gap-2">
          <Button variant="outline">Elektronik</Button>
          <Button variant="outline">Makanan</Button>
          <Button variant="outline">Minuman</Button>
          <Button variant="outline">Lainnya</Button>
        </div>
      </div>

      {/* Produk */}
      <div className="flex flex-col gap-2 w-full">
        Produk
        <Separator />
        <ScrollArea className="max-h-[803px]">
          <div className="flex flex-wrap">
            {productData.map((product) => (
              <div key={product.id} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
                <div className="m-[4px]">
                  <Card className="h-[259px] flex flex-col">
                    <CardHeader>
                      <CardTitle>{product.name}</CardTitle>
                      <CardDescription>{product.category}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p>{product.description}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <p>{formatCurrency(product.price)}</p>
                      <Button onClick={() => addToOrder(product)}>Tambah</Button>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Order */}
      <div className="flex flex-col gap-2 w-[720px] h-full">
        Order
        <Separator />
        <ScrollArea className="h-[702px] flex flex-col flex-grow">
          <div className="flex flex-col gap-2">
            {orderData.length > 0 ? (
              orderData.map((order) => (
                <Card key={order.product.id}>
                  <CardHeader>
                    <CardTitle>{order.product.name}</CardTitle>
                    <CardDescription>{order.product.category}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between">
                      <p>
                        {formatCurrency(order.product.price)} x {order.quantity}
                      </p>
                      <p>{formatCurrency(order.product.price * order.quantity)}</p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button onClick={() => removeFromOrder(order.product)}>Hapus</Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="h-[702px] flex items-center justify-center">Tidak ada order.</div>
            )}
          </div>
        </ScrollArea>
        <div>
          <Separator />

          {/* Bagian bawah order */}
          <div className="flex flex-col gap-4">
            {/* Total order */}
            <div className="flex justify-between mt-4">
              <p>Total</p>
              <p>{formatCurrency(calculateTotalPrice())}</p>
            </div>

            {/* Button order akan memunculkan dialog pop-up */}
            <Dialog>
              <DialogTrigger asChild>{calculateTotalPrice() === 0 ? <Button disabled>Order</Button> : <Button>Order</Button>}</DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Order</DialogTitle>
                  <DialogDescription>Total harga semua produk yang sudah ada di list order.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <div className="col-span-4 flex h-[436px] flex-col">
                      <ScrollArea>
                        <div className="flex flex-col gap-2">
                          {orderData.map((order) => (
                            <Card key={order.product.id}>
                              <CardHeader>
                                <CardTitle>{order.product.name}</CardTitle>
                                <CardDescription>{order.product.category}</CardDescription>
                              </CardHeader>
                              <CardContent>
                                <div className="flex justify-between">
                                  <p>
                                    {formatCurrency(order.product.price)} x {order.quantity}
                                  </p>
                                  <p>{formatCurrency(order.product.price * order.quantity)}</p>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="total" className="text-right">
                      Total
                    </Label>
                    <Label htmlFor="total" className="col-span-3 text-right">
                      {formatCurrency(calculateTotalPrice())}
                    </Label>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="payment" className="text-right">
                      Bayar
                    </Label>
                    <Label htmlFor="payment" className="text-right col-span-1">
                      Rp
                    </Label>
                    <Input id="payment" className="col-span-2" placeholder="30.000,00" />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={() => onSubmit()}>
                    Order
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrdersTab;
