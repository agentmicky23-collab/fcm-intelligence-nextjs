'use client';

import { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import FeedbackModal from './FeedbackModal';

export default function FeedbackButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [shouldShow, setShouldShow] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Don't show on auth pages
    if (window.location.pathname.startsWith('/auth')) {
      return;
    }

    setShouldShow(true);

    // Check if we should show the smart trigger
    const feedbackState = localStorage.getItem('fcm_feedback_state');
    const state = feedbackState ? JSON.parse(feedbackState) : {
      pageViews: 0,
      sessionStart: Date.now(),
      hasSubmitted: false
    };

    // Don't show if already submitted this session
    if (state.hasSubmitted) {
      return;
    }

    // Track page views
    state.pageViews += 1;
    localStorage.setItem('fcm_feedback_state', JSON.stringify(state));

    // Show prompt after 5+ page views
    if (state.pageViews >= 5) {
      setTimeout(() => setShowPrompt(true), 1000);
      return;
    }

    // Show prompt after 3+ minutes
    const timeSpent = Date.now() - state.sessionStart;
    if (timeSpent >= 180000) { // 3 minutes
      setTimeout(() => setShowPrompt(true), 1000);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setShowPrompt(false);
  };

  const handleSubmit = () => {
    // Mark as submitted
    const feedbackState = localStorage.getItem('fcm_feedback_state');
    const state = feedbackState ? JSON.parse(feedbackState) : {};
    state.hasSubmitted = true;
    localStorage.setItem('fcm_feedback_state', JSON.stringify(state));
    setShowPrompt(false);
  };

  if (!shouldShow) return null;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-50 
                   bg-black border border-[#FFD700] text-[#FFD700] 
                   px-3 py-6 rounded-l-lg shadow-lg
                   hover:bg-[#FFD700] hover:text-black transition-all
                   flex items-center gap-2 text-sm font-medium
                   group"
        style={{ writingMode: 'vertical-rl' }}
      >
        <MessageCircle className="w-4 h-4 group-hover:animate-bounce" />
        <span className="hidden md:block">Feedback?</span>
      </button>

      {showPrompt && !isOpen && (
        <div className="fixed right-16 top-1/2 -translate-y-1/2 z-40
                        bg-[#FFD700] text-black px-4 py-2 rounded-lg shadow-xl
                        animate-pulse">
          <p className="text-sm font-medium">How's your experience? 💛</p>
        </div>
      )}

      <FeedbackModal 
        isOpen={isOpen} 
        onClose={handleClose}
        onSubmit={handleSubmit}
      />
    </>
  );
}
