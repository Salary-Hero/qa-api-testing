import { test, expect } from '@playwright/test';
import { VersionSchema } from '../schema/schemas';
import { validateSchema } from '../utils/schema-helpers';
import { z } from 'zod';

type VersionPayload = z.infer<typeof VersionSchema>;

test.describe('API – Version Check', () => {
  test('returns valid and correct version payload', async ({ request }) => {
    const response = await request.get('/api/v1/public/account/version');

    await test.step('Validate response status and headers', async () => {
      expect(response.status()).toBe(200);
      expect(response.headers()['content-type']).toMatch(/application\/json/);
    });

    const body: VersionPayload = await response.json();

    await test.step('Validate response structure (Zod schema)', async () => {
      validateSchema(body, VersionSchema, 'Version API response');
    });

    await test.step('Assert version format and VAT logic', async () => {
      const androidVersion = body.versions?.android_version;
      const vat = body.vat_percentage;

      expect(androidVersion).toMatch(/^\d+\.\d+\.\d+$/);
      expect(vat).toBe(7);
    });
  });
});
