'use client';

import { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, Link as LinkIcon, Check, Loader2, RefreshCw } from 'lucide-react';

interface ImageUploaderProps {
  currentUrl: string;
  onImageChange: (url: string) => void;
}

export default function ImageUploader({ currentUrl, onImageChange }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState(currentUrl);
  const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.imageUrl) {
        onImageChange(data.imageUrl);
        setUrlInput(data.imageUrl);
      } else {
        alert(data.error || 'Upload failed');
      }
    } catch (error) {
      console.error('File upload error:', error);
      alert('Upload failed. Try inserting direct image URL instead.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold uppercase text-gray-700">
          Plant Photo (Cloudinary Integrated)
        </label>
        <div className="flex bg-gray-100 p-0.5 rounded-lg text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`px-3 py-1 rounded-md transition-colors ${
              activeTab === 'upload' ? 'bg-white text-forest-900 shadow-sm' : 'text-gray-500'
            }`}
          >
            Upload File
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`px-3 py-1 rounded-md transition-colors ${
              activeTab === 'url' ? 'bg-white text-forest-900 shadow-sm' : 'text-gray-500'
            }`}
          >
            Paste URL
          </button>
        </div>
      </div>

      {activeTab === 'upload' ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-emerald-800/30 hover:border-emerald-600 rounded-2xl p-6 text-center bg-sage-50/50 hover:bg-sage-50 transition-colors cursor-pointer relative"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileUpload(e.target.files[0]);
              }
            }}
          />

          {uploading ? (
            <div className="flex flex-col items-center justify-center py-4 space-y-2">
              <Loader2 className="w-8 h-8 text-emerald-700 animate-spin" />
              <p className="text-xs font-bold text-emerald-800">Uploading photo to Cloudinary / Server...</p>
            </div>
          ) : currentUrl ? (
            <div className="flex items-center gap-4 text-left">
              <img
                src={currentUrl}
                alt="Selected preview"
                className="w-20 h-20 rounded-xl object-cover border border-emerald-700/20 shadow-sm"
              />
              <div className="flex-1 space-y-1">
                <p className="text-xs font-bold text-forest-900 flex items-center gap-1">
                  <Check className="w-4 h-4 text-emerald-600" /> Photo Loaded
                </p>
                <p className="text-[11px] text-gray-500 truncate max-w-xs">{currentUrl}</p>
                <button
                  type="button"
                  className="text-xs font-semibold text-emerald-700 hover:underline flex items-center gap-1 pt-1"
                >
                  <RefreshCw className="w-3 h-3" /> Change Photo
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center py-2 space-y-2">
              <div className="p-3 rounded-full bg-emerald-100 text-emerald-800">
                <UploadCloud className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-forest-900">
                Drag & Drop high-res photo or click to browse
              </p>
              <p className="text-[10px] text-gray-500">
                JPG, PNG, WebP up to 10MB
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <div className="relative">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://res.cloudinary.com/..."
              className="w-full pl-9 pr-20 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs font-medium"
            />
            <LinkIcon className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <button
              type="button"
              onClick={() => onImageChange(urlInput)}
              className="absolute right-1.5 top-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg"
            >
              Apply
            </button>
          </div>
          {currentUrl && (
            <div className="flex items-center gap-2 pt-1">
              <img src={currentUrl} alt="Preview" className="w-10 h-10 rounded-lg object-cover" />
              <span className="text-xs text-gray-500 truncate">{currentUrl}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
