import { z } from 'zod';

export const idField = z.number().int().positive({ message: "O ID deve ser um número inteiro positivo." });
export const titleField = z.string().min(1, { message: "O título é obrigatório." });
export const descriptionField = z.string().optional();
export const completedField = z.boolean().optional().default(false);
