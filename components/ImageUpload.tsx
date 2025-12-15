import React, { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  onImageSelect: (base64: string) => void;
  selectedImage: string | null;
  onClear: () => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelect, selectedImage, onClear }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      onImageSelect(base64);
    };
    reader.readAsDataURL(file);
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
    if (file) {
      processFile(file);
    }
  };

  if (selectedImage) {
    return (
      <div className="relative group rounded-xl overflow-hidden border-2 border-mythic-700/50 shadow-2xl">
        <img 
          src={selectedImage} 
          alt="Selected Source" 
          className="w-full h-auto max-h-[500px] object-contain bg-black/40"
        />
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button 
                onClick={onClear}
                className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full transform hover:scale-110 transition-transform"
            >
                <X size={24} />
            </button>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => fileInputRef.current?.click()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center cursor-pointer transition-all duration-300
        ${isDragging 
          ? 'border-gold-400 bg-mythic-900/50 scale-[1.02]' 
          : 'border-mythic-700 hover:border-gold-400 hover:bg-mythic-900/30'
        }
      `}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      <div className={`p-4 rounded-full bg-mythic-800 mb-4 ${isDragging ? 'animate-bounce' : ''}`}>
        <Upload className="w-8 h-8 text-gold-400" />
      </div>
      <h3 className="text-xl font-bold text-gray-200 mb-2">Upload Reference Image</h3>
      <p className="text-gray-400 text-center text-sm max-w-xs">
        Drag & drop or click to upload your character image (Athena, etc.)
      </p>
    </div>
  );
};

export default ImageUpload;