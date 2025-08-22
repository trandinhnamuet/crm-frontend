import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';

import App from './App';
import UserCrudPage from './crud/user/UserCrudPage';
import RouteTemplateCrudPage from './crud/route-template/RouteTemplateCrudPage';
import CustomerCrudPage from './crud/customer/CustomerCrudPage';
import RouteInstanceCrudPage from './crud/route-instance/RouteInstanceCrudPage';
import Register from './auth/Register';
import Login from './auth/Login';
import AppLayout from './AppLayout';
import RouteInstanceCustomerDetail from './route/RouteInstanceCustomer/RouteInstanceCustomerDetail';
import RouteInstanceDetail from './route/RouteInstanceDetail';
import ProtectedRoute from './components/ProtectedRoute';
import CustomerHistoryPage from './crud/customer/CustomerHistoryPage';
import UserDetail from './crud/user/UserDetail';

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={
          <ProtectedRoute>
            <AppLayout><Outlet /></AppLayout>
          </ProtectedRoute>
        }>
          <Route path="/" element={<App />} />
          <Route path="/user" element={<UserCrudPage />} />
          <Route path="/user/:id" element={<UserDetail />} />
          <Route path="/route-template" element={<RouteTemplateCrudPage />} />
          <Route path="/customer" element={<CustomerCrudPage />} />
          <Route path="/customer/:customerId/history" element={<CustomerHistoryPage />} />
          <Route path="/route-instance" element={<RouteInstanceCrudPage />} />
          <Route path="/route-instance-detail/:id" element={<RouteInstanceDetail />} />
          <Route path="/route-instance-customer/:routeInstanceCustomerId" element={<RouteInstanceCustomerDetail />} />
        </Route>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}
