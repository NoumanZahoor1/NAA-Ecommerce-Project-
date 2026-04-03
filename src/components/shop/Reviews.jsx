import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar, FaRegStar, FaUserCircle, FaCheckCircle, FaEdit, FaTrash } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const Reviews = ({ productId }) => {
    const { user } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isWriting, setIsWriting] = useState(false);
    const [editingReview, setEditingReview] = useState(null);
    const [rating, setRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const averageRating = reviews.length
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
        : 0;

    // Fetch reviews on component mount
    useEffect(() => {
        fetchReviews();
    }, [productId]);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const res = await fetch(`/api/reviews/product/${productId}`);
            if (res.ok) {
                const data = await res.json();
                setReviews(data);
            }
        } catch (err) {
            console.error('Failed to fetch reviews:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            setError('Please login to write a review');
            return;
        }

        if (!comment.trim()) {
            setError('Please write a comment');
            return;
        }

        setSubmitting(true);
        setError('');

        try {
            const endpoint = editingReview ? `/api/reviews/${editingReview._id}` : '/api/reviews';
            const method = editingReview ? 'PUT' : 'POST';

            const res = await fetch(endpoint, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({
                    productId,
                    rating,
                    comment
                })
            });

            const contentType = res.headers.get('content-type');
            let data;
            if (contentType && contentType.includes('application/json')) {
                data = await res.json();
            } else {
                const text = await res.text();
                console.error('Server returned non-JSON response:', text);
                setError(`Server returned an unexpected format (Status: ${res.status}). See console for details.`);
                setSubmitting(false);
                return;
            }

            if (res.ok) {
                await fetchReviews();
                resetForm();
            } else {
                setError(data.message || `Failed to ${editingReview ? 'update' : 'submit'} review`);
            }
        } catch (err) {
            setError(err.message || 'An error occurred. Please try again.');
            console.error('Review submit error:', err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (reviewId) => {
        if (!window.confirm('Are you sure you want to delete this review?')) {
            return;
        }

        try {
            const res = await fetch(`/api/reviews/${reviewId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });

            if (res.ok) {
                await fetchReviews();
            } else {
                const data = await res.json();
                alert(data.message || 'Failed to delete review');
            }
        } catch (err) {
            alert('An error occurred. Please try again.');
            console.error('Delete review error:', err);
        }
    };

    const handleEdit = (review) => {
        setEditingReview(review);
        setRating(review.rating);
        setComment(review.comment);
        setIsWriting(true);
    };

    const resetForm = () => {
        setComment('');
        setRating(5);
        setIsWriting(false);
        setEditingReview(null);
        setError('');
    };

    const isGuest = user?.role === 'guest';
    const canReview = user && !isGuest;
    const userHasReviewed = canReview && reviews.some(r => r.user?._id === user._id || r.user === user._id);

    return (
        <div className="max-w-4xl mx-auto py-16 px-6">
            <div className="flex items-center justify-between mb-12">
                <div>
                    <h2 className="text-3xl font-black uppercase tracking-tighter dark:text-white mb-2">Reviews</h2>
                    <div className="flex items-center gap-4">
                        <div className="flex text-yellow-500 text-lg">
                            {[...Array(5)].map((_, i) => (
                                <FaStar key={i} className={i < Math.round(averageRating) ? "opacity-100" : "opacity-20"} />
                            ))}
                        </div>
                        <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                            {reviews.length} Reviews / {averageRating} Average
                        </span>
                    </div>
                </div>
                {canReview && (
                    <button
                        onClick={() => {
                            if (userHasReviewed && !editingReview) {
                                alert('You have already reviewed this product. You can edit your existing review.');
                                return;
                            }
                            setIsWriting(!isWriting);
                            if (isWriting) resetForm();
                        }}
                        className="bg-black dark:bg-white text-white dark:text-black px-8 py-4 rounded-full font-black text-xs uppercase tracking-[0.2em] transform hover:scale-105 transition-transform"
                    >
                        {editingReview ? 'Cancel Edit' : isWriting ? 'Cancel' : 'Write Review'}
                    </button>
                )}
            </div>

            <AnimatePresence>
                {isWriting && user && (
                    <motion.form
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden mb-16 bg-gray-50 dark:bg-zinc-900/50 rounded-[2rem] p-8 md:p-12 shadow-inner"
                        onSubmit={handleSubmit}
                    >
                        <div className="flex flex-col gap-6 max-w-2xl mx-auto">
                            <h3 className="text-xl font-bold dark:text-white text-center">
                                {editingReview ? 'Edit Your Review' : 'Write a Review'}
                            </h3>

                            <div className="flex gap-2 justify-center mb-4">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        onClick={() => setRating(star)}
                                        className="text-3xl transition-transform hover:scale-125 focus:outline-none"
                                    >
                                        <FaStar className={(hoverRating || rating) >= star ? "text-yellow-400" : "text-gray-300 dark:text-gray-700"} />
                                    </button>
                                ))}
                            </div>

                            <textarea
                                placeholder="Share your experience with this product..."
                                rows="4"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="w-full bg-white dark:bg-black border border-gray-100 dark:border-zinc-800 rounded-xl p-4 font-bold text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500"
                                required
                            />

                            {error && (
                                <p className="text-red-500 text-sm text-center">{error}</p>
                            )}

                            <button
                                type="submit"
                                disabled={submitting}
                                className="bg-indigo-600 text-white py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] hover:bg-indigo-700 transition-colors disabled:opacity-50"
                            >
                                {submitting ? 'Submitting...' : editingReview ? 'Update Review' : 'Submit Review'}
                            </button>
                        </div>
                    </motion.form>
                )}
            </AnimatePresence>

            {!user && (
                <div className="text-center py-8 mb-8 bg-gray-50 dark:bg-zinc-900/30 rounded-2xl">
                    <p className="text-gray-600 dark:text-gray-300 font-medium">
                        Please <a href="/login" className="text-indigo-600 hover:underline">login</a> to write a review
                    </p>
                </div>
            )}

            {isGuest && (
                <div className="text-center py-8 mb-8 bg-gray-50 dark:bg-zinc-900/30 rounded-2xl">
                    <p className="text-gray-600 dark:text-gray-300 font-medium">
                        Guest accounts cannot post reviews. Please <a href="/login" className="text-indigo-600 hover:underline">create an account</a> to share your thoughts.
                    </p>
                </div>
            )}

            <div className="space-y-8">
                {loading ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 dark:text-gray-400">Loading reviews...</p>
                    </div>
                ) : reviews.length === 0 ? (
                    <div className="text-center py-12 opacity-50">
                        <p className="text-lg font-medium dark:text-white">No reviews yet. Be the first to share your thoughts.</p>
                    </div>
                ) : (
                    reviews.map((review) => {
                        const isOwnReview = user && (review.user?._id === user._id || review.user === user._id);

                        return (
                            <motion.div
                                key={review._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-gray-50 dark:bg-zinc-900/30 p-8 rounded-[2rem] border border-transparent dark:border-zinc-900 relative"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                                            <FaUserCircle className="text-2xl text-gray-400" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-bold dark:text-white">{review.name}</h4>
                                                {review.isVerified && (
                                                    <span className="flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full text-xs font-bold">
                                                        <FaCheckCircle size={10} />
                                                        Verified Purchase
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex text-yellow-500 text-xs mt-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <FaStar key={i} className={i < review.rating ? "opacity-100" : "opacity-20"} />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                            {new Date(review.createdAt).toLocaleDateString()}
                                        </span>
                                        {isOwnReview && (
                                            <div className="flex gap-2 ml-2">
                                                <button
                                                    onClick={() => handleEdit(review)}
                                                    className="text-indigo-600 hover:text-indigo-700 p-2"
                                                    title="Edit review"
                                                >
                                                    <FaEdit size={14} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(review._id)}
                                                    className="text-red-600 hover:text-red-700 p-2"
                                                    title="Delete review"
                                                >
                                                    <FaTrash size={14} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                                    "{review.comment}"
                                </p>
                            </motion.div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default Reviews;
