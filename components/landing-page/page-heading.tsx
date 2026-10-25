import type { ReactNode } from 'react';

export default function PageHeading({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <section className="bg-white itca-white-surface px-5 pb-4 pt-28 text-[#005080] sm:px-10 lg:px-16">
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">{title}</h1>
          <p className="mt-3 max-w-2xl text-base leading-7">{description}</p>
        </div>
        {action}
      </div>
    </section>
  );
}
