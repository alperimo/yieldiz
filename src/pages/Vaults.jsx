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
    navigate(`/?vault=${vault.pubkey}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-h1 text-sg-text mb-2">{STRINGS.VAULTS_TITLE}</h1>
        <p className="text-body text-sg-text-secondary">
          {STRINGS.VAULTS_POWERED_BY} • {STRINGS.VAULTS_DATA_BY}
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
