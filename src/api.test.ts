import { test, expect, request } from '@playwright/test';

test('GET request to example API', async ({ request }) => {
  const res = await request.get('https://jsonplaceholder.typicode.com/posts/1');
  expect(res.ok()).toBeTruthy();
  const json = await res.json();
  expect(json.id).toBe(1);
});
