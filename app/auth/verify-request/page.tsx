import Image from "next/image";

export default function VerifyRequestPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-8">
        <Image
          src="/fcm-logo.png"
          alt="FCM Intelligence"
          width={200}
          height={60}
          className="mx-auto mb-8"
          priority
        />

        <div className="p-6 bg-gray-900 border border-[#FFD700] rounded-lg">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-[#FFD700]/20 mb-4">
            <svg
              className="h-6 w-6 text-[#FFD700]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-white mb-2">
            Check Your Email
          </h1>

          <p className="text-gray-400">
            A sign-in link has been sent to your email address.
            <br />
            Click the link to complete your sign-in.
          </p>
        </div>

        <p className="text-sm text-gray-500">
          You can close this window and check your email.
        </p>
      </div>
    </div>
  );
}
