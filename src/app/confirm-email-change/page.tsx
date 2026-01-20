import { Suspense } from 'react';
import ConfirmEmailChangeClient from './ConfirmEmailChangeClient';

export default function ConfirmEmailChangePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ConfirmEmailChangeClient />
    </Suspense>
  );
}
