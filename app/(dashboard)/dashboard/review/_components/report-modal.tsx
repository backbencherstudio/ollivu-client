import React, { useState } from 'react';
import { X } from 'lucide-react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (description: string, file: File | null) => Promise<void>;
}

export default function ReportModal({ isOpen, onClose, onSubmit }: ReportModalProps) {
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      await onSubmit(description, file);
      setDescription('');
      setFile(null);
      onClose();
    } catch (error) {
      console.error('Error submitting report:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-[400px] max-w-[95%] relative mx-4">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-medium text-gray-900 mb-4">
          Report Review
        </h2>

        <p className="text-sm text-gray-600 mb-4">
          If this comment is hateful or abusive, please upload a screenshot or file as proof to help us review it.
        </p>

        <div className="mb-4">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your other issues"
            className="w-full h-[120px] p-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500 resize-none"
          />
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-2">Upload supporting file*</p>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            accept=".pdf,.jpg,.png"
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer block w-full p-3 text-sm border border-gray-200 rounded-lg text-center hover:bg-gray-50"
          >
            {file ? file.name : 'Choose files'}
          </label>
          <p className="text-xs text-gray-500 mt-1">
            Accepted formats: PDF, JPG, PNG
            <span className="float-right">Maximum file size: 50 MB</span>
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !description.trim()}
          className="w-full py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors disabled:bg-gray-400"
        >
          {isSubmitting ? 'Submitting...' : 'Report'}
        </button>
      </div>
    </div>
  );
}
