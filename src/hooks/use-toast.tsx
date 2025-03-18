'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

type ToastVariant = 'default' | 'success' | 'error' | 'warning' | 'info';

type ToastProps = {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
};

type ToastContextType = {
  toasts: ToastProps[];
  toast: (props: Omit<ToastProps, 'id'>) => void;
  dismiss: (id: string) => void;
  dismissAll: () => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const toast = ({ title, description, variant = 'default', duration = 5000 }: Omit<ToastProps, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { id, title, description, variant, duration };
    
    setToasts((prevToasts) => [...prevToasts, newToast]);
    
    if (duration > 0) {
      setTimeout(() => {
        dismiss(id);
      }, duration);
    }
  };

  const dismiss = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  const dismissAll = () => {
    setToasts([]);
  };

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss, dismissAll }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
};

const ToastContainer: React.FC = () => {
  const context = useContext(ToastContext);
  
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  
  const { toasts, dismiss } = context;
  
  if (toasts.length === 0) return null;
  
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`rounded-lg shadow-lg p-4 transition-all transform animate-in slide-in-from-right-5 ${
            getVariantStyles(toast.variant || 'default')
          }`}
          role="alert"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">{toast.title}</h3>
              {toast.description && <p className="text-sm mt-1">{toast.description}</p>}
            </div>
            <button
              onClick={() => dismiss(toast.id)}
              className="ml-4 inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <span className="sr-only">Close</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

const getVariantStyles = (variant: ToastVariant): string => {
  switch (variant) {
    case 'success':
      return 'bg-green-50 text-green-800 border border-green-200';
    case 'error':
      return 'bg-red-50 text-red-800 border border-red-200';
    case 'warning':
      return 'bg-yellow-50 text-yellow-800 border border-yellow-200';
    case 'info':
      return 'bg-blue-50 text-blue-800 border border-blue-200';
    default:
      return 'bg-white text-gray-800 border border-gray-200';
  }
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  
  return context;
}; 