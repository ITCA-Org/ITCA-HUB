export interface FormErrors {
  [key: string]: string;
}

export interface AuthButtonProps {
  disabled?: boolean;
  className?: string;
  isLoading?: boolean;
  fullWidth?: boolean;
  onClick?: () => void;
  loadingText?: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  type?: 'button' | 'submit' | 'reset';
}
