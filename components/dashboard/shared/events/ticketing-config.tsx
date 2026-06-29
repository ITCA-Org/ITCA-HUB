import { TicketTier } from '@/types/interfaces/event';

interface TicketingConfigProps {
  ticketingEnabled: boolean;
  setTicketingEnabled: (value: boolean) => void;
  ticketTiers: TicketTier[];
  setTicketTiers: (tiers: TicketTier[]) => void;
}

const TicketingConfig = ({
  ticketingEnabled,
  setTicketingEnabled,
  ticketTiers,
  setTicketTiers,
}: TicketingConfigProps) => {
  const updateTier = (type: 'standard' | 'premium', updates: Partial<TicketTier>) => {
    setTicketTiers(
      ticketTiers.map((tier) =>
        tier.type === type ? { ...tier, ...updates } : tier
      )
    );
  };

  const renderTierBlock = (type: 'standard' | 'premium', showBenefits: boolean) => {
    const tier = ticketTiers.find((t) => t.type === type);
    if (!tier) return null;

    return (
      <div className="border border-gray-200 rounded-lg p-4 space-y-3">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={tier.enabled}
            onChange={(e) => updateTier(type, { enabled: e.target.checked })}
            className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
          />
          <span className="text-sm font-semibold text-gray-700 capitalize">
            Enable {type} ticket
          </span>
        </label>

        {tier.enabled && (
          <>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Label</label>
              <input
                type="text"
                value={tier.label}
                onChange={(e) => updateTier(type, { label: e.target.value })}
                className="w-full rounded-lg border border-gray-200 p-2 text-sm"
                placeholder={type === 'standard' ? 'Standard' : 'VIP / Premium'}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Price (GMD)
              </label>
              <input
                type="number"
                min="1"
                value={tier.price || ''}
                onChange={(e) =>
                  updateTier(type, { price: parseFloat(e.target.value) || 0 })
                }
                className="w-full rounded-lg border border-gray-200 p-2 text-sm"
                placeholder="e.g. 150"
              />
            </div>
            {showBenefits && (
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Benefits (shown to buyers)
                </label>
                <textarea
                  rows={2}
                  value={tier.benefits || ''}
                  onChange={(e) => updateTier(type, { benefits: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 p-2 text-sm"
                  placeholder="e.g. Front row seating, refreshments included"
                />
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <div className="mb-8 space-y-4">
      <label className="flex items-center space-x-2 cursor-pointer">
        <input
          type="checkbox"
          checked={ticketingEnabled}
          onChange={(e) => setTicketingEnabled(e.target.checked)}
          className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
        />
        <span className="text-sm font-semibold text-gray-700">
          This event requires ticketing
        </span>
      </label>

      {ticketingEnabled && (
        <div className="space-y-3 pl-1">
          <p className="text-xs text-gray-500">
            Set each tier price independently. Premium is typically priced higher.
          </p>
          {renderTierBlock('standard', false)}
          {renderTierBlock('premium', true)}
        </div>
      )}
    </div>
  );
};

export default TicketingConfig;
