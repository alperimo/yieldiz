import React from 'react';
import { Gift, Target, Zap } from 'lucide-react';

export const BenefitCampaignCard = ({ campaign, connected, amount }) => {
  if (!campaign) return null;

  const actionReady = connected && Number(amount || 0) > 0;

  return (
    <div className="rounded-[24px] border border-[#D6A84F]/25 bg-[#F8E6B6]/35 p-4 shadow-[0_16px_35px_rgba(126,77,34,0.04)]">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/80 text-[#7E4D22]">
          <Gift size={17} />
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-sg-text">{campaign.name} active</p>
            <span className="rounded-full bg-white/75 px-2 py-0.5 text-[11px] font-medium text-sg-text-secondary">
              ${campaign.totalPerceivedValue.toLocaleString()} value pool
            </span>
          </div>
          <p className="mt-1 text-xs leading-5 text-sg-text-secondary">{campaign.value}</p>
        </div>
      </div>

      <div className="mt-3 grid gap-2 text-xs leading-5 text-sg-text-secondary">
        <p className="flex gap-2 rounded-2xl bg-white/65 px-3 py-2">
          <Target size={13} className="mt-1 shrink-0 text-[#7E4D22]" />
          <span><strong className="text-sg-text">Audience:</strong> {campaign.audience}</span>
        </p>
        <p className="flex gap-2 rounded-2xl bg-white/65 px-3 py-2">
          <Zap size={13} className="mt-1 shrink-0 text-[#7E4D22]" />
          <span><strong className="text-sg-text">Action:</strong> {campaign.action}</span>
        </p>
      </div>

      <p className="mt-3 text-xs leading-5 text-sg-text-tertiary">
        {actionReady
          ? `${campaign.incentive} This route will keep campaign metadata in the deposit record.`
          : `${campaign.incentive} Connect and enter an amount to qualify this route.`}
      </p>
    </div>
  );
};
