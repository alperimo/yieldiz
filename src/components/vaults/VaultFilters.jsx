import React from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { STRINGS } from '../../lib/constants';

const RISK_CHIPS = [
  { value: 'all', label: STRINGS.VAULTS_RISK_ALL },
  { value: 'low', label: STRINGS.RISK_LOW },
  { value: 'medium', label: STRINGS.RISK_MEDIUM },
  { value: 'high', label: STRINGS.RISK_HIGH },
];

export const VaultFilters = ({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  riskFilter,
  onRiskFilterChange,
}) => {
  return (
    <div className="rounded-[28px] border border-black/[0.08] bg-white/[0.88] p-4 shadow-[0_20px_50px_rgba(8,17,31,0.04)] backdrop-blur">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7C8898]" />
          <input
            type="text"
            placeholder={STRINGS.VAULTS_SEARCH_PLACEHOLDER}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-full border border-black/[0.08] bg-white px-11 py-3 text-[14px] text-[#08111F] placeholder:text-[#7C8898] shadow-[0_10px_24px_rgba(8,17,31,0.04)] transition-colors focus:border-[#9945FF]/40 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 md:shrink-0">
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              aria-label="Sort vaults"
              className="cursor-pointer appearance-none rounded-full border border-black/[0.08] bg-white py-3 pl-4 pr-10 text-[13px] font-medium text-[#08111F] shadow-[0_10px_24px_rgba(8,17,31,0.04)] transition-colors focus:border-[#9945FF]/40 focus:outline-none"
            >
              <option value="apy">Sort · {STRINGS.VAULTS_SORT_APY}</option>
              <option value="tvl">Sort · {STRINGS.VAULTS_SORT_TVL}</option>
            </select>
            <ChevronDown
              size={14}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#7C8898]"
            />
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-black/[0.06] pt-3">
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#7C8898]">Risk</span>
        {RISK_CHIPS.map((chip) => {
          const active = chip.value === riskFilter;
          return (
            <button
              key={chip.value}
              type="button"
              onClick={() => onRiskFilterChange(chip.value)}
              aria-pressed={active}
              className={`rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition-all ${
                active
                  ? 'bg-[#08111F] text-white shadow-[0_10px_24px_rgba(8,17,31,0.18)]'
                  : 'border border-black/[0.08] bg-white text-[#526071] hover:border-[#9945FF]/30 hover:text-[#08111F]'
              }`}
            >
              {chip.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
