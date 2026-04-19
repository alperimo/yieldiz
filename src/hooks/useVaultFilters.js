import { useState, useMemo } from 'react';

export function useVaultFilters(vaults) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('apy');
  const [riskFilter, setRiskFilter] = useState('all');

  const filteredVaults = useMemo(() => {
    if (!vaults) return null;
    let result = [...vaults];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (v) => v.name.toLowerCase().includes(q) || v.token.toLowerCase().includes(q)
      );
    }

    if (riskFilter !== 'all') {
      result = result.filter((v) => v.riskLevel === riskFilter);
    }

    result.sort((a, b) => {
      if (sortBy === 'apy') return b.apy - a.apy;
      if (sortBy === 'tvl') return b.tvl - a.tvl;
      return 0;
    });

    return result;
  }, [vaults, searchQuery, sortBy, riskFilter]);

  return {
    filteredVaults,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    riskFilter,
    setRiskFilter,
  };
}
