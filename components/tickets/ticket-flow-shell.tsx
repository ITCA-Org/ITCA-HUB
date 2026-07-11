import Link from 'next/link';
import { ArrowLeft, Loader } from 'lucide-react';
import { ReactNode } from 'react';

export const TICKET_BLUE = '#2763eb';
export const TICKET_BUTTON_BLUE = '#3b82f6';

export const ticketFlowButtonClassName =
  'flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 text-[15px] font-semibold text-white shadow-[0_3px_10px_rgba(59,130,246,0.28)] transition hover:brightness-105 active:scale-[0.98] disabled:opacity-50';

export const ticketFlowButtonInlineClassName =
  'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold text-white shadow-[0_3px_10px_rgba(59,130,246,0.28)] transition hover:brightness-105 active:scale-[0.98]';

interface TicketFlowShellProps {
  title: string;
  backHref?: string;
  children: ReactNode;
  centerContent?: boolean;
}

export function TicketFlowShell({
  title,
  backHref = '/',
  children,
  centerContent = true,
}: TicketFlowShellProps) {
  return (
    <div
      className="flex h-dvh flex-col overflow-hidden"
      style={{ backgroundColor: TICKET_BLUE }}
    >
      <header className="flex shrink-0 items-center justify-between px-3 py-2 text-white">
        <Link
          href={backHref}
          className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-white/10"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-base font-semibold">{title}</h1>
        <div className="h-9 w-9" />
      </header>

      <div
        className={`flex min-h-0 flex-1 flex-col px-4 pb-4 pt-1 ${
          centerContent ? 'items-stretch justify-center' : 'justify-start'
        }`}
      >
        {children}
      </div>
    </div>
  );
}

interface TicketFlowCardProps {
  children: ReactNode;
  className?: string;
}

export function TicketFlowCard({ children, className = '' }: TicketFlowCardProps) {
  return (
    <div
      className={`mx-auto w-full max-w-[380px] rounded-[28px] border-2 border-dashed border-white bg-white px-5 py-4 ${className}`}
      style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}
    >
      {children}
    </div>
  );
}

interface TicketFlowButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingText?: string;
}

export function TicketFlowButton({
  children,
  loading,
  loadingText = 'Processing...',
  className = '',
  disabled,
  type = 'button',
  ...props
}: TicketFlowButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`${ticketFlowButtonClassName} ${className}`}
      style={{ backgroundColor: TICKET_BUTTON_BLUE }}
      {...props}
    >
      {loading ? (
        <>
          <Loader className="h-4 w-4 animate-spin" />
          {loadingText}
        </>
      ) : (
        children
      )}
    </button>
  );
}

interface TicketFlowLinkButtonProps {
  href: string;
  children: ReactNode;
  className?: string;
}

export function TicketFlowLinkButton({
  href,
  children,
  className = '',
}: TicketFlowLinkButtonProps) {
  return (
    <Link
      href={href}
      className={`${ticketFlowButtonClassName} ${className}`}
      style={{ backgroundColor: TICKET_BUTTON_BLUE }}
    >
      {children}
    </Link>
  );
}

interface TicketFlowFieldProps {
  label: string;
  required?: boolean;
  hint?: string;
  children: ReactNode;
}

export function TicketFlowField({
  label,
  required,
  hint,
  children,
}: TicketFlowFieldProps) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-gray-500">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      {children}
      {hint && <p className="mt-1 text-[11px] text-gray-400">{hint}</p>}
    </div>
  );
}

export const ticketFlowInputClassName =
  'w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-black outline-none focus:border-[#2763eb] focus:ring-1 focus:ring-[#2763eb]';

export function formatTicketEventDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatTicketEventTime(time: string): string {
  return new Date(time).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}
