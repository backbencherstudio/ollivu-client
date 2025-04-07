import { X, Star } from 'lucide-react';
import { Review } from '../_types';

interface ReviewDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  review: Review | null;
}

export function ReviewDetailsModal({ isOpen, onClose, review }: ReviewDetailsModalProps) {
  if (!isOpen || !review) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl p-6 w-[600px] max-h-[80vh] overflow-y-auto relative"
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-xl font-semibold mb-6">Review Details</h2>

        <div className="space-y-6">
          {/* Reviewer Info */}
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
              <img 
                src={review.reviewer.avatar} 
                alt={review.reviewer.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-medium">{review.reviewer.name}</h3>
              <p className="text-sm text-gray-500">{review.serviceType}</p>
            </div>
          </div>

          {/* Rating */}
          <div>
            <h4 className="text-sm font-medium mb-2">Rating</h4>
            <div className="flex items-center">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <span className="ml-2 text-lg font-medium">{review.rating.toFixed(1)}</span>
            </div>
          </div>

          {/* Review Text */}
          <div>
            <h4 className="text-sm font-medium mb-2">Review</h4>
            <p className="text-gray-600">{review.reviewText}</p>
          </div>

          {/* Flagged By */}
          <div>
            <h4 className="text-sm font-medium mb-2">Flagged By</h4>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                <img 
                  src={review.flaggedBy.avatar} 
                  alt={review.flaggedBy.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-sm">{review.flaggedBy.name}</span>
            </div>
          </div>

          {/* Status */}
          <div>
            <h4 className="text-sm font-medium mb-2">Status</h4>
            <span className="text-sm">{review.status}</span>
          </div>
        </div>
      </div>
    </div>
  );
}