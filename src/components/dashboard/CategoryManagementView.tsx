import React, { useState } from 'react';
import { motion, Reorder } from 'motion/react';
import { GripVertical, Plus, Trash2, Edit2, Layers, Check, X } from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export interface CategoryItem {
  id: string;
  name: string;
  order: number;
  productCount: number;
}

const INITIAL_CATEGORIES: CategoryItem[] = [
  { id: 'cat_1', name: 'کت و مانتو', order: 1, productCount: 12 },
  { id: 'cat_2', name: 'شومیز و بلوز', order: 2, productCount: 8 },
  { id: 'cat_3', name: 'شلوار و دامن', order: 3, productCount: 19 },
  { id: 'cat_4', name: 'دورس و هودی', order: 4, productCount: 6 },
  { id: 'cat_5', name: 'اکسسوری و شال', order: 5, productCount: 14 },
];

export function CategoryManagementView() {
  const { t, formatNumber } = useI18n();
  const [categories, setCategories] = useState<CategoryItem[]>(INITIAL_CATEGORIES);
  const [isAdding, setIsAdding] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    const newCat: CategoryItem = {
      id: `cat_${Date.now()}`,
      name: newCategoryName.trim(),
      order: categories.length + 1,
      productCount: 0,
    };
    setCategories((prev) => [...prev, newCat]);
    setNewCategoryName('');
    setIsAdding(false);
  };

  const handleDeleteCategory = (id: string) => {
    if (confirm(t('common.confirmDelete'))) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const handleStartEdit = (cat: CategoryItem) => {
    setEditingId(cat.id);
    setEditingName(cat.name);
  };

  const handleSaveEdit = (id: string) => {
    if (!editingName.trim()) return;
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, name: editingName.trim() } : c))
    );
    setEditingId(null);
  };

  return (
    <div className="space-y-6 text-start max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {t('categories.title')}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {t('categories.subtitle')}
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsAdding(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          {t('categories.addCategory')}
        </Button>
      </div>

      {/* Add Category Card */}
      {isAdding && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800/60"
        >
          <form onSubmit={handleAddCategory} className="flex items-center gap-3">
            <Input
              placeholder={t('categories.categoryName')}
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              autoFocus
              className="bg-white dark:bg-slate-900"
            />
            <Button type="submit" variant="primary" size="sm">
              {t('common.save')}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsAdding(false)}
            >
              {t('common.cancel')}
            </Button>
          </form>
        </motion.div>
      )}

      {/* Reorderable Categories List via Framer Motion */}
      <Card className="p-4 overflow-hidden">
        <div className="text-xs text-slate-400 pb-3 ps-2 flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800">
          <Layers className="w-3.5 h-3.5" />
          <span>{t('categories.dragHint')}</span>
        </div>

        <Reorder.Group
          axis="y"
          values={categories}
          onReorder={setCategories}
          className="divide-y divide-slate-100 dark:divide-slate-800"
        >
          {categories.map((cat, index) => (
            <Reorder.Item
              key={cat.id}
              value={cat}
              className="py-3 px-2 flex items-center justify-between hover:bg-slate-50/70 dark:hover:bg-slate-800/40 rounded-lg transition-colors cursor-grab active:cursor-grabbing select-none"
            >
              <div className="flex items-center gap-3">
                <GripVertical className="w-4 h-4 text-slate-400 hover:text-slate-600" />
                <span className="w-6 h-6 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[11px] font-mono font-bold text-slate-500">
                  {formatNumber(index + 1)}
                </span>
                {editingId === cat.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="px-2 py-1 text-xs border rounded-md bg-white dark:bg-slate-900 border-emerald-500"
                      autoFocus
                    />
                    <button
                      onClick={() => handleSaveEdit(cat.id)}
                      className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="p-1 text-slate-400 hover:bg-slate-100 rounded"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div>
                    <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                      {cat.name}
                    </span>
                    <span className="text-[11px] text-slate-400 ms-3 font-mono">
                      ({formatNumber(cat.productCount)} محصول)
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleStartEdit(cat)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md transition-colors"
                  title={t('common.edit')}
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDeleteCategory(cat.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md transition-colors"
                  title={t('common.delete')}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      </Card>
    </div>
  );
}
