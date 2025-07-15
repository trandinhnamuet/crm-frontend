
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Router from './router';
import { UserProvider } from './context/UserContext';

// Hàm in ra các biến môi trường, có thể gọi từ console
function printEnvVars() {
  console.log(import.meta.env);
}
(window as any).printEnvVars = printEnvVars;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserProvider>
      <Router />
    </UserProvider>
  </StrictMode>,
)
