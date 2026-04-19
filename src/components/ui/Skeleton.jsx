import React from 'react';

export const Skeleton = ({
  width,
  height = '1rem',
  rounded = 'rounded',
  className = '',
}) => {
  return (
    <div
      className={`skeleton-shimmer ${rounded} ${className}`}
      style={{ width, height }}
    />
  );
};

export const SkeletonCard = () => (
  <div className="bg-sg-bg-secondary border border-sg-border rounded-card p-6 space-y-4">
    <Skeleton width="60%" height="1.25rem" rounded="rounded" />
    <Skeleton width="40%" height="2rem" rounded="rounded" />
    <Skeleton width="80%" height="0.875rem" rounded="rounded" />
  </div>
);

export const SkeletonRow = () => (
  <div className="flex items-center gap-4 py-3">
    <Skeleton width="2rem" height="2rem" rounded="rounded-full" />
    <div className="flex-1 space-y-2">
      <Skeleton width="40%" height="0.875rem" rounded="rounded" />
      <Skeleton width="25%" height="0.75rem" rounded="rounded" />
    </div>
    <Skeleton width="4rem" height="0.875rem" rounded="rounded" />
  </div>
);
