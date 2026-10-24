import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Image as ImageIcon,
  ExternalLink,
  Crown,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  X,
} from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { compressImageToWebp } from '../../modules/uploads/upload.service';

export interface ProductItem {
  id: string;
  title: string;
  description?: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  category: string;
  salesCount: number;
  imageUrl?: string;
  images?: string[];
  isActive: boolean;
}

interface ProductManagementViewProps {
  products: ProductItem[];
  onAddProduct: (prod: Omit<ProductItem, 'id' | 'salesCount'>) => void;
  onUpdateProduct: (prod: ProductItem) => void;
  onDeleteProduct: (id: string) => void;
  onUpgradePlan: () => void;
  plan: 'STARTER' | 'PRO';
  isPlanExpired?: boolean;
}

export function ProductManagementView({
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onUpgradePlan,
  plan,
  isPlanExpired = false,
}: ProductManagementViewProps) {
  const { t, formatPrice } = useI18n();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modals state
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);

  // Form state
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formCompareAt, setFormCompareAt] = useState('');
  const [formStock, setFormStock] = useState('20');
  const [formCategory, setFormCategory] = useState('کت و مانتو');
  const [formImages, setFormImages] = useState<string[]>([]);
  const [formError, setFormError] = useState('');

  const maxImages = plan === 'PRO' ? 5 : 3;
  const maxProducts = plan === 'PRO' ? Infinity : 15;
  const isLimitReached = plan === 'STARTER' && products.length >= maxProducts;

  // Categories list
  const categoryOptions = [
    'کت و مانتو',
    'شومیز و بلوز',
    'شلوار',
    'دورس و سویشرت',
    'کیف و کفش',
    'اکسسوری',
  ];

  const filteredProducts = products.filter((prod) => {
    const matchesSearch = prod.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || prod.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const openAddModal = () => {
    if (isLimitReached) {
      onUpgradePlan();
      return;
    }
    setEditingProduct(null);
    setFormTitle('');
    setFormDescription('');
    setFormPrice('');
    setFormCompareAt('');
    setFormStock('20');
    setFormCategory('کت و مانتو');
    setFormImages([]);
    setFormError('');
    setIsAddEditOpen(true);
  };

  const openEditModal = (prod: ProductItem) => {
    setEditingProduct(prod);
    setFormTitle(prod.title);
    setFormDescription(prod.description || '');
    setFormPrice(prod.price.toString());
    setFormCompareAt(prod.compareAtPrice ? prod.compareAtPrice.toString() : '');
    setFormStock(prod.stock.toString());
    setFormCategory(prod.category);
    setFormImages(prod.images || (prod.imageUrl ? [prod.imageUrl] : []));
    setFormError('');
    setIsAddEditOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (formImages.length + files.length > maxImages) {
      setFormError(`در پلن ${plan === 'PRO' ? 'پرو' : 'استارتر'} حداکثر ${maxImages} تصویر مجاز است.`);
      return;
    }

    try {
      const newUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.size > 2 * 1024 * 1024) {
          setFormError('حجم هر فایل نباید بیش از ۲ مگابایت باشد.');
          return;
        }
        const blob = await compressImageToWebp(file, 0.85);
        const url = URL.createObjectURL(blob);
        newUrls.push(url);
      }
      setFormImages((prev) => [...prev, ...newUrls]);
      setFormError('');
    } catch {
      setFormError('خطا در پردازش و بهینه‌سازی فایل WebP.');
    }
  };

  const removeImage = (index: number) => {
    setFormImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      setFormError('نام محصول الزامی است.');
      return;
    }

    const priceNum = parseInt(formPrice.replace(/[^\d]/g, ''), 10);
    if (isNaN(priceNum) || priceNum <= 0) {
      setFormError('قیمت محصول به تومان نامعتبر است.');
      return;
    }

    const compareNum = formCompareAt ? parseInt(formCompareAt.replace(/[^\d]/g, ''), 10) : undefined;
    const stockNum = parseInt(formStock, 10) || 0;

    if (editingProduct) {
      onUpdateProduct({
        ...editingProduct,
        title: formTitle.trim(),
        description: formDescription.trim(),
        price: priceNum,
        compareAtPrice: compareNum,
        stock: stockNum,
        category: formCategory,
        imageUrl: formImages[0] || editingProduct.imageUrl,
        images: formImages,
      });
    } else {
      onAddProduct({
        title: formTitle.trim(),
        description: formDescription.trim(),
        price: priceNum,
        compareAtPrice: compareNum,
        stock: stockNum,
        category: formCategory,
        imageUrl: formImages[0] || 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&auto=format&fit=crop&q=80',
        images: formImages.length > 0 ? formImages : ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&auto=format&fit=crop&q=80'],
        isActive: true,
      });
    }

    setIsAddEditOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deletingProductId) {
      onDeleteProduct(deletingProductId);
      setDeletingProductId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Package className="w-6 h-6 text-emerald-600" />
            <span>مدیریت محصولات و ویترین</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            افزودن، ویرایش قیمت‌ها و موجودی انبار فروشگاه شما
          </p>
        </div>

        <Button
          variant="primary"
          onClick={openAddModal}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          {t('dashboard.addProduct')}
        </Button>
      </div>

      {/* Plan limit banner / Expired banner */}
      {isPlanExpired ? (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            <div className="text-xs">
              <span className="font-bold text-rose-900 dark:text-rose-200">پلن شما منقضی شده است!</span>
              <p className="text-rose-700 dark:text-rose-300">
                فروشگاه شما در حالت فقط خواندنی قرار دارد و ثبت سفارش جدید متوقف شده است.
              </p>
            </div>
          </div>
          <Button variant="primary" size="sm" onClick={onUpgradePlan}>
            تمدید فوری اشتراک
          </Button>
        </div>
      ) : plan === 'STARTER' ? (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Crown className="w-5 h-5 text-amber-600 shrink-0" />
            <div className="text-xs text-amber-900 dark:text-amber-200">
              <span className="font-bold">محدودیت پلن استارتر: </span>
              <span>
                شما از {products.length} از ۱۵ محصول مجاز استفاده کرده‌اید. برای ثبت محصولات نامحدود و ۵ تصویر برای هر محصول، به پلن پرو ارتقا دهید.
              </span>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={onUpgradePlan} className="shrink-0">
            ارتقا به پلن Pro
          </Button>
        </div>
      ) : (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/80 flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="font-bold">پلن پرو فعال:</span>
            <span>ظرفیت محصولات نامحدود و حداکثر ۵ تصویر WebP با کیفیت بالا فعال است.</span>
          </div>
          <Badge variant="success">نامحدود</Badge>
        </div>
      )}

      {/* Filters & Search */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search */}
          <div className="w-full sm:w-72">
            <Input
              placeholder="جستجوی نام محصول..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              leftAddon={<Search className="w-4 h-4" />}
            />
          </div>

          {/* Category filter */}
          <div className="w-full sm:w-auto flex items-center gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => {
                setSelectedCategory('ALL');
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                selectedCategory === 'ALL'
                  ? 'bg-slate-900 text-white dark:bg-emerald-600'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              همه دسته‌ها ({products.length})
            </button>
            {categoryOptions.map((cat) => {
              const count = products.filter((p) => p.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-slate-900 text-white dark:bg-emerald-600'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Products Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-start">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold bg-slate-50/50 dark:bg-slate-800/40">
                <th className="py-3.5 px-4 text-start">تصویر و محصول</th>
                <th className="py-3.5 px-4 text-start">دسته‌بندی</th>
                <th className="py-3.5 px-4 text-start">قیمت</th>
                <th className="py-3.5 px-4 text-start">موجودی انبار</th>
                <th className="py-3.5 px-4 text-start">فروش</th>
                <th className="py-3.5 px-4 text-start">وضعیت</th>
                <th className="py-3.5 px-4 text-start">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    محصولی با این مشخصات یافت نشد.
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((prod) => (
                  <tr key={prod.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    {/* Image & Title */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={prod.imageUrl || 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=100&auto=format&fit=crop&q=80'}
                          alt={prod.title}
                          className="w-11 h-11 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                        />
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white line-clamp-1">
                            {prod.title}
                          </div>
                          {prod.description && (
                            <div className="text-[11px] text-slate-400 line-clamp-1 max-w-xs">
                              {prod.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4">
                      <span className="text-slate-600 dark:text-slate-400 font-medium">
                        {prod.category}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                        {formatPrice(prod.price, 'TOMAN')}
                      </div>
                      {prod.compareAtPrice && (
                        <div className="text-[11px] text-slate-400 line-through font-mono tabular-nums">
                          {formatPrice(prod.compareAtPrice, 'TOMAN')}
                        </div>
                      )}
                    </td>

                    {/* Stock */}
                    <td className="py-3 px-4">
                      <span
                        className={`font-mono font-bold tabular-nums ${
                          prod.stock <= 5 ? 'text-rose-500' : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {prod.stock} عدد
                      </span>
                    </td>

                    {/* Sales count */}
                    <td className="py-3 px-4 font-mono font-medium text-slate-500 tabular-nums">
                      {prod.salesCount || 0}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <button
                        onClick={() =>
                          onUpdateProduct({ ...prod, isActive: !prod.isActive })
                        }
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold cursor-pointer ${
                          prod.isActive
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                        }`}
                      >
                        {prod.isActive ? 'فعال در ویترین' : 'مخفی'}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => openEditModal(prod)}
                          title="ویرایش"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => setDeletingProductId(prod.id)}
                          title="حذف"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <div>
              صفحه {currentPage} از {totalPages}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                قبلی
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              >
                بعدی
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isAddEditOpen}
        onClose={() => setIsAddEditOpen(false)}
        title={editingProduct ? 'ویرایش اطلاعات محصول' : 'افزودن محصول جدید به ویترین'}
        description={`شما می‌توانید تا ${maxImages} تصویر WebP بهینه‌شده اضافه فرمایید.`}
        maxWidth="lg"
      >
        <form onSubmit={handleSubmitForm} className="space-y-4 text-start">
          {formError && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300">
              {formError}
            </div>
          )}

          <Input
            label="نام و عنوان محصول"
            placeholder="مثلاً: مانتو لینن کتی طرح بهاره"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="قیمت فروش (تومان)"
              placeholder="مثلاً: ۷۸۰۰۰۰"
              value={formPrice}
              onChange={(e) => setFormPrice(e.target.value)}
              required
            />
            <Input
              label="قیمت خط‌خورده قبل از تخفیف (اختیاری)"
              placeholder="مثلاً: ۹۵۰۰۰۰"
              value={formCompareAt}
              onChange={(e) => setFormCompareAt(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                دسته‌بندی محصول
              </label>
              <select
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              >
                {categoryOptions.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="تعداد موجودی انبار"
              type="number"
              value={formStock}
              onChange={(e) => setFormStock(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              توضیحات کوتاه و ویژگی‌های محصول
            </label>
            <textarea
              rows={3}
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              placeholder="جنس پارچه، سایزبندی و نحوه نگهداری..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Images Upload Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                تصاویر محصول (حداکثر {maxImages} تصویر · فرمت WebP تا ۲ مگابایت)
              </span>
              <span className="text-slate-400">
                {formImages.length} از {maxImages}
              </span>
            </div>

            {/* Existing previews */}
            <div className="flex flex-wrap gap-2.5">
              {formImages.map((img, idx) => (
                <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 group">
                  <img src={img} alt="preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 end-1 p-1 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}

              {formImages.length < maxImages && (
                <label className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 flex flex-col items-center justify-center text-slate-400 hover:text-emerald-500 transition-colors cursor-pointer bg-slate-50 dark:bg-slate-900">
                  <Upload className="w-5 h-5 mb-1" />
                  <span className="text-[10px] font-bold">افزودن</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
            <Button variant="outline" type="button" onClick={() => setIsAddEditOpen(false)}>
              انصراف
            </Button>
            <Button variant="primary" type="submit">
              {editingProduct ? 'ذخیره تغییرات' : 'ثبت محصول'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingProductId}
        onClose={() => setDeletingProductId(null)}
        title="حذف محصول از ویترین"
        description="آیا از حذف این محصول اطمینان دارید؟ این عمل غیرقابل بازگشت است."
        maxWidth="sm"
      >
        <div className="pt-4 flex items-center justify-end gap-2">
          <Button variant="outline" onClick={() => setDeletingProductId(null)}>
            انصراف
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            بله، حذف شود
          </Button>
        </div>
      </Modal>
    </div>
  );
}
