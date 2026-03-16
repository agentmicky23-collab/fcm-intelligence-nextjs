export default function FeedbackPage() {
  return (
    <div className="min-h-screen bg-black text-white py-20">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-4">We Value Your Feedback</h1>
        <p className="text-gray-400 mb-8">Help us improve your experience</p>
        {/* Use the same FeedbackModal component styled as a page */}
        <div className="bg-zinc-900 p-8 rounded-lg">
          <p className="text-gray-400">Feedback form coming soon</p>
        </div>
      </div>
    </div>
  );
}
