import { BrowserRouter } from 'react-router-dom';
import { ToastProvider } from './components/common/Toast';
import { AuthProvider } from './context/AuthContext';
import AnimatedRoutes from './components/AnimatedRoutes';
import './index.css';

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <AnimatedRoutes />
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}
