import * as z from "zod";

export const SignUpSchema = z.object({
  email: z.string().email(),
  name: z
    .string()
    .min(4, { message: "Please add a name with at least 4 characters" }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters long",
  })
})
