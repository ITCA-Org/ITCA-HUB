'use client';

import { useEffect, useState } from 'react';

const ButterflySvg = ({ className = '' }: { className?: string }) => (
  <svg
    viewBox="0 0 72 72"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden
  >
    <g className="footer-butterfly-wings origin-center">
      <rect x="28" y="26" width="5" height="5" fill="#F4AA41" stroke="none" />
      <rect x="41" y="26" width="5" height="5" fill="#F4AA41" stroke="none" />
      <path
        fill="#E27022"
        stroke="none"
        d="M32,30c-6.3454,0.2919-20,0.0758-20,15.8696S34,41,34,41"
      />
      <path
        fill="#E27022"
        stroke="none"
        d="M42,30c6.3454,0.2919,20.5808,0.0758,20.5808,15.8696S40,40,40,40"
      />
      <path
        fill="#F4AA41"
        stroke="none"
        d="M40.6391,20.5921c0,0,17.8007-14.2406,17.8007-3.5601s-6.2303,5.3402-8.0103,8.9004 s-4.4502,0.89-4.4502,0.89L42,27l-3,6"
      />
      <path
        fill="#F4AA41"
        stroke="none"
        d="M33.3609,20.5921c0,0-17.8007-14.2406-17.8007-3.5601s6.2302,5.3402,8.0103,8.9004S28,27,28,27h5l2,6"
      />
    </g>
    <ellipse cx="36.921" cy="17.9219" rx="3.5601" ry="2.6701" fill="#A57939" stroke="none" />
    <ellipse cx="36.921" cy="22.3721" rx="3.5601" ry="1.7801" fill="#6A462F" stroke="none" />
    <path
      fill="#A57939"
      stroke="none"
      d="M36.3298,24.309c-8.1753,0.759,0.6444,22.9841,0.6444,22.9841S47.2839,23.292,36.3298,24.309z"
    />
    <g fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
      <path d="M40.6391,20.5921c0,0,17.8007-14.2406,17.8007-3.5601s-6.2303,5.3402-8.0103,8.9004s-4.4502,0.89-4.4502,0.89" />
      <line x1="35.1409" x2="33.3609" y1="14.771" y2="11.5817" />
      <line x1="38.9977" x2="40.4811" y1="14.8452" y2="11.5817" />
      <path d="M33.3609,20.5921c0,0-17.8007-14.2406-17.8007-3.5601s6.2302,5.3402,8.0103,8.9004s4.4502,0.89,4.4502,0.89" />
      <ellipse cx="36.921" cy="17.9219" rx="3.5601" ry="2.6701" />
      <ellipse cx="36.921" cy="22.3721" rx="3.5601" ry="1.7801" />
      <path d="M36.3298,24.309c-8.1753,0.759,0.6444,22.9841,0.6444,22.9841S47.2839,23.292,36.3298,24.309z" />
      <path d="M28,31c-6.3454,0.2919-16-0.9242-16,14.8696s19.5808-3.9167,19.5808-3.9167" />
      <path d="M46.5808,31c6.3454,0.2919,16-0.9242,16,14.8696S43,41.9529,43,41.9529" />
    </g>
  </svg>
);

const FlyingButterfly = () => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  if (!ready) return null;

  return (
    <div
      className="footer-butterfly pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
    >
      <div className="footer-butterfly-path">
        <ButterflySvg className="h-14 w-14 sm:h-16 sm:w-16 lg:h-20 lg:w-20" />
      </div>
    </div>
  );
};

export default FlyingButterfly;
