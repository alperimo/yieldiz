import React, { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, Search, SlidersHorizontal } from 'lucide-react';
import { STRINGS } from '../../lib/constants';

const FilterSelect = ({ value, options, onChange, ariaLabel, className = '' }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selected = options.find((option) => option.value === value) || options[0];

  useEffect(() => {
    const handleClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) setOpen(false);
    };
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  useEffect(() => {
    const handleKey = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    if (open) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open]);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((next) => !next)}
        className="inline-flex h-12 min-w-[112px] items-center justify-between gap-3 rounded-input border border-black/[0.08] bg-white/[0.88] px-4 text-body font-medium text-sg-text shadow-[0_14px_30px_rgba(126,77,34,0.04)] transition-colors hover:border-sg-accent-purple/50 focus:outline-none focus:border-sg-accent-purple"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="truncate">{selected.label}</span>
        <ChevronDown size={16} className={`shrink-0 text-sg-text-tertiary transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open ? (
        <ul
          role="listbox"
          aria-label={ariaLabel}
          className="absolute right-0 top-full z-50 mt-2 min-w-full rounded-[22px] border border-black/[0.08] bg-white/[0.98] p-1 shadow-[0_24px_60px_rgba(126,77,34,0.14)] animate-in"
        >
          {options.map((option) => (
            <li key={option.value}>
              <button
                type="button"
                role="option"
                aria-selected={option.value === value}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-[18px] px-3 py-2.5 text-left text-body transition-colors ${
                  option.value === value
                    ? 'bg-[#F8E6B6]/55 text-[#2A1A0B]'
                    : 'text-sg-text hover:bg-black/[0.035]'
                }`}
              >
                <span className="min-w-0 flex-1 truncate">{option.label}</span>
                {option.value === value ? <Check size={15} className="shrink-0 text-[#7E4D22]" /> : null}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
};

export const VaultFilters = ({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  riskFilter,
  onRiskFilterChange,
}) => {
  const sortOptions = [
    { value: 'apy', label: STRINGS.VAULTS_SORT_APY },
    { value: 'tvl', label: STRINGS.VAULTS_SORT_TVL },
  ];
  const riskOptions = [
    { value: 'all', label: STRINGS.VAULTS_RISK_ALL },
    { value: 'low', label: STRINGS.RISK_LOW },
    { value: 'medium', label: STRINGS.RISK_MEDIUM },
    { value: 'high', label: STRINGS.RISK_HIGH },
  ];

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
          className="w-full rounded-input border border-black/[0.08] bg-white/[0.88] pl-9 pr-4 py-3 text-body text-sg-text placeholder:text-sg-text-tertiary shadow-[0_14px_30px_rgba(126,77,34,0.04)] transition-colors focus:outline-none focus:border-sg-accent-purple"
        />
      </div>

      {/* Sort */}
      <div className="flex items-center gap-2">
        <SlidersHorizontal size={16} className="text-sg-text-tertiary shrink-0" />
        <FilterSelect
          value={sortBy}
          options={sortOptions}
          onChange={onSortChange}
          ariaLabel="Sort vaults"
        />
      </div>

      {/* Risk filter */}
      <FilterSelect
        value={riskFilter}
        options={riskOptions}
        onChange={onRiskFilterChange}
        ariaLabel="Filter vaults by risk"
        className="sm:min-w-[142px]"
      />
    </div>
  );
};
