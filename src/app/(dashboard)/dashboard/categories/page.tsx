'use client';

import React from 'react';
import { motion } from 'motion/react';
import { CategoryManagementView } from '../../../../components/dashboard/CategoryManagementView';

export default function CategoriesPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <CategoryManagementView />
    </motion.div>
  );
}
