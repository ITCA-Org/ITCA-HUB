export type FeeAmount = 50 | 400;

export const FEE_TOTAL_REQUIRED = 400;

export const formatFeeAmount = (amount: number) =>
  `D${amount.toLocaleString('en-GM')}`;

export const getFeeBalanceRemaining = (
  totalPaid: number,
  required: number = FEE_TOTAL_REQUIRED
) => Math.max(0, required - totalPaid);

export const formatFeeProgress = (
  totalPaid: number,
  required: number = FEE_TOTAL_REQUIRED,
  balanceRemaining?: number
) => {
  const balance =
    balanceRemaining ?? getFeeBalanceRemaining(totalPaid, required);
  if (balance <= 0) {
    return `Full fee met (${formatFeeAmount(required)}) — Audit eligible`;
  }
  return `Total paid ${formatFeeAmount(totalPaid)} of ${formatFeeAmount(required)} — Balance remaining: ${formatFeeAmount(balance)}`;
};
