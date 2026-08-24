export type FeeAmount = 50 | 400;

export type FeePayment = {
  id: string;
  fullName: string;
  matricNumber: string;
  email: string;
  phone: string;
  amount: FeeAmount;
  createdAt: string;
};

export const FEES_STORAGE_KEY = 'itca-semester-fees';
export const FEE_TOTAL_REQUIRED = 400;

export const MOCK_FEE_PAYMENTS: FeePayment[] = [
  {
    id: 'mock-1',
    fullName: 'Awa Jallow',
    matricNumber: 'UTG/ICT/2022/014',
    email: 'awa.jallow@utg.edu.gm',
    phone: '+220 300 1001',
    amount: 400,
    createdAt: '2026-01-12T10:00:00.000Z',
  },
  {
    id: 'mock-2',
    fullName: 'Lamin Ceesay',
    matricNumber: 'UTG/ICT/2023/088',
    email: 'lamin.ceesay@utg.edu.gm',
    phone: '+220 300 1002',
    amount: 50,
    createdAt: '2026-02-03T14:20:00.000Z',
  },
  {
    id: 'mock-3',
    fullName: 'Fatou Bah',
    matricNumber: 'UTG/ICT/2021/042',
    email: 'fatou.bah@utg.edu.gm',
    phone: '+220 300 1003',
    amount: 50,
    createdAt: '2025-09-18T09:15:00.000Z',
  },
  {
    id: 'mock-4',
    fullName: 'Fatou Bah',
    matricNumber: 'UTG/ICT/2021/042',
    email: 'fatou.bah@utg.edu.gm',
    phone: '+220 300 1003',
    amount: 50,
    createdAt: '2026-02-20T11:00:00.000Z',
  },
];

const normalizeMatric = (matric: string) => matric.trim().toUpperCase();

export const readFeePayments = (): FeePayment[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(FEES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as FeePayment[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (p) =>
        typeof p?.id === 'string' &&
        typeof p?.fullName === 'string' &&
        typeof p?.matricNumber === 'string' &&
        typeof p?.email === 'string' &&
        typeof p?.phone === 'string' &&
        (p.amount === 50 || p.amount === 400) &&
        typeof p?.createdAt === 'string'
    );
  } catch {
    return [];
  }
};

export const saveFeePayment = (
  input: Omit<FeePayment, 'id' | 'createdAt'>
): FeePayment => {
  const payment: FeePayment = {
    ...input,
    matricNumber: normalizeMatric(input.matricNumber),
    email: input.email.trim().toLowerCase(),
    fullName: input.fullName.trim(),
    phone: input.phone.trim(),
    id: `fee-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
  };

  const existing = readFeePayments();
  localStorage.setItem(FEES_STORAGE_KEY, JSON.stringify([payment, ...existing]));
  return payment;
};

export const getAllFeePaymentsForAdmin = (): FeePayment[] => {
  const stored = readFeePayments();
  return [...stored, ...MOCK_FEE_PAYMENTS].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

export const totalPaidForMatric = (
  matricNumber: string,
  payments: FeePayment[] = typeof window !== 'undefined' ? getAllFeePaymentsForAdmin() : MOCK_FEE_PAYMENTS
): number => {
  const key = normalizeMatric(matricNumber);
  return payments
    .filter((p) => normalizeMatric(p.matricNumber) === key)
    .reduce((sum, p) => sum + p.amount, 0);
};

export const isAuditEligible = (
  matricNumber: string,
  payments?: FeePayment[]
): boolean => totalPaidForMatric(matricNumber, payments) >= FEE_TOTAL_REQUIRED;

export const formatFeeAmount = (amount: number) => `D${amount.toLocaleString('en-GM')}`;
