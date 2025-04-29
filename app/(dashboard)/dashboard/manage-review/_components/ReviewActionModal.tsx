import { X, Star } from 'lucide-react';
import { Review } from '../_types';

interface ReviewActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  review: Review | null;
}

export function ReviewActionModal({ isOpen, onClose, review }: ReviewActionModalProps) {
  if (!isOpen || !review) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg w-[450px]"
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-gray-600">Reviewed By:</div>
              <div className="font-medium">{review?.reviewer?.name}</div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-gray-600">Flagged By:</div>
              <div className="font-medium">{review?.flaggedBy?.name}</div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-gray-600">Date:</div>
              <div className="font-medium">03-07-24</div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-b-lg">
          <h3 className="font-semibold mb-3">Review</h3>
          {/* <div className="flex items-center gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star}
                className={`h-5 w-5 ${
                  star <= review.rating 
                    ? 'fill-yellow-400 text-yellow-400' 
                    : 'fill-gray-200 text-gray-200'
                }`}
              />
            ))}
          </div> */}
          <p className="text-gray-600 text-sm leading-relaxed">{review?.reviewText}</p>
          <div className="text-gray-400 text-sm mt-4">
            July 2, 2024 03:29 PM
          </div>
        </div>
      </div>
    </div>
  );
}