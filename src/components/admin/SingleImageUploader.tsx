"use client";

import React, { useState, useRef } from "react";
import { Upload, X, RefreshCw, Image as ImageIcon, CheckCircle, AlertCircle } from "lucide-react";

interface SingleImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  folder?: "categories" | "banners" | "products" | "general";
  label?: string;
  required?: boolean;
}

export default function SingleImageUploader({
  value,
  onChange,
  folder = "general",
  label = "Upload Image",
  required = false,
}: SingleImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadFile = async (file: File) => {
    if (!file) return;

    // Check MIME type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg", "image/gif"];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(jpe?g|png|webp|gif)$/i)) {
      setError("Please select a valid image file (JPG, PNG, or WEBP).");
      return;
    }

    // Check size limit (max 15MB)
    if (file.size > 15 * 1024 * 1024) {
      setError("Image size must be less than 15MB.");
      return;
    }

    setError(null);
    setIsUploading(true);
    setProgress(20);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);
      formData.append("altText", file.name);

      setProgress(60);

      const res = await fetch("/api/media", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setProgress(100);

      if (data.success && (data.data?.url || data.files?.[0]?.url)) {
        const url = data.data?.url || data.files[0].url;
        onChange(url);
      } else {
        setError(data.error || "Failed to upload image.");
      }
    } catch {
      setError("Network error while uploading image.");
    } finally {
      setIsUploading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUploadFile(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

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
    const file = e.dataTransfer.files?.[0];
    if (file) handleUploadFile(file);
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-xs font-semibold text-slate-300">
          {label} {required && <span className="text-rose-400">*</span>}
        </label>
      )}

      {/* Hidden Native File Input (compatible with desktop, laptop, mobile, tablet) */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/jpg"
        onChange={handleFileChange}
        className="hidden"
      />

      {value ? (
        <div className="relative rounded-xl border border-slate-700 bg-slate-900/90 p-3 flex flex-col sm:flex-row items-center gap-4">
          <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-slate-700 bg-black shrink-0">
            <img
              src={value}
              alt="Uploaded Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://commandobd.com/uploads/all/2024/09/24/slider-1.jpg";
              }}
            />
          </div>

          <div className="flex-1 w-full space-y-2 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-300 truncate block">
                {value}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-semibold flex items-center gap-1.5 transition border border-slate-700"
              >
                <RefreshCw size={13} className={isUploading ? "animate-spin" : ""} />
                <span>Replace Image</span>
              </button>

              <button
                type="button"
                onClick={() => onChange("")}
                className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold flex items-center gap-1.5 transition border border-rose-500/20"
              >
                <X size={13} />
                <span>Remove</span>
              </button>
            </div>

            {isUploading && (
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-amber-400 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
            isDragging
              ? "border-amber-400 bg-amber-400/10"
              : "border-slate-700 hover:border-slate-500 bg-slate-900/60 hover:bg-slate-900"
          }`}
        >
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-amber-400 shadow-inner">
              <Upload size={22} className={isUploading ? "animate-bounce" : ""} />
            </div>
            <div>
              <p className="text-xs font-bold text-white">
                Drag and drop image here, or{" "}
                <span className="text-amber-400 underline decoration-amber-400/50">
                  browse from device
                </span>
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Supports JPG, PNG, WEBP up to 15MB. Works on mobile, tablet & desktop.
              </p>
            </div>
          </div>

          {isUploading && (
            <div className="mt-4 max-w-xs mx-auto space-y-1">
              <div className="flex justify-between text-[10px] text-amber-400">
                <span>Uploading...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-amber-400 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle size={14} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
