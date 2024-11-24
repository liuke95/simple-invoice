import { Navigate } from 'react-router-dom';
import { LoginForm } from './components/login-form';

export function LoginPage() {
  const token = localStorage.getItem('access_token');

  if (token) {
    // Redirect to invoices if authenticated
    return <Navigate to='/invoices' replace />;
  }

  return (
    <div className='flex h-screen w-full items-center justify-center px-4'>
      <LoginForm />
    </div>
  );
}
