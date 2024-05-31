"use client";

import React, { useEffect, useState } from "react";

import axios from "axios";

import { DataTable } from "@/app/payments/data-table";

import { Transaction, transaction_columns } from "@/app/payments/transaction_columns";

async function getTransactionData(): Promise<Transaction[]> {
  try {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      throw new Error("Access token tidak ditemukan!");
    }

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await axios.get("http://localhost:5000/api/transactions", { headers });

    const data = response.data.map((product: any) => ({
      id: product._id,
      price: product.order_total_price,
    }));

    return data;
  } catch (error) {
    console.error("Terjadi kesalahan pada saat fetching: ", error);
    return [];
  }
}

function TransactionsTab() {
  const [transactionData, setTransactionData] = useState<Transaction[]>([]);
  const [transactionLoading, setTransactionLoading] = useState(true);
  const [transactionChange, setTransactionChange] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getTransactionData();
      setTransactionData(result);
      setTransactionLoading(false);
    };
    fetchData();
  }, [transactionChange]);

  const handleTransactionChange = () => {
    setTransactionChange((prev) => !prev);
  };

  if (transactionLoading) {
    return <div className="h-full flex items-center justify-center text-4xl">SmartPay</div>;
  }

  return <DataTable columns={transaction_columns} data={transactionData} />;
}

export default TransactionsTab;
