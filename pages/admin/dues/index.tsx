import { useEffect, useMemo, useState } from 'react';
import { NextApiRequest } from 'next';
import { WalletCards } from 'lucide-react';
import { UserAuth } from '@/types';
import { requireAdminAuth } from '@/utils/auth';
import DashboardLayout from '@/components/dashboard/layout/dashboard-layout';
import DashboardPageHeader from '@/components/dashboard/layout/dashboard-page-header';
import {
  FEE_TOTAL_REQUIRED,
  type FeePayment,
  formatFeeAmount,
  getAllFeePaymentsForAdmin,
  isAuditEligible,
  totalPaidForMatric,
} from '@/utils/fees';

interface AdminDuesPageProps {
  userData: UserAuth;
}

const AdminDuesPage = ({ userData }: AdminDuesPageProps) => {
  const [payments, setPayments] = useState<FeePayment[]>([]);

  useEffect(() => {
    setPayments(getAllFeePaymentsForAdmin());
  }, []);

  const rows = useMemo(() => {
    return payments.map((payment) => {
      const total = totalPaidForMatric(payment.matricNumber, payments);
      const eligible = isAuditEligible(payment.matricNumber, payments);
      return { payment, total, eligible };
    });
  }, [payments]);

  const eligibleCount = useMemo(() => {
    const seen = new Set<string>();
    let count = 0;
    for (const { payment, eligible } of rows) {
      const key = payment.matricNumber.toUpperCase();
      if (seen.has(key)) continue;
      seen.add(key);
      if (eligible) count += 1;
    }
    return count;
  }, [rows]);

  return (
    <DashboardLayout title="Semester Dues" token={userData.token}>
      <div className="w-full min-w-0">
        <DashboardPageHeader
          title="Semester"
          subtitle="Dues"
          description={`Track D50 / D400 payments. Audit form only if a student has paid ${formatFeeAmount(FEE_TOTAL_REQUIRED)} total before graduation.`}
        />

        <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Payments</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{payments.length}</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Audit eligible
            </p>
            <p className="mt-1 text-2xl font-bold text-emerald-600">{eligibleCount}</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Required total
            </p>
            <p className="mt-1 text-2xl font-bold text-gray-900">
              {formatFeeAmount(FEE_TOTAL_REQUIRED)}
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
          {rows.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <WalletCards className="mb-3 h-10 w-10 text-gray-300" />
              <p className="text-lg font-semibold text-gray-900">No fee payments yet</p>
              <p className="mt-1 max-w-sm text-sm text-gray-500">
                Student submissions from the public Fees page will appear here on this device.
              </p>
            </div>
          ) : (
            <>
              {/* Mobile cards */}
              <ul className="divide-y divide-gray-100 md:hidden">
                {rows.map(({ payment, total, eligible }) => (
                  <li key={payment.id} className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900">{payment.fullName}</p>
                        <p className="mt-0.5 text-sm text-gray-600">{payment.matricNumber}</p>
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                          eligible
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {eligible ? 'Eligible' : 'Not eligible'}
                      </span>
                    </div>
                    <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
                      <div>
                        <dt className="text-xs text-gray-500">Amount</dt>
                        <dd className="font-semibold text-gray-900">
                          {formatFeeAmount(payment.amount)}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs text-gray-500">Total paid</dt>
                        <dd className="font-semibold text-gray-900">{formatFeeAmount(total)}</dd>
                      </div>
                      <div className="col-span-2">
                        <dt className="text-xs text-gray-500">Email</dt>
                        <dd className="break-all text-gray-700">{payment.email}</dd>
                      </div>
                      <div>
                        <dt className="text-xs text-gray-500">Phone</dt>
                        <dd className="text-gray-700">{payment.phone}</dd>
                      </div>
                      <div>
                        <dt className="text-xs text-gray-500">Date</dt>
                        <dd className="text-gray-700">
                          {new Date(payment.createdAt).toLocaleDateString()}
                        </dd>
                      </div>
                    </dl>
                  </li>
                ))}
              </ul>

              {/* Desktop table */}
              <div className="hidden overflow-x-auto md:block">
                <table className="min-w-full text-left text-sm">
                  <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Name</th>
                      <th className="px-4 py-3 font-semibold">Matric</th>
                      <th className="px-4 py-3 font-semibold">Email</th>
                      <th className="px-4 py-3 font-semibold">Phone</th>
                      <th className="px-4 py-3 font-semibold">Amount</th>
                      <th className="px-4 py-3 font-semibold">Total paid</th>
                      <th className="px-4 py-3 font-semibold">Date</th>
                      <th className="px-4 py-3 font-semibold">Audit form</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {rows.map(({ payment, total, eligible }) => (
                      <tr key={payment.id} className="hover:bg-gray-50/80">
                        <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900">
                          {payment.fullName}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-gray-700">
                          {payment.matricNumber}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-gray-700">
                          {payment.email}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-gray-700">
                          {payment.phone}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 font-semibold text-gray-900">
                          {formatFeeAmount(payment.amount)}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-gray-700">
                          {formatFeeAmount(total)}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-gray-600">
                          {new Date(payment.createdAt).toLocaleDateString()}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                              eligible
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-amber-50 text-amber-700'
                            }`}
                          >
                            {eligible ? 'Eligible' : 'Not eligible'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        <p className="mt-4 text-xs text-gray-500">
          Demo data includes sample students. Live submissions from /fees are stored in this
          browser only until a backend is connected.
        </p>
      </div>
    </DashboardLayout>
  );
};

export default AdminDuesPage;

export const getServerSideProps = async ({ req }: { req: NextApiRequest }) => {
  return requireAdminAuth(req);
};
