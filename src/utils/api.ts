import { APIRequestContext } from '@playwright/test';

/**
 * Perform a withdrawal request.
 */
export async function performWithdrawal(
  request: APIRequestContext,
  userToken: string,
  withdrawalAmount: number,
  pincode: string = '000000'
) {
  const response = await request.post('/api/v3/user/ewa/request/withdraw', {
    data: {
      request_amount: withdrawalAmount,
      process_type: 'manual',
      pincode,
    },
    headers: {
      Authorization: `Bearer ${userToken}`,
    },
  });

  if (!response.ok()) {
    throw new Error(`Withdrawal request failed with status ${response.status()}`);
  }

  return response.json();
}

/**
 * Cancel a withdrawal request.
 */
export async function cancelWithdrawal(request: APIRequestContext, ewaRequestId: number, userToken: string) {
  const response = await request.put(`/api/v3/user/ewa/request/${ewaRequestId}/cancel`, {
    headers: {
      Authorization: `Bearer ${userToken}`,
    },
  });

  if (!response.ok()) {
    throw new Error(`Cancellation request failed with status ${response.status()}`);
  }

  return response.json();
}