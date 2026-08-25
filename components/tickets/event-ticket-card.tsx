import { useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';
import { Download, CheckCircle2 } from 'lucide-react';
import { EventProps } from '@/types/interfaces/event';
import { TicketProps } from '@/types/interfaces/ticket';

import { TICKET_BLUE, TICKET_BUTTON_BLUE, ticketFlowButtonClassName } from '@/components/tickets/ticket-flow-shell';

export { TICKET_BLUE };

interface EventTicketCardProps {
  ticket: TicketProps;
  event: Pick<EventProps, 'title' | 'date' | 'time' | 'location' | 'imageUrl'>;
  downloadUrl?: string;
  printableId?: string;
}

function formatEventDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatEventTime(time: string): string {
  return new Date(time).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}


function TicketNotchDivider() {
  return (
    <div className="relative -mx-5 my-4">
      <div
        className="border-t-2 border-dashed"
        style={{ borderColor: `${TICKET_BLUE}99` }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full print:hidden"
        style={{ backgroundColor: TICKET_BLUE }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-1/2 h-6 w-6 translate-x-1/2 -translate-y-1/2 rounded-full print:hidden"
        style={{ backgroundColor: TICKET_BLUE }}
      />
    </div>
  );
}

export function EventTicketCard({
  ticket,
  event,
  downloadUrl,
  printableId = 'printable-ticket',
}: EventTicketCardProps) {
  const barcodeRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!barcodeRef.current || !ticket.ticketNumber) return;

    JsBarcode(barcodeRef.current, ticket.ticketNumber, {
      format: 'CODE128',
      displayValue: false,
      margin: 0,
      height: 88,
      width: 2.4,
      lineColor: '#000000',
    });
  }, [ticket.ticketNumber]);

  return (
    <div className="mx-auto flex h-full w-full max-w-[380px] flex-col">
      <div
        id={printableId}
        className="flex flex-1 flex-col rounded-[28px] border-2 border-dashed border-white bg-white px-5 pt-4 pb-5 print:h-auto print:flex-none print:max-w-[380px] print:rounded-none print:border-0 print:shadow-none"
        style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}
      >
        <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-sky-300 via-violet-300 to-orange-300 print:bg-white">
          <div className="print:hidden">
            {event.imageUrl ? (
              <img
                src={event.imageUrl}
                alt={event.title}
                className="h-[150px] w-full object-cover sm:h-[165px]"
              />
            ) : (
              <div className="flex h-[150px] items-center justify-center px-4 text-center text-sm font-medium text-white sm:h-[165px]">
                ITCA Hub Event
              </div>
            )}
          </div>
          <img
            src="/itca-logo.png"
            alt="ITCA"
            className="hidden h-[150px] w-full bg-white object-contain p-8 print:block sm:h-[165px]"
          />
        </div>

        <h2 className="mt-4 text-center text-lg font-bold leading-snug text-black line-clamp-2">
          {event.title}
        </h2>

        {ticket.isCheckedIn && (
          <div className="mt-3 flex justify-center print:hidden">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Checked in
              {ticket.usedAt && (
                <span className="font-normal text-emerald-600">
                  · {new Date(ticket.usedAt).toLocaleString()}
                </span>
              )}
            </span>
          </div>
        )}

        <TicketNotchDivider />

        <div className="grid grid-cols-2 gap-x-4 gap-y-4">
          <div>
            <p className="text-xs text-gray-400">Date</p>
            <p className="mt-1 text-base font-bold leading-tight text-black">
              {formatEventDate(event.date)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Time</p>
            <p className="mt-1 text-base font-bold leading-tight text-black">
              {formatEventTime(event.time)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Location</p>
            <p className="mt-1 text-base font-bold leading-tight text-black line-clamp-2">
              {event.location}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Tier</p>
            <p className="mt-1 text-base font-bold leading-tight text-black">
              {ticket.tierLabel}
            </p>
          </div>
        </div>

        <TicketNotchDivider />

        <div className="flex flex-1 flex-col justify-end">
          <p className="mb-1 text-center font-mono text-xs tracking-wide text-gray-400 print:mb-4">
            {ticket.ticketNumber}
          </p>
          <div className="flex justify-center">
            <svg ref={barcodeRef} className="h-[88px] w-full max-w-[300px] print:mt-0" />
          </div>
        </div>
      </div>

      {downloadUrl && (
        <a
          href={downloadUrl}
          className={`mt-3 shrink-0 print:hidden ${ticketFlowButtonClassName}`}
          style={{ backgroundColor: TICKET_BUTTON_BLUE }}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black/25">
            <Download className="h-4 w-4" />
          </span>
          Download PDF Ticket
        </a>
      )}
    </div>
  );
}
