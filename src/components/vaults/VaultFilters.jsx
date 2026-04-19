import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { STRINGS } from '../../lib/constants';

export const VaultFilters = ({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  riskFilter,
  onRiskFilterChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
      {/* Search */}
      <div className="relative flex-1">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-sg-text-tertiary" />
        <input
          type="text"
          placeholder={STRINGS.VAULTS_SEARCH_PLACEHOLDER}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-sg-bg-elevated border border-sg-border rounded-input pl-9 pr-4 py-2.5 text-body text-sg-text placeholder:text-sg-text-tertiary focus:outline-none focus:border-sg-accent-purple transition-colors"
        />
      </div>

      {/* Sort */}
      <div className="flex items-center gap-2">
        <SlidersHorizontal size={16} className="text-sg-text-tertiary shrink-0" />
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="bg-sg-bg-elevated border border-sg-border rounded-input px-3 py-2.5 text-body text-sg-text focus:outline-none focus:border-sg-accent-purple appearance-none cursor-pointer"
        >
          <option value="apy">{STRINGS.VAULTS_SORT_APY}</option>
          <option value="tvl">{STRINGS.VAULTS_SORT_TVL}</option>
        </select>
      </div>

      {/* Risk filter */}
      <select
        value={riskFilter}
        onChange={(e) => onRiskFilterChange(e.target.value)}
        className="bg-sg-bg-elevated border border-sg-border rounded-input px-3 py-2.5 text-body text-sg-text focus:outline-none focus:border-sg-accent-purple appearance-none cursor-pointer"
      >
        <option value="all">{STRINGS.VAULTS_RISK_ALL}</option>
        <option value="low">{STRINGS.RISK_LOW}</option>
        <option value="medium">{STRINGS.RISK_MEDIUM}</option>
        <option value="high">{STRINGS.RISK_HIGH}</option>
      </select>
    </div>
  );
};
