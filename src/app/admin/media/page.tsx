"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Image as ImageIcon,
  Upload,
  Search,
  Trash2,
  Copy,
  Check,
  Folder,
  Eye,
  X,
  FileText,
  Filter,
  RefreshCw,
  Plus,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { MediaItem } from "@/types/cms";

export default function AdminMediaPage() {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [editingAltText, setEditingAltText] = useState("");

  const multiFileInputRef = useRef<HTMLInputElement>(null);
  const replaceFileInputRef = useRef<HTMLInputElement>(null);

  const fetchMedia = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedFolder !== "all") params.append("folder", selectedFolder);
      if (searchQuery) params.append("search", searchQuery);
      const res = await fetch(`/api/media?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setMediaList(data.data || []);
      }
    } catch {
      console.warn("Failed to fetch media");
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [selectedFolder, searchQuery]);

  const showNotification = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3500);
  };

  const handleMultipleFilesUpload = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    setIsUploading(true);
    setUploadProgress(20);

    const formData = new FormData();
    for (const f of fileArray) {
      formData.append("files", f);
    }
    formData.append("folder", selectedFolder === "all" ? "general" : selectedFolder);

    setUploadProgress(50);

    try {
      const res = await fetch("/api/media", {
        method: "POST",
        body: formData,
      });
      setUploadProgress(85);
      const data = await res.json();
      if (data.success) {
        setUploadProgress(100);
        await fetchMedia();
        showNotification(`${fileArray.length} file(s) uploaded successfully!`);
      } else {
        alert(data.error || "Failed to upload files.");
      }
    } catch {
      alert("Failed to upload files.");
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
      if (multiFileInputRef.current) multiFileInputRef.current.value = "";
    }
  };

  const handleReplaceFile = async (file: File) => {
    if (!selectedMedia || !file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", selectedMedia.folder);

    try {
      const res = await fetch("/api/media", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success && (data.data?.url || data.files?.[0]?.url)) {
        const newUrl = data.data?.url || data.files[0].url;
        setSelectedMedia({ ...selectedMedia, url: newUrl, name: file.name, size: file.size });
        await fetchMedia();
        showNotification(`Replaced with "${file.name}".`);
      }
    } catch {
      alert("Failed to replace media.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete media item "${name}"?`)) return;
    try {
      const res = await fetch(`/api/media?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        await fetchMedia();
        if (selectedMedia?.id === id) setSelectedMedia(null);
        showNotification(`Deleted "${name}".`);
      }
    } catch {
      alert("Failed to delete media.");
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return "0 KB";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Hidden file pickers */}
      <input
        ref={multiFileInputRef}
        type="file"
        multiple
        accept="image/png,image/jpeg,image/webp,image/jpg"
        onChange={(e) => {
          if (e.target.files) handleMultipleFilesUpload(e.target.files);
        }}
        className="hidden"
      />

      <input
        ref={replaceFileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/jpg"
        onChange={(e) => {
          if (e.target.files?.[0]) handleReplaceFile(e.target.files[0]);
        }}
        className="hidden"
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <ImageIcon className="w-6 h-6 text-amber-400" />
            Media Assets Library
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Upload images simultaneously from device (mobile, laptop, desktop), search assets, organize folders, and manage CDN urls.
          </p>
        </div>

        {/* Upload Trigger */}
        <button
          onClick={() => multiFileInputRef.current?.click()}
          disabled={isUploading}
          className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <Upload className="w-4 h-4 stroke-[3]" />
          <span>{isUploading ? "Uploading..." : "Upload Multiple Images"}</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Multi-file Drag & Drop Area */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setIsDragging(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (e.dataTransfer.files?.length) {
            handleMultipleFilesUpload(e.dataTransfer.files);
          }
        }}
        onClick={() => multiFileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
          isDragging
            ? "border-amber-400 bg-amber-400/10"
            : "border-slate-700/80 hover:border-slate-500 bg-slate-900/60 hover:bg-slate-900"
        }`}
      >
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-amber-400">
            <Upload size={22} className={isUploading ? "animate-bounce" : ""} />
          </div>
          <p className="text-xs font-bold text-white">
            Drag &amp; drop multiple images here, or <span className="text-amber-400 underline">browse device</span>
          </p>
          <p className="text-[11px] text-slate-400">
            JPG, PNG, WEBP supported. Select 5, 10 or more images simultaneously.
          </p>
        </div>

        {isUploading && (
          <div className="mt-4 max-w-xs mx-auto space-y-1">
            <div className="flex justify-between text-[10px] text-amber-400 font-semibold">
              <span>Uploading...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-amber-400 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Filter and Folder Navigation */}
      <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {[
            { key: "all", label: "All Media" },
            { key: "banners", label: "Hero Banners" },
            { key: "products", label: "Products" },
            { key: "categories", label: "Categories" },
            { key: "general", label: "General" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setSelectedFolder(f.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                selectedFolder === f.key
                  ? "bg-amber-400 text-slate-950 shadow-sm"
                  : "bg-slate-900 text-slate-300 hover:text-white border border-slate-700"
              }`}
            >
              <Folder className="w-3.5 h-3.5" />
              <span>{f.label}</span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or alt text..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {mediaList.map((item) => (
          <div
            key={item.id}
            onClick={() => {
              setSelectedMedia(item);
              setEditingAltText(item.altText || "");
            }}
            className="group relative aspect-square rounded-2xl overflow-hidden bg-slate-900 border border-slate-700/80 hover:border-amber-400/80 transition-all cursor-pointer shadow-sm flex flex-col justify-between"
          >
            <img
              src={item.url}
              alt={item.altText || item.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://commandobd.com/uploads/all/2024/09/24/slider-1.jpg";
              }}
            />

            {/* Hover Actions Bar */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-between text-white">
              <div className="flex items-center justify-between">
                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-black/80 text-amber-400 uppercase">
                  {item.folder}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(item.id, item.name);
                  }}
                  className="p-1 rounded bg-red-500/80 hover:bg-red-600 text-white"
                  title="Delete image"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div>
                <div className="text-[10px] font-bold truncate">{item.name}</div>
                <div className="text-[9px] text-slate-300 font-mono">
                  {formatFileSize(item.size)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Preview & Edit Modal */}
      {selectedMedia && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-[#0f172a] border border-slate-700 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye size={18} className="text-amber-400" />
                <h3 className="font-bold text-white text-sm truncate max-w-md">
                  {selectedMedia.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedMedia(null)}
                className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition"
              >
                <X size={14} />
              </button>
            </div>

            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Image Preview */}
              <div className="aspect-square rounded-xl overflow-hidden bg-black border border-slate-800 flex items-center justify-center">
                <img
                  src={selectedMedia.url}
                  alt={selectedMedia.name}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Metadata Details */}
              <div className="space-y-4 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Image URL</label>
                  <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 rounded-xl p-2 font-mono text-[11px] text-slate-300 break-all">
                    <span className="flex-1 truncate">{selectedMedia.url}</span>
                    <button
                      onClick={() => copyToClipboard(selectedMedia.url)}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-400 font-sans text-xs font-bold shrink-0 flex items-center gap-1"
                    >
                      {copiedUrl === selectedMedia.url ? <Check size={12} /> : <Copy size={12} />}
                      <span>{copiedUrl === selectedMedia.url ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Folder</span>
                    <span className="font-bold text-white uppercase">{selectedMedia.folder}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">File Size</span>
                    <span className="font-bold text-white font-mono">
                      {formatFileSize(selectedMedia.size)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">MIME Type</span>
                    <span className="font-bold text-white font-mono">{selectedMedia.mimeType}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Uploaded</span>
                    <span className="font-bold text-white">
                      {new Date(selectedMedia.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Alt Text (SEO)</label>
                  <input
                    type="text"
                    value={editingAltText}
                    onChange={(e) => setEditingAltText(e.target.value)}
                    placeholder="Describe image for SEO & accessibility..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => replaceFileInputRef.current?.click()}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs flex items-center gap-1.5 transition border border-slate-700"
                  >
                    <RefreshCw size={13} />
                    <span>Replace Image</span>
                  </button>

                  <button
                    onClick={() => handleDelete(selectedMedia.id, selectedMedia.name)}
                    className="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold text-xs flex items-center gap-1.5 transition border border-rose-500/30"
                  >
                    <Trash2 size={13} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
