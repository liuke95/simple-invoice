import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthGuard from './components/auth-guard';

import { Toaster } from '@/components/ui/toaster';
import Invoices from './modules/invoices/page';
import { LoginPage } from './modules/login/page';
import Layout from './components/layout';
import CreateInvoice from './modules/create-invoice/page';

function App() {
  return (
    <>
      <Toaster />
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path='/login' element={<LoginPage />} />

          {/* Protected Routes */}
          <Route element={<AuthGuard />}>
            <Route element={<Layout />}>
              <Route path='/invoices' element={<Invoices />} />
              <Route path='/create-invoice' element={<CreateInvoice />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
