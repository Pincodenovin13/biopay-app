'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ReferralView } from '../../../../components/dashboard/ReferralView';

export default function ReferralPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <ReferralView
        onOpenWithdrawalModal={() => {
          if (typeof window !== 'undefined') window.location.href = '/dashboard/withdrawals';
        }}
        onOpenRenewalModal={() => {
          if (typeof window !== 'undefined') window.location.href = '/dashboard/plan';
        }}
      />
    </motion.div>
  );
}
