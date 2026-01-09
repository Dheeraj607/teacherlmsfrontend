// app/forgot-password/page.tsx
import { Suspense } from 'react';
import ForgotPasswordForm from './ForgotPasswordForm';

export default function ForgotPasswordPage() {
  return (
    <section className="container mt-5">
      <div className="col-md-6 offset-md-3 col-lg-4 offset-lg-4">
       
         

          <Suspense fallback={<div className="text-center">Loading...</div>}>
            <ForgotPasswordForm />
          </Suspense>
        </div>
      
    </section>
  );
}