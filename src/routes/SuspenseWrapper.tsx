import React, { Suspense } from 'react';

export const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<div className="flex items-center justify-center h-48"><p className="text-xl font-semibold text-gray-500">Loading...</p></div>}>
    {children}
  </Suspense>
);
