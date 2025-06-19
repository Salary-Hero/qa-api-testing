import { expect } from '@playwright/test';
import { ZodSchema } from 'zod';

export function validateSchema<T>(
  data: unknown,
  schema: ZodSchema<T>,
  label = 'Schema validation'
) {
  const parsed = schema.safeParse(data);
  expect(parsed.success, `${label} failed`).toBe(true);
  if (!parsed.success) {
    console.error(`${label} errors:`, parsed.error.format());
  }
}