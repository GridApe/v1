import { Suspense } from 'react';
import OtpVerificationForm from './otp-verification-form';

export default function OtpPage(): JSX.Element {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OtpVerificationForm />
    </Suspense>
  );
}
