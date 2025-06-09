import React from 'react';
import Button from './Button';

interface ErrorComponentProps {
  message: string;
  onRetry: () => void;
}

const ErrorComponent: React.FC<ErrorComponentProps> = ({ message, onRetry }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 text-red-700 p-6 text-center">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
        <svg className="h-16 w-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 className="text-2xl font-bold mb-3">Errore Bat Gertatu Da</h2>
        <p className="text-red-600 mb-6">{message}</p>
        <Button onClick={onRetry} variant="danger">
          Saiatu Berriro
        </Button>
      </div>
    </div>
  );
};

export default ErrorComponent;