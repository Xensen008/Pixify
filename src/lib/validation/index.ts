import { z } from "zod"

export const SignUpValidation = z.object({
    name: z.string().min(2, {message: 'Name must be at least 2 characters long'}).max(50),
    username: z.string().min(2, {message: 'Username must be at least 2 characters long'}).max(50),
    email: z.string().email(),
    password: z.string().min(8, {message: 'Password must be at least 8 characters long'}),
  })

export const SignInValidation = z.object({
  email: z.string().email(),
  password: z.string().min(8, {message: 'Password must be at least 8 characters long'}),
})
