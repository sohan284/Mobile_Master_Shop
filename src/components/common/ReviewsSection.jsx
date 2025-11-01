'use client';
import React, { useState, useEffect } from 'react';
import { Star, ChevronRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { apiFetcher } from '@/lib/api';
import toast from 'react-hot-toast';
import MotionFade from '@/components/animations/MotionFade';

export default function ReviewsSection({
  productId,
  type = 'phone', // 'phone', 'accessory', or 'repair'
  reviews = [],
  isLoading = false,
  onReviewSubmitted,
  refetchReviews
}) {
  const { isAuthenticated, user } = useAuth();
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: '',
    name: ''
  });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);

  useEffect(() => {
    if (user?.name || user?.username) {
      setReviewForm(prev => ({
        ...prev,
        name: user?.name || user?.username || ''
      }));
    }
  }, [user]);

  // Review submission handler
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated()) {
      toast.error('Please login to submit a review');
      return;
    }
    
    if (!reviewForm.comment.trim()) {
      toast.error('Please enter your review comment');
      return;
    }
    
    setIsSubmittingReview(true);
    const loadingToast = toast.loading('Submitting review...');
    
    try {
      let endpoint;
      let payload;
      
      if (type === 'phone') {
        endpoint = '/api/brandnew/review/';
        payload = {
          rating: reviewForm.rating,
          review: reviewForm.comment.trim(),
          customer_name: reviewForm.name || user?.name || user?.username || 'Anonymous',
          customer_email: user?.email || '',
          phone_model: parseInt(productId)
        };
      } else if (type === 'accessory') {
        endpoint = '/api/accessories/review/';
        payload = {
          rating: reviewForm.rating,
          review: reviewForm.comment.trim(),
          customer_name: reviewForm.name || user?.name || user?.username || 'Anonymous',
          customer_email: user?.email || '',
          product_id: parseInt(productId)
        };
      } else if (type === 'repair') {
        endpoint = '/api/repair/review/';
        payload = {
          rating: reviewForm.rating,
          review: reviewForm.comment.trim(),
          customer_name: reviewForm.name || user?.name || user?.username || 'Anonymous',
          customer_email: user?.email || '',
          phone_model_id: parseInt(productId)
        };
      }

      await apiFetcher.post(endpoint, payload);
      
      toast.dismiss(loadingToast);
      toast.success('Review submitted successfully!');
      
      setReviewForm({
        rating: 5,
        comment: '',
        name: user?.name || user?.username || ''
      });
      
      // Refetch reviews to update the list immediately
      if (refetchReviews) {
        await refetchReviews();
      }
      
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(error.response?.data?.message || 'Failed to submit review. Please try again.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <MotionFade delay={0.4} immediate={true}>
      <section className="my-16">
        <div className=" gap-6">
          {/* Main Reviews Section */}
          <div className=" bg-white/10 backdrop-blur-sm rounded-2xl border border-accent/20 p-6 md:p-8">
            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
              <div>
                <h2 className="text-2xl font-bold mb-6 text-secondary">Reviews</h2>
                {/* Overall Rating */}
                <div className="flex flex-col gap-6 mb-6 pb-6 border-accent/20">
                  <div className="flex flex-col items-center md:items-start">
                    <div className="text-5xl font-bold mb-2 text-secondary">
                      {reviews.length > 0
                        ? (reviews.reduce((acc, r) => acc + (parseFloat(r.rating) || 5), 0) / reviews.length).toFixed(1)
                        : '0.0'}
                    </div>
                    <div className="flex gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => {
                        const avgRating = reviews.length > 0
                          ? reviews.reduce((acc, r) => acc + (parseFloat(r.rating) || 5), 0) / reviews.length
                          : 0;
                        return (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= Math.floor(avgRating)
                                ? 'fill-orange-400 text-orange-400'
                                : star <= avgRating
                                ? 'fill-orange-300 text-orange-300'
                                : 'fill-none text-accent/30'
                            }`}
                          />
                        );
                      })}
                    </div>
                    <div className="text-accent/60 text-xs">{reviews.length} ratings</div>
                  </div>

                  {/* Rating Distribution */}
                  <div className="flex-1 space-y-1.5">
                    {[5, 4, 3, 2, 1].map((rating) => {
                      const count = reviews.filter(r => Math.floor(parseFloat(r.rating) || 5) === rating).length;
                      const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                      return (
                        <div key={rating} className="flex items-center gap-2">
                          <span className="text-xs font-medium w-6 text-accent">{rating}.0</span>
                          <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-orange-400 rounded-full transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-xs text-accent/60 w-20">
                            {count} {count === 1 ? 'review' : 'reviews'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Review Submission Form */}
              <div className="mb-6 pb-6 border-accent/20">
                <h3 className="text-base font-semibold text-secondary mb-3">Write a Review</h3>
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-accent mb-2">Your Name</label>
                    <input
                      type="text"
                      value={reviewForm.name}
                      onChange={(e) => setReviewForm(prev => ({ ...prev, name: e.target.value }))}
                      required
                      className="w-full px-4 py-2 bg-white/5 border border-accent/20 rounded-lg text-accent focus:outline-none focus:border-secondary"
                      placeholder="Enter your name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-accent mb-2">Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          type="button"
                          onClick={() => setReviewForm(prev => ({ ...prev, rating }))}
                          className="focus:outline-none cursor-pointer"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              rating <= reviewForm.rating
                                ? 'text-orange-400 fill-current'
                                : 'text-accent/30'
                            } transition-colors`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-accent mb-2">Your Review</label>
                    <textarea
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                      required
                      rows={4}
                      className="w-full px-4 py-2 bg-white/5 border border-accent/20 rounded-lg text-accent focus:outline-none focus:border-secondary resize-none"
                      placeholder="Share your experience with this product..."
                    />
                  </div>
                  
                  <div className='flex justify-end'>
                    <button
                      type="submit"
                      disabled={isSubmittingReview}
                      className="bg-secondary text-primary px-6 py-2 rounded-full hover:bg-secondary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Individual Reviews List */}
            <div className="space-y-6">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
                </div>
              ) : reviews.length > 0 ? (
                <>
                  {!showAllReviews ? (
                    <>
                      {reviews.slice(0, 3).map((review, index) => (
                        <div key={review.id || index} className="pb-6 border-b border-accent/20 last:border-b-0">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-600 to-orange-400 flex items-center justify-center text-white font-semibold text-sm">
                                {(review.customer_name || review.name || 'A')[0].toUpperCase()}
                              </div>
                              <div>
                                <h3 className="font-semibold text-base text-accent">
                                  {review.customer_name || review.name || 'Anonymous'}
                                </h3>
                                <p className="text-xs text-accent/60">
                                  {review.created_at 
                                    ? new Date(review.created_at).toLocaleDateString('en-US', { 
                                        month: 'short', 
                                        day: 'numeric',
                                        year: 'numeric'
                                      })
                                    : 'Recently'}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-base text-secondary">
                                {(parseFloat(review.rating) || 5).toFixed(1)}
                              </span>
                              <div className="flex gap-0.5">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`w-4 h-4 ${
                                      star <= (parseFloat(review.rating) || 5)
                                        ? 'fill-orange-400 text-orange-400'
                                        : 'fill-none text-accent/30'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                          <p className="text-accent/80 leading-relaxed text-sm">
                            {review.comment || review.review || review.text}
                          </p>
                        </div>
                      ))}
                      {reviews.length > 3 && (
                        <button
                          onClick={() => setShowAllReviews(true)}
                          className="flex items-center gap-2 text-orange-400 font-semibold hover:text-orange-700 transition-colors mt-6"
                        >
                          Read all reviews
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      )}
                    </>
                  ) : (
                    <div className="max-h-96 overflow-y-auto space-y-6 pr-2">
                      {reviews.map((review, index) => (
                        <div key={review.id || index} className="pb-6 border-b border-accent/20 last:border-b-0">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-600 to-orange-400 flex items-center justify-center text-white font-semibold text-sm">
                                {(review.customer_name || review.name || 'A')[0].toUpperCase()}
                              </div>
                              <div>
                                <h3 className="font-semibold text-base text-accent">
                                  {review.customer_name || review.name || 'Anonymous'}
                                </h3>
                                <p className="text-xs text-accent/60">
                                  {review.created_at 
                                    ? new Date(review.created_at).toLocaleDateString('en-US', { 
                                        month: 'short', 
                                        day: 'numeric',
                                        year: 'numeric'
                                      })
                                    : 'Recently'}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-base text-secondary">
                                {(parseFloat(review.rating) || 5).toFixed(1)}
                              </span>
                              <div className="flex gap-0.5">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`w-4 h-4 ${
                                      star <= (parseFloat(review.rating) || 5)
                                        ? 'fill-orange-400 text-orange-400'
                                        : 'fill-none text-accent/30'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                          <p className="text-accent/80 leading-relaxed text-sm">
                            {review.comment || review.review || review.text}
                          </p>
                        </div>
                      ))}
                      <button
                        onClick={() => setShowAllReviews(false)}
                        className="flex items-center gap-2 text-orange-400 font-semibold hover:text-orange-700 transition-colors mt-6"
                      >
                        Show less
                        <ChevronRight className="w-4 h-4 rotate-90" />
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-accent/80">No reviews yet. Be the first to review this product!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </MotionFade>
  );
}

