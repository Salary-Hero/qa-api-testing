import { test, expect } from '@playwright/test';
import users from '../fixtures/withdraw.json'; // Adjust the path as necessary
import { authenticateUser } from '../utils/auth';
import { performWithdrawal, cancelWithdrawal } from '../utils/api';
import { assertTimestampFormat } from '../utils/assertions';

users.forEach((user) => {
  test.describe(`API Test - User ${user.phone}`, () => {
    let userToken: string;

    test.beforeAll(async ({ request }) => {
      await test.step('Authenticate user', async () => {
        try {
          userToken = await authenticateUser(request, user.phone);
        } catch (error) {
          console.error(`Failed to authenticate user ${user.phone}:`, error);
          throw error;
        }
      });
    });

    test(`Withdraw ${user.withdrawalAmount} baht for user ${user.phone}`, async ({ request }) => {
      let withdrawalBody: any;

      await test.step('Perform withdrawal request', async () => {
        withdrawalBody = await performWithdrawal(request, userToken, user.withdrawalAmount);

        // Assertions for withdrawal response
        expect(typeof withdrawalBody.earned_avaliable_amount).toBe('number');
        expect(typeof withdrawalBody.ewa_request_id).toBe('number');
        expect(['manual', 'auto']).toContain(withdrawalBody.process_type);
        expect(typeof withdrawalBody.amount).toBe('number');

        // Validate timestamp format
        assertTimestampFormat(withdrawalBody.created_at);
      });

      await test.step('Cancel the withdrawal request', async () => {
        const cancelBody = await cancelWithdrawal(request, withdrawalBody.ewa_request_id, userToken);

        // Assertions for cancellation response
        expect(typeof cancelBody.request_amount).toBe('number');
        expect(typeof cancelBody.ewa_request_id).toBe('number');
      });
    });
  });
});