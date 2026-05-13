import { z } from "zod";

export const registerSchema = z
  .object({
    email: z.email("Недійсний формат електронної пошти"),
    fullName: z.string().min(2, "Ім'я занадто коротке"),
    password: z
      .string()
      .min(8, "Пароль має містити щонайменше 8 символів")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/,
        "Пароль повинен містити щонайменше одну велику літеру, одну малу літеру та одну цифру",
      ),
    confirmPassword: z.string().min(1, "Будь ласка, підтвердіть свій пароль"),
    phone: z
      .string()
      .min(
        13,
        "Якщо Ви вказуєте номер телефону, введіть його у коректному форматі",
      )
      .optional()
      .or(z.literal("")),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Паролі мають збігатися",
    path: ["confirmPassword"],
  });

export type RegisterSchema = z.infer<typeof registerSchema>;
