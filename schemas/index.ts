import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email harus diisi",
  }),
  password: z.string().min(1, {
    message: "Password harus diisi",
  }),
});

export const RegisterSchema = z.object({
  name: z.string().min(1, {
    message: "Nama harus diisi",
  }),
  email: z.string().email({
    message: "Email harus diisi",
  }),
  password: z.string().min(6, {
    message: "Password harus diisi (minimum 6 karakter)",
  }),
});
