import { z } from 'zod';

export const VersionSchema = z.object({
  currency: z.object({
    base_currency_symbol: z.string().length(1),
  }),
  versions: z.object({
    android_version: z.string().regex(/^\d+\.\d+\.\d+$/),
    ios_version:     z.string().regex(/^\d+\.\d+\.\d+$/),
    web_version:     z.string(),
  }),
  maintenance:     z.boolean(),
  instant_payment: z.boolean(),
  vat_percentage:  z.number().int().min(0).max(20),
});