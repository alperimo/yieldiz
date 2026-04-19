import React from 'react';
import { VaultCard } from './VaultCard';
import { SkeletonCard } from '../ui/Skeleton';
import { STRINGS } from '../../lib/constants';

export const VaultList = ({ vaults, loading, error, onDeposit, onRetry }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-body text-sg-error mb-4">{STRINGS.STATE_ERROR}</p>
        <button onClick={onRetry} className="text-body text-sg-accent-purple hover:underline">
          {STRINGS.STATE_RETRY}
        </button>
      </div>
    );
  }

  if (!vaults?.length) {
    return (
      <div className="text-center py-12">
        <p className="text-body text-sg-text-tertiary">{STRINGS.STATE_EMPTY_VAULTS}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {vaults.map((vault) => (
        <VaultCard key={vault.pubkey} vault={vault} onDeposit={onDeposit} />
      ))}
    </div>
  );
};
