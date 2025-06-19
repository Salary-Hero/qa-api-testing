import { APIRequestContext, expect } from '@playwright/test';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const FIREBASE_KEY = process.env.FIREBASE_KEY;

if (!FIREBASE_KEY) {
  throw new Error('FIREBASE_KEY is not defined in the environment variables.');
}

export async function authenticateUser(apiContext: APIRequestContext, phone: string): Promise<string> {
  // Step 1: Request login
  const loginResponse = await apiContext.post('api/v2/public/account/authen/login/phone', {
    data: { phone },
  });
  const loginData = await loginResponse.json();
  const refCode = loginData.verification_info.ref_code;

  // Step 2: Verify OTP
  const verifyOTPResponse = await apiContext.post('api/v2/public/account/authen/login/verify-otp', {
    data: { phone, ref_code: refCode, code: '111111' },
  });
  const verifyData = await verifyOTPResponse.json();
  const customToken = verifyData.token;

  // Step 3: Exchange for Firebase token
  const firebaseUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${FIREBASE_KEY}`;
  const firebaseResponse = await apiContext.post(firebaseUrl, {
    data: { token: customToken, returnSecureToken: true },
  });
  expect(firebaseResponse.status()).toBe(200);
  const firebaseData = await firebaseResponse.json();
  const userToken = firebaseData.idToken;

  // Step 4: Setup PIN
  const setupPinResponse = await apiContext.post('/api/v1/user/account/profile/pincode/create', {
    data: { pincode: '000000' },
    headers: { Authorization: `Bearer ${userToken}` },
  });
  expect(setupPinResponse.status()).toBe(200);

  return userToken;
}