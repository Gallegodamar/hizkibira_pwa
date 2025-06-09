import React from 'react';

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  className?: string;
  disabled?: boolean;
  ariaLabel?: string;
  style?: React.CSSProperties; // Added style prop
  selected?: boolean; // Added selected prop
}

const Button: React.FC<ButtonProps> = ({ onClick, children, variant = 'primary', className = '', disabled = false, ariaLabel, style, selected = false }) => {
  let baseStyle = 'py-2.5 px-5 rounded-lg font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-opacity-75 transition-all duration-150 ease-in-out text-base w-full btn';
  
  let variantStyle = '';
  switch (variant) {
    case 'primary':
      baseStyle += ' bg-sky-500 hover:bg-sky-600 focus:ring-sky-300 text-white';
      break;
    case 'secondary':
      baseStyle += ' bg-slate-100 hover:bg-slate-200 focus:ring-sky-400 text-slate-700 border border-slate-300';
      break;
    case 'danger':
      baseStyle += ' bg-red-500 hover:bg-red-600 focus:ring-red-300 text-white';
      break;
    case 'success':
      baseStyle += ' bg-green-500 hover:bg-green-600 focus:ring-green-300 text-white';
      break;
  }

  if (selected) {
    if (variant === 'secondary') {
      // Style for selected secondary buttons (e.g., options before submission)
      baseStyle += ' ring-2 ring-sky-500 ring-inset'; 
    }
    // Add other selected styles if needed for other variants
  }

  if (disabled) {
    baseStyle += ' opacity-50 cursor-not-allowed';
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${className}`}
      aria-label={ariaLabel || (typeof children === 'string' ? children : 'button')}
      style={style} // Apply the style prop
    >
      {children}
    </button>
  );
};

export default Button;