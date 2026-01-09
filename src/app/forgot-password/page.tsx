// app/forgot-password/page.tsx
import { Suspense } from 'react';
import ForgotPasswordForm from './ForgotPasswordForm';

export default function ForgotPasswordPage() {
  return (
    <section className="container mt-5">
      <div className="col-md-6 offset-md-3 col-lg-4 offset-lg-4">
        <div className="card shadow-sm p-4">
          <h4 className="mb-4 text-center">Forgot Password</h4>

          <Suspense fallback={<div className="text-center">Loading...</div>}>
            <ForgotPasswordForm />
          </Suspense>
        </div>
      </div>
    </section>
  );
}