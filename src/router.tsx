import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';

import App from './App';
import UserCrudPage from './crud/user/UserCrudPage';
import RouteTemplateCrudPage from './crud/route-template/RouteTemplateCrudPage';
import CustomerCrudPage from './crud/customer/CustomerCrudPage';
import RouteInstanceCrudPage from './crud/route-instance/RouteInstanceCrudPage';
import Register from './auth/Register';
import Login from './auth/Login';
import AppLayout from './AppLayout';
import RouteInstanceDetail from './route/RouteInstanceDetail';
import ProtectedRoute from './components/ProtectedRoute';

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
          <Route path="/route-template" element={<RouteTemplateCrudPage />} />
          <Route path="/customer" element={<CustomerCrudPage />} />
          <Route path="/route-instance" element={<RouteInstanceCrudPage />} />
          <Route path="/route-instance-detail/:id" element={<RouteInstanceDetail />} />
        </Route>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}
