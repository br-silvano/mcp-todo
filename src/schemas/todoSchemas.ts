import { z } from 'zod';

import { idField, titleField, descriptionField, completedField } from './fields';

export const CreateTaskSchema = z.object({
  title: titleField,
  description: descriptionField,
  completed: completedField,
});

export const ReadTaskSchema = z.object({
  id: idField,
});

export const UpdateTaskSchema = z.object({
  id: idField,
  title: titleField.optional(),
  description: descriptionField,
  completed: completedField,
});

export const DeleteTaskSchema = z.object({
  id: idField,
});

export const TodoSchema = z.object({
  id: idField,
  title: titleField,
  description: descriptionField,
  completed: completedField,
});

export type Todo = z.infer<typeof TodoSchema>;
