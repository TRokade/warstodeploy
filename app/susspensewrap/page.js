import { Suspense } from 'react';
import AuthSuccess from '../(auth)/auth-success/page';
import OrderReview from '../order-review/page';

export default function AuthSuccessPage() {
  return (
    <>
      {/* Wrap both components with Suspense */}
      <Suspense fallback={<div>Loading auth success...</div>}>
        <AuthSuccess />
      </Suspense>

      <Suspense fallback={<div>Loading order review...</div>}>
        <OrderReview />
      </Suspense>
    </>
  );
}