import { EventProps } from '@/types/interfaces/event';
import { TicketTier } from '@/types/interfaces/event';
import {
  formatTicketEventDate,
  formatTicketEventTime,
} from '@/components/tickets/ticket-flow-shell';

interface TicketEventSummaryProps {
  event: Pick<EventProps, 'title' | 'date' | 'time' | 'location' | 'imageUrl'>;
  tier?: TicketTier;
  compact?: boolean;
}

export function TicketEventSummary({
  event,
  tier,
  compact = false,
}: TicketEventSummaryProps) {
  return (
    <>
      <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-sky-300 via-violet-300 to-orange-300">
        {event.imageUrl ? (
          <img
            src={event.imageUrl}
            alt={event.title}
            className={`w-full object-cover ${compact ? 'h-[100px]' : 'h-[120px]'}`}
          />
        ) : (
          <div
            className={`flex items-center justify-center px-4 text-center text-xs font-medium text-white ${
              compact ? 'h-[100px]' : 'h-[120px]'
            }`}
          >
            ITCA Hub Event
          </div>
        )}
      </div>

      <h2
        className={`text-center font-bold leading-tight text-black line-clamp-2 ${
          compact ? 'mt-3 text-base' : 'mt-4 text-lg'
        }`}
      >
        {event.title}
      </h2>

      <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2">
        <div>
          <p className="text-[10px] text-gray-400">Date</p>
          <p className="text-[13px] font-bold text-black">
            {formatTicketEventDate(event.date)}
          </p>
        </div>
        <div>
          <p className="text-[10px] text-gray-400">Time</p>
          <p className="text-[13px] font-bold text-black">
            {formatTicketEventTime(event.time)}
          </p>
        </div>
        <div className="col-span-2">
          <p className="text-[10px] text-gray-400">Location</p>
          <p className="text-[13px] font-bold text-black line-clamp-2">
            {event.location}
          </p>
        </div>
      </div>

      {tier && (
        <div
          className="mt-4 rounded-2xl px-4 py-3"
          style={{ backgroundColor: '#eef4ff' }}
        >
          <p className="text-[10px] text-gray-400">Selected tier</p>
          <p className="text-base font-bold text-black">{tier.label}</p>
          <p className="text-xl font-bold" style={{ color: '#2763eb' }}>
            D{tier.price}
          </p>
          {tier.benefits && (
            <p className="mt-1 text-xs text-gray-600">{tier.benefits}</p>
          )}
        </div>
      )}
    </>
  );
}
