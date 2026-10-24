'use client';

import React from 'react';
import { motion } from 'motion/react';
import { WithdrawalsView } from '../../../../components/dashboard/WithdrawalsView';

export default function WithdrawalsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <WithdrawalsView />
    </motion.div>
  );
}
