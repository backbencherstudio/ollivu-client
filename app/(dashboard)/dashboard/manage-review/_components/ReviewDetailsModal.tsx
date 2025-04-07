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
        className="bg-white rounded-xl w-[500px] relative"
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col items-center pt-8 pb-6">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 mb-3">
            <img 
              src={review.reviewer.avatar} 
              alt={review.reviewer.name} 
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-xl font-semibold mb-1">{review.reviewer.name}</h2>
          <p className="text-gray-500 text-sm mb-4">{review.reviewer.email || 'chris_glasser@gmail.com'}</p>
          
          <div className="flex items-center gap-1 mb-2">
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
          </div>
        </div>

        <div className="px-8 pb-8">
          <h3 className="font-semibold mb-3">Review</h3>
          <p className="text-gray-600 text-sm leading-relaxed">{review.reviewText}</p>
          
          <div className="mt-4 text-gray-400 text-sm">
            July 2, 2020 03:29 PM
          </div>

          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1 text-blue-600">
                <span>👍</span>
                <span>28</span>
              </button>
              <button className="flex items-center gap-1 text-gray-500">
                <span>👎</span>
                <span>2</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}