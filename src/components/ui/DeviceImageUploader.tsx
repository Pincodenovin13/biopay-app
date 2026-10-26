import React, { useRef, useState } from 'react';
import { Camera, Image as ImageIcon, Upload, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { processDeviceUpload, UploadResult, UploadTargetType } from '../../modules/uploads/upload.service';

interface DeviceImageUploaderProps {
  userId?: string;
  type: UploadTargetType;
  label?: string;
  currentImageUrl?: string;
  onUploadSuccess: (result: UploadResult) => void;
  className?: string;
}

export const DeviceImageUploader: React.FC<DeviceImageUploaderProps> = ({
  userId = 'usr_seller_01',
  type,
  label,
  currentImageUrl,
  onUploadSuccess,
  className = '',
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const galleryInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelected = async (file: File) => {
    setErrorMessage(null);
    setIsProcessing(true);

    try {
      const result = await processDeviceUpload({
        file,
        userId,
        type,
      });

      if (!result.success) {
        setErrorMessage(result.error || 'خطا در فشرده‌سازی تصویر');
      } else {
        setUploadResult(result);
        if (result.previewUrl) setPreview(result.previewUrl);
        onUploadSuccess(result);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'خطا در ارتباط با دستگاه');
    } finally {
      setIsProcessing(false);
    }
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelected(e.target.files[0]);
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
          {label}
        </label>
      )}

      {/* Hidden native inputs: one standard gallery, one with camera capture */}
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onInputChange}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={onInputChange}
      />

      {/* Preview Box */}
      <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 rounded-2xl p-4 transition-all bg-slate-50/50 dark:bg-slate-900/50">
        {preview ? (
          <div className="relative group overflow-hidden rounded-xl bg-slate-900 max-h-48 flex items-center justify-center">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-48 object-cover rounded-xl"
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => galleryInputRef.current?.click()}
                className="px-3 py-1.5 bg-white text-slate-900 rounded-lg text-xs font-semibold hover:bg-slate-100 transition"
              >
                تغییر تصویر
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Upload className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
              تصویر را از گالری انتخاب کنید یا عکس جدید بگیرید
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              تبدیل خودکار به فرمت کم‌حجم WebP با سقف ۲ مگابایت
            </p>
          </div>
        )}

        {/* Action Buttons for Mobile/Desktop */}
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            type="button"
            disabled={isProcessing}
            onClick={() => galleryInputRef.current?.click()}
            className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition active:scale-[0.98]"
          >
            <ImageIcon className="w-4 h-4 text-emerald-500" />
            انتخاب از گالری
          </button>
          <button
            type="button"
            disabled={isProcessing}
            onClick={() => cameraInputRef.current?.click()}
            className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition active:scale-[0.98]"
          >
            <Camera className="w-4 h-4 text-sky-500" />
            عکاسی با دوربین
          </button>
        </div>

        {/* Processing Indicator */}
        {isProcessing && (
          <div className="mt-3 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-300">
            <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
            <span>در حال فشرده‌سازی به WebP و تنظیم ابعاد...</span>
          </div>
        )}

        {/* Success Details Badge */}
        {uploadResult?.success && (
          <div className="mt-3 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 space-y-1">
            <div className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>تصویر فشرده و در مسیر ذخیره شد:</span>
            </div>
            <code className="block dir-ltr text-[11px] font-mono bg-emerald-100/60 dark:bg-emerald-900/40 p-1.5 rounded text-emerald-900 dark:text-emerald-200 truncate">
              {uploadResult.filePath}
            </code>
            <div className="flex justify-between text-[11px] text-emerald-700 dark:text-emerald-400 pt-1">
              <span>فرمت: WebP</span>
              <span>کاهش حجم: {uploadResult.reductionPercent}%</span>
              <span>حجم: {((uploadResult.compressedSizeBytes || 0) / 1024).toFixed(1)} KB</span>
            </div>
          </div>
        )}

        {/* Error message */}
        {errorMessage && (
          <div className="mt-3 p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 flex items-center gap-2 text-xs text-rose-700 dark:text-rose-300">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
};
