export type FeeAmount = 50 | 400;

export const FEE_TOTAL_REQUIRED = 400;

export const formatFeeAmount = (amount: number) =>
  `D${amount.toLocaleString('en-GM')}`;
