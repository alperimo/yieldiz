import React, { Suspense, lazy } from 'react';
import { Spinner } from './Spinner';

const Spline = lazy(() => import('@splinetool/react-spline'));

export const SplineScene = ({ scene, className = '' }) => (
  <Suspense
    fallback={
      <div className="flex h-full w-full items-center justify-center">
        <Spinner size={28} />
      </div>
    }
  >
    <Spline scene={scene} className={className} />
  </Suspense>
);
