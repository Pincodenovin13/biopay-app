import React, { useState } from 'react';
import { Upload, X, Check, Image as ImageIcon } from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

export interface NewProductData {
  title: string;
  price: number;
  stock: number;
  category: string;
  imageUrl?: string;
}

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: NewProductData) => void;
}

export function AddProductModal({ isOpen, onClose, onSave }: AddProductModalProps) {
  const { t } = useI18n();
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('25');
  const [category, setCategory] = useState('پوشاک و مد');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');

  const handleImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('لطفاً یک فایل تصویری معتبر انتخاب فرمایید.');
      return;
    }
    setError('');
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('نام محصول الزامی است.');
      return;
    }
    const numPrice = parseInt(price.replace(/[^\d]/g, ''), 10);
    if (isNaN(numPrice) || numPrice <= 0) {
      setError('قیمت معتبر به تومان وارد نمایید.');
      return;
    }

    onSave({
      title: title.trim(),
      price: numPrice,
      stock: parseInt(stock, 10) || 10,
      category,
      imageUrl: imagePreview || undefined,
    });

    // Reset and close
    setTitle('');
    setPrice('');
    setImagePreview(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('dashboard.addProduct')}
      description="مشخصات محصول جدید جهت نمایش در ویترین فروشگاه بیو را وارد فرمایید."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-start">
        {error && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 rounded-lg text-xs text-rose-600 font-medium">
            {error}
          </div>
        )}

        <Input
          label={t('dashboard.productName')}
          placeholder="مثلاً: مانتو لینن بهاره مدل ناتالی"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label={t('dashboard.productPrice')}
            placeholder="مثلاً: ۶۸۰,۰۰۰"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
          <Input
            label={t('dashboard.productStock')}
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />
        </div>

        {/* Drag & Drop Image Area */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            {t('dashboard.productImage')} (WebP فشرده خودکار)
          </label>
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              const file = e.dataTransfer.files?.[0];
              if (file) handleImageFile(file);
            }}
            className={`border-2 border-dashed rounded-xl p-4 text-center transition-colors cursor-pointer ${
              isDragging
                ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20'
                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
            }`}
          >
            {imagePreview ? (
              <div className="relative inline-block">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-24 h-24 object-cover rounded-lg border border-slate-200 dark:border-slate-700 mx-auto"
                />
                <button
                  type="button"
                  onClick={() => setImagePreview(null)}
                  className="absolute -top-2 -end-2 bg-rose-600 text-white rounded-full p-1 shadow-md hover:bg-rose-700"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <div className="space-y-2 py-2">
                <Upload className="w-7 h-7 text-slate-400 mx-auto" />
                <div className="text-xs text-slate-600 dark:text-slate-400">
                  تصویر را اینجا رها کنید یا{' '}
                  <label className="text-emerald-600 font-bold hover:underline cursor-pointer">
                    انتخاب از گالری
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageFile(file);
                      }}
                    />
                  </label>
                </div>
                <div className="text-[11px] text-slate-400">حداکثر ۲ مگابایت (JPEG, PNG, WebP)</div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button type="button" variant="ghost" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" variant="primary">
            ثبت و انتشار در ویترین
          </Button>
        </div>
      </form>
    </Modal>
  );
}
