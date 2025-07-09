import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import UserCrudPage from './crud/user/UserCrudPage';
import RouteTemplateCrudPage from './crud/route-template/RouteTemplateCrudPage';
import CustomerCrudPage from './crud/customer/CustomerCrudPage';
import RouteInstanceCrudPage from './crud/route-instance/RouteInstanceCrudPage';

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/user" element={<UserCrudPage />} />
        <Route path="/route-template" element={<RouteTemplateCrudPage />} />
        <Route path="/customer" element={<CustomerCrudPage />} />
        <Route path="/route-instance" element={<RouteInstanceCrudPage />} />
      </Routes>
    </BrowserRouter>
  );
}
