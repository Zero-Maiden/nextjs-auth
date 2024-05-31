"use client";

import { useState, useTransition } from "react";
import * as z from "zod";
import axios from "axios";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Schema
import { RegisterSchema } from "../../../schemas";

import { CardWrapper } from "./CardWrapper";
import { FormError } from "../FormError";
import { FormSuccess } from "../FormSuccess";

// shadcn/ui
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export const RegisterForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      axios
        .post("http://localhost:5000/api/auth/register", values)
        .then((response) => {
          if (response.data.error) {
            setError(response.data.error || "Register gagal!");
            return;
          }
          const accessToken = response.data.access_token;
          if (accessToken) {
            localStorage.setItem("accessToken", accessToken);
            setSuccess(response.data.success || "Register berhasil!");
          } else {
            setError("Access token tidak ditemukan!.");
          }
        })
        .catch((error) => {
          if (!error.response) {
            setError("Terjadi kesalahan!");
          }
          setError(error.response.data.error);
        });
    });
  };

  return (
    <CardWrapper headerLabel="Buat akun baru" backButtonLabel="Sudah punya akun?" backButtonHref="/auth/login" showSocial>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isPending} placeholder="Juan Albert Pudjianto" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isPending} placeholder="juan.albert.pudjianto@email.com" type="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isPending} placeholder="******" type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button disabled={isPending} type="submit" className="w-full">
            Register
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
