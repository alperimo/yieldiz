import React from 'react';
import { useNavigate } from 'react-router-dom';
import { VaultList } from '../components/vaults/VaultList';
import { VaultFilters } from '../components/vaults/VaultFilters';
import { useVaults } from '../hooks/useVaults';
import { useVaultFilters } from '../hooks/useVaultFilters';
import { STRINGS } from '../lib/constants';

const Vaults = () => {
  const navigate = useNavigate();
  const { data: vaults, loading, error, refetch } = useVaults();
  const {
    filteredVaults,
    searchQuery, setSearchQuery,
    sortBy, setSortBy,
    riskFilter, setRiskFilter,
  } = useVaultFilters(vaults);

  const handleDeposit = (vault) => {
    navigate(`/app?vault=${vault.pubkey}`);
  };

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-8 lg:px-8 space-y-6">
      <div className="rounded-[34px] border border-black/[0.08] bg-white/[0.82] p-8 shadow-[0_24px_70px_rgba(8,17,31,0.06)]">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sg-text-secondary">Choose a destination</p>
        <h1 className="mt-3 font-display text-[42px] font-semibold leading-[1.02] tracking-[-0.03em] text-sg-text">
          {STRINGS.VAULTS_TITLE}
        </h1>
        <p className="mt-4 max-w-[56ch] text-base leading-8 text-sg-text-secondary">
          Review live APY, TVL, and risk profile before you decide where fresh capital should land.
        </p>
      </div>

      <VaultFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        onSortChange={setSortBy}
        riskFilter={riskFilter}
        onRiskFilterChange={setRiskFilter}
      />

      <VaultList
        vaults={filteredVaults}
        loading={loading}
        error={error}
        onDeposit={handleDeposit}
        onRetry={refetch}
      />
    </div>
  );
};

export default Vaults;
