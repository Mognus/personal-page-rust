import { z } from "zod";

// Validation for the login form; shared by the client form and the BFF route.
export const loginSchema = z.object({
    email: z.email("Enter a valid email"),
    password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;
