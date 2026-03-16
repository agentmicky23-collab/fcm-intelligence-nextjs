'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

type Sentiment = 'happy' | 'neutral' | 'sad' | null;

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

export default function FeedbackModal({ isOpen, onClose, onSubmit }: FeedbackModalProps) {
  const [step, setStep] = useState(1);
  const [sentiment, setSentiment] = useState<Sentiment>(null);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSentimentClick = (selected: Sentiment) => {
    setSentiment(selected);
    setStep(2);
  };

  const handleSubmitFeedback = async () => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sentiment,
          message: message.trim() || undefined,
          email: email.trim() || undefined,
          page: window.location.pathname,
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        setShowSuccess(true);
        onSubmit();
        
        // Auto-close after 2 seconds
        setTimeout(() => {
          resetAndClose();
        }, 2000);
      } else {
        alert('Failed to submit feedback. Please try again.');
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Feedback submission error:', error);
      alert('Failed to submit feedback. Please try again.');
      setIsSubmitting(false);
    }
  };

  const resetAndClose = () => {
    setStep(1);
    setSentiment(null);
    setMessage('');
    setEmail('');
    setIsSubmitting(false);
    setShowSuccess(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
      <div className="bg-black border-2 border-[#FFD700] rounded-lg p-6 max-w-md w-full relative">
        <button
          onClick={resetAndClose}
          className="absolute top-4 right-4 text-[#FFD700] hover:text-white transition"
          disabled={isSubmitting}
        >
          <X className="w-5 h-5" />
        </button>

        {showSuccess ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-[#FFD700] mb-2">Thanks!</h3>
            <p className="text-white">We read every message.</p>
          </div>
        ) : (
          <>
            {step === 1 && (
              <div>
                <h3 className="text-2xl font-bold text-white mb-6">How's your experience?</h3>
                <div className="flex justify-around gap-4">
                  <button
                    onClick={() => handleSentimentClick('happy')}
                    className="flex flex-col items-center gap-2 p-4 rounded-lg
                               hover:bg-[#FFD700]/10 transition group"
                  >
                    <span className="text-6xl group-hover:scale-110 transition">😊</span>
                    <span className="text-[#FFD700] font-medium">Great</span>
                  </button>
                  <button
                    onClick={() => handleSentimentClick('neutral')}
                    className="flex flex-col items-center gap-2 p-4 rounded-lg
                               hover:bg-[#FFD700]/10 transition group"
                  >
                    <span className="text-6xl group-hover:scale-110 transition">😐</span>
                    <span className="text-[#FFD700] font-medium">Okay</span>
                  </button>
                  <button
                    onClick={() => handleSentimentClick('sad')}
                    className="flex flex-col items-center gap-2 p-4 rounded-lg
                               hover:bg-[#FFD700]/10 transition group"
                  >
                    <span className="text-6xl group-hover:scale-110 transition">😟</span>
                    <span className="text-[#FFD700] font-medium">Not Good</span>
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Tell us more (optional)</h3>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="What can we improve?"
                  className="w-full p-3 bg-black border border-[#FFD700] rounded text-white
                             placeholder:text-gray-500 focus:ring-2 focus:ring-[#FFD700] 
                             focus:border-transparent outline-none resize-none"
                  rows={2}
                />
                <button
                  onClick={() => setStep(3)}
                  className="mt-4 w-full bg-[#FFD700] text-black font-bold py-3 rounded-lg
                             hover:bg-[#FFD700]/90 transition"
                >
                  Next
                </button>
                <button
                  onClick={handleSubmitFeedback}
                  disabled={isSubmitting}
                  className="mt-2 w-full text-[#FFD700] py-2 hover:underline"
                >
                  {isSubmitting ? 'Submitting...' : 'Skip & Submit'}
                </button>
              </div>
            )}

            {step === 3 && (
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Want us to follow up?</h3>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full p-3 bg-black border border-[#FFD700] rounded text-white
                             placeholder:text-gray-500 focus:ring-2 focus:ring-[#FFD700] 
                             focus:border-transparent outline-none"
                />
                <button
                  onClick={handleSubmitFeedback}
                  disabled={isSubmitting}
                  className="mt-4 w-full bg-[#FFD700] text-black font-bold py-3 rounded-lg
                             hover:bg-[#FFD700]/90 transition disabled:opacity-50"
                >
                  {isSubmitting ? 'Sending...' : 'Send Feedback'}
                </button>
                <button
                  onClick={handleSubmitFeedback}
                  disabled={isSubmitting}
                  className="mt-2 w-full text-[#FFD700] py-2 hover:underline"
                >
                  Skip & Submit
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
