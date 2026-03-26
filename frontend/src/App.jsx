import { BrowserRouter } from 'react-router-dom';
import { ToastProvider } from './components/common/Toast';
import AnimatedRoutes from './components/AnimatedRoutes';
import './index.css';

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </ToastProvider>
  );
}
