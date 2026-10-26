import React, { useState } from 'react';
import { useI18n } from '../../lib/i18n';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { DeviceImageUploader } from '../ui/DeviceImageUploader';
import { UploadResult } from '../../modules/uploads/upload.service';

export interface NewProductData {
  title: string;
  price: number;
  stock: number;
  category: string;
  imageUrl?: string;
  savedFilePath?: string;
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
  const [savedFilePath, setSavedFilePath] = useState<string | undefined>(undefined);
  const [error, setError] = useState('');

  const handleUploadSuccess = (result: UploadResult) => {
    if (result.previewUrl) {
      setImagePreview(result.previewUrl);
    }
    setSavedFilePath(result.filePath);
    setError('');
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
      savedFilePath,
    });

    // Reset and close
    setTitle('');
    setPrice('');
    setImagePreview(null);
    setSavedFilePath(undefined);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('dashboard.addProduct')}
      description="مشخصات محصول جدید جهت نمایش در ویترین فروشگاه اینستاگرامی را وارد فرمایید."
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

        {/* Native Camera / Gallery Device Uploader with WebP compression */}
        <DeviceImageUploader
          userId="usr_seller_01"
          type="product"
          label={`${t('dashboard.productImage')} (گالری یا دوربین گوشی - WebP حداکثر ۲MB)`}
          currentImageUrl={imagePreview || undefined}
          onUploadSuccess={handleUploadSuccess}
        />

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
