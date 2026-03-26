import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export function useToast() {
    return useContext(ToastContext);
}

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((message, type = 'info') => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);

        setTimeout(() => {
            setToasts((prev) => prev.filter((toast) => toast.id !== id));
        }, 4000);
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`
              flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border backdrop-blur-md transform transition-all duration-300 animate-slide-up
              ${toast.type === 'error'
                                ? 'bg-error-container/20 border-error/50 text-error'
                                : toast.type === 'success'
                                    ? 'bg-primary-container/20 border-primary/50 text-primary'
                                    : 'bg-surface-container-high border-white/10 text-white'
                            }
            `}
                    >
                        <span className="material-symbols-outlined text-xl">
                            {toast.type === 'error' ? 'error' : toast.type === 'success' ? 'check_circle' : 'info'}
                        </span>
                        <span className="text-sm font-medium">{toast.message}</span>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}
