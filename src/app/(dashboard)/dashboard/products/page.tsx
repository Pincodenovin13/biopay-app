'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ProductManagementView, ProductItem } from '../../../../components/dashboard/ProductManagementView';

const INITIAL_PRODUCTS: ProductItem[] = [
  {
    id: 'prod_1',
    title: 'کت تک لینن اورسایز بهاره مدل صبا',
    description: 'پارچه ۱۰۰٪ لینن طبیعی سنگ‌شور شده، بسیار سبک و خنک با تنخور آزاد',
    price: 780000,
    compareAtPrice: 950000,
    stock: 14,
    category: 'کت و مانتو',
    salesCount: 42,
    imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&auto=format&fit=crop&q=80',
    isActive: true,
  },
  {
    id: 'prod_2',
    title: 'شومیز کرپ ژاکارد مجلسی',
    description: 'یقه کراواتی مدرن، آستین مچ‌دار، مناسب مهمانی و دورهمی بهاره',
    price: 520000,
    compareAtPrice: 640000,
    stock: 8,
    category: 'شومیز و بلوز',
    salesCount: 29,
    imageUrl: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&auto=format&fit=crop&q=80',
    isActive: true,
  },
  {
    id: 'prod_3',
    title: 'شلوار واید بگ تابستانه',
    description: 'کمر کشی کشسانی بالا با دوخت دوبل، پارچه نرم و بادوام',
    price: 440000,
    stock: 22,
    category: 'شلوار',
    salesCount: 35,
    imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&auto=format&fit=crop&q=80',
    isActive: true,
  },
  {
    id: 'prod_4',
    title: 'دورس کتان پنبه سبک بهاره',
    description: 'طرح مینیمال گلدوزی، یقه گرد کشبافت مناسب استایل کژوال',
    price: 610000,
    compareAtPrice: 750000,
    stock: 5,
    category: 'دورس و سویشرت',
    salesCount: 18,
    imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&auto=format&fit=crop&q=80',
    isActive: true,
  },
];

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductItem[]>(INITIAL_PRODUCTS);
  const [plan] = useState<'STARTER' | 'PRO'>('PRO');

  const handleAddProduct = (prod: Omit<ProductItem, 'id' | 'salesCount'>) => {
    const newProduct: ProductItem = {
      ...prod,
      id: `prod_${Date.now()}`,
      salesCount: 0,
    };
    setProducts((prev) => [newProduct, ...prev]);
  };

  const handleUpdateProduct = (updated: ProductItem) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const handleDeleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <ProductManagementView
        products={products}
        onAddProduct={handleAddProduct}
        onUpdateProduct={handleUpdateProduct}
        onDeleteProduct={handleDeleteProduct}
        onUpgradePlan={() => {
          if (typeof window !== 'undefined') window.location.href = '/dashboard/plan';
        }}
        plan={plan}
      />
    </motion.div>
  );
}
