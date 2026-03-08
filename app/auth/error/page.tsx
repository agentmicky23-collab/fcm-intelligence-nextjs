import Image from "next/image";
import Link from "next/link";

export default function ErrorPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const errorMessages: Record<string, string> = {
    Configuration: "There is a problem with the server configuration.",
    AccessDenied: "You do not have permission to sign in.",
    Verification: "The sign-in link is no longer valid.",
    Default: "An error occurred during sign-in.",
  };

  const error = searchParams.error || "Default";
  const message = errorMessages[error] || errorMessages.Default;

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

        <div className="p-6 bg-gray-900 border border-red-500 rounded-lg">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-500/20 mb-4">
            <svg
              className="h-6 w-6 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-white mb-2">
            Authentication Error
          </h1>

          <p className="text-gray-400 mb-6">{message}</p>

          <Link
            href="/auth/signin"
            className="inline-block px-6 py-3 bg-[#FFD700] text-black font-medium rounded-lg hover:bg-[#FFC700] transition-colors"
          >
            Try Again
          </Link>
        </div>
      </div>
    </div>
  );
}
