"use client";

import React, { useEffect, useState } from "react";

import axios from "axios";

// import { User, user_columns } from "@/app/payments/columns";

import { User, user_columns } from "@/app/payments/user_columns";

import { DataTable } from "@/app/payments/data-table";

async function getUserData(): Promise<User[]> {
  try {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      throw new Error("Access token tidak ditemukan!");
    }

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await axios.get("http://localhost:5000/api/auth/users", { headers });

    const data = response.data.map((user: any) => ({
      id: user._id,
      name: user.name,
      email: user.email,
    }));

    return data;
  } catch (error) {
    console.error("Terjadi kesalahan pada saat fetching: ", error);
    return [];
  }
}

function CustomersTab() {
  const [userData, setUserData] = useState<User[]>([]);
  const [userLoading, setUserLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getUserData();
      setUserData(result);
      setUserLoading(false);
    };
    fetchData();
  }, []);

  if (userLoading) {
    return <div className="h-full flex items-center justify-center text-4xl">SmartPay</div>;
  }

  return <DataTable columns={user_columns} data={userData} />;
}

export default CustomersTab;
