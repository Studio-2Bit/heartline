import { useState } from 'react';
import { Upload, X } from 'lucide-react';

interface UploadBoxProps {
  label: string;
  onFileSelect: (file: File | null) => void;
}

export const UploadBox = ({ label, onFileSelect }: UploadBoxProps) => {
  const [fileName, setFileName] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      onFileSelect(file);
    }
  };

  const handleRemove = () => {
    setFileName('');
    onFileSelect(null);
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-red-500 transition">
        {!fileName ? (
          <label className="cursor-pointer">
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
            <p className="text-xs text-gray-500 mt-1">PNG, JPG, PDF up to 10MB</p>
            <input
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept="image/*,.pdf"
            />
          </label>
        ) : (
          <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
            <span className="text-sm text-gray-700">{fileName}</span>
            <button
              onClick={handleRemove}
              className="text-red-600 hover:text-red-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
