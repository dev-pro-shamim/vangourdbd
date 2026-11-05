"use client";

import React, { useState, useRef } from "react";
import {
  Upload,
  X,
  Star,
  ArrowLeft,
  ArrowRight,
  RefreshCw,
  Plus,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
  GripVertical,
} from "lucide-react";

interface MultiImageGalleryUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  folder?: "products" | "banners" | "categories" | "general";
  maxImages?: number;
}

export default function MultiImageGalleryUploader({
  images,
  onChange,
  folder = "products",
  maxImages = 20,
}: MultiImageGalleryUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [replacingIndex, setReplacingIndex] = useState<number | null>(null);

  const multiFileInputRef = useRef<HTMLInputElement>(null);
  const replaceFileInputRef = useRef<HTMLInputElement>(null);

  // Handle uploading multiple files
  const handleUploadFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    if (images.length + fileArray.length > maxImages) {
      setErrorMessage(`Maximum limit of ${maxImages} images exceeded.`);
      return;
    }

    setErrorMessage(null);
    setIsUploading(true);
    setUploadProgress(15);

    try {
      const formData = new FormData();
      for (const file of fileArray) {
        formData.append("files", file);
      }
      formData.append("folder", folder);

      setUploadProgress(40);

      const res = await fetch("/api/media", {
        method: "POST",
        body: formData,
      });

      setUploadProgress(80);
      const data = await res.json();

      if (data.success && (data.files || data.data)) {
        const uploadedList = data.files || (Array.isArray(data.data) ? data.data : [data.data]);
        const newUrls = uploadedList.map((item: any) => item.url);
        onChange([...images, ...newUrls]);
        setUploadProgress(100);
      } else {
        setErrorMessage(data.error || "Failed to upload images.");
      }
    } catch {
      setErrorMessage("Network error while uploading images.");
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
      if (multiFileInputRef.current) multiFileInputRef.current.value = "";
    }
  };

  // Handle replacing a specific image
  const handleReplaceSingle = async (file: File) => {
    if (replacingIndex === null || !file) return;

    setIsUploading(true);
    setErrorMessage(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch("/api/media", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success && (data.data?.url || data.files?.[0]?.url)) {
        const newUrl = data.data?.url || data.files[0].url;
        const updated = [...images];
        updated[replacingIndex] = newUrl;
        onChange(updated);
      } else {
        setErrorMessage(data.error || "Failed to replace image.");
      }
    } catch {
      setErrorMessage("Error occurred during replacement.");
    } finally {
      setIsUploading(false);
      setReplacingIndex(null);
      if (replaceFileInputRef.current) replaceFileInputRef.current.value = "";
    }
  };

  // Set as primary/featured image (move to index 0)
  const setAsFeatured = (index: number) => {
    if (index === 0) return;
    const updated = [...images];
    const [selected] = updated.splice(index, 1);
    updated.unshift(selected);
    onChange(updated);
  };

  // Move image position
  const moveImage = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= images.length) return;
    const updated = [...images];
    const [item] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, item);
    onChange(updated);
  };

  // Remove individual image
  const removeImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    onChange(updated);
  };

  // Drag & drop handlers for dropzone
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUploadFiles(e.dataTransfer.files);
    }
  };

  return (
    <div className="space-y-4">
      {/* Hidden file pickers */}
      <input
        ref={multiFileInputRef}
        type="file"
        multiple
        accept="image/png,image/jpeg,image/webp,image/jpg"
        onChange={(e) => {
          if (e.target.files) handleUploadFiles(e.target.files);
        }}
        className="hidden"
      />

      <input
        ref={replaceFileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/jpg"
        onChange={(e) => {
          if (e.target.files?.[0]) handleReplaceSingle(e.target.files[0]);
        }}
        className="hidden"
      />

      {/* Upload Zone / Drop Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => multiFileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all ${
          isDragging
            ? "border-amber-400 bg-amber-400/10 shadow-lg shadow-amber-400/5"
            : "border-slate-700 hover:border-slate-500 bg-slate-900/60 hover:bg-slate-900/90"
        }`}
      >
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 shadow-inner">
            <Upload size={26} className={isUploading ? "animate-bounce" : ""} />
          </div>

          <div>
            <h4 className="text-sm font-bold text-white">
              Select or Drop Multiple Product Images
            </h4>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              Select multiple files simultaneously from desktop, laptop, mobile, or tablet. Supports JPG, PNG, WEBP formats.
            </p>
          </div>

          <button
            type="button"
            className="mt-1 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold shadow-md transition flex items-center gap-2 pointer-events-none"
          >
            <Plus size={15} />
            <span>Browse Device Gallery</span>
          </button>
        </div>

        {/* Upload Progress Bar */}
        {isUploading && (
          <div className="mt-4 max-w-sm mx-auto space-y-1.5">
            <div className="flex justify-between text-[11px] font-semibold text-amber-400">
              <span>Uploading images...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700">
              <div
                className="bg-amber-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle size={16} className="shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Product Image Gallery Grid */}
      {images.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
            <span>
              Product Gallery ({images.length} image{images.length > 1 ? "s" : ""})
            </span>
            <span className="text-[11px] text-slate-400">
              ★ Star = Primary Featured Image
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {images.map((imgUrl, idx) => (
              <div
                key={`${imgUrl}-${idx}`}
                className={`group relative rounded-xl border overflow-hidden bg-slate-900 transition shadow-sm ${
                  idx === 0
                    ? "border-amber-400 ring-2 ring-amber-400/20"
                    : "border-slate-700 hover:border-slate-500"
                }`}
              >
                {/* Image display */}
                <div className="relative aspect-square w-full bg-black">
                  <img
                    src={imgUrl}
                    alt={`Product preview ${idx + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://commandobd.com/uploads/all/2024/09/24/slider-1.jpg";
                    }}
                  />

                  {/* Featured Badge */}
                  {idx === 0 && (
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-amber-500 text-black text-[9px] font-black uppercase tracking-wider shadow-md flex items-center gap-1">
                      <Star size={10} fill="currentColor" />
                      Featured
                    </div>
                  )}

                  {/* Index badge */}
                  {idx !== 0 && (
                    <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded-md bg-black/70 text-slate-300 text-[10px] font-mono">
                      #{idx + 1}
                    </div>
                  )}

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    title="Remove Image"
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-rose-500/80 hover:bg-rose-500 text-white flex items-center justify-center transition shadow-md sm:opacity-0 group-hover:opacity-100"
                  >
                    <X size={14} />
                  </button>
                </div>

                {/* Card Controls */}
                <div className="p-2 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between gap-1">
                  {/* Set featured */}
                  <button
                    type="button"
                    onClick={() => setAsFeatured(idx)}
                    title={idx === 0 ? "Current Primary Image" : "Set as Primary Image"}
                    className={`p-1.5 rounded-lg text-[10px] font-semibold flex items-center gap-1 transition ${
                      idx === 0
                        ? "text-amber-400 bg-amber-400/10"
                        : "text-slate-400 hover:text-amber-400 hover:bg-slate-800"
                    }`}
                  >
                    <Star size={13} fill={idx === 0 ? "currentColor" : "none"} />
                  </button>

                  {/* Replace */}
                  <button
                    type="button"
                    onClick={() => {
                      setReplacingIndex(idx);
                      replaceFileInputRef.current?.click();
                    }}
                    title="Replace this image"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                  >
                    <RefreshCw size={13} />
                  </button>

                  {/* Reorder controls */}
                  <div className="flex items-center gap-0.5">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveImage(idx, idx - 1)}
                      title="Move Left"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition"
                    >
                      <ArrowLeft size={13} />
                    </button>
                    <button
                      type="button"
                      disabled={idx === images.length - 1}
                      onClick={() => moveImage(idx, idx + 1)}
                      title="Move Right"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition"
                    >
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
