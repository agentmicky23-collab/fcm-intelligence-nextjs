"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import Image from "next/image";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [magicLinkEmail, setMagicLinkEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMagicLinkLoading, setIsMagicLinkLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: "/insiders",
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else if (result?.ok) {
        window.location.href = "/insiders";
      }
    } catch (error) {
      console.error("Sign-in error:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMagicLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsMagicLinkLoading(true);

    try {
      await signIn("email", {
        email: magicLinkEmail,
        redirect: false,
        callbackUrl: "/insiders",
      });
      setIsSubmitted(true);
    } catch (error) {
      console.error("Magic link error:", error);
    } finally {
      setIsMagicLinkLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Logo */}
        <div className="text-center">
          <Image
            src="/fcm-logo.png"
            alt="FCM Intelligence"
            width={200}
            height={60}
            className="mx-auto mb-8"
            priority
          />
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome to FCM Intelligence
          </h1>
          <p className="text-gray-400">
            Sign in to access exclusive franchise insights
          </p>
        </div>

        {/* Credentials Login Form (Always visible) */}
        <form onSubmit={handleCredentialsSubmit} className="mt-8 space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none relative block w-full px-4 py-3 border border-gray-700 bg-gray-900 text-white placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="appearance-none relative block w-full px-4 py-3 border border-gray-700 bg-gray-900 text-white placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent"
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-black bg-[#FFD700] hover:bg-[#FFC700] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FFD700] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        {/* Magic Link Section (Optional - only shows if EMAIL_SERVER configured) */}
        {process.env.NEXT_PUBLIC_ENABLE_MAGIC_LINK === "true" && !isSubmitted && (
          <>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-black text-gray-400">Or</span>
              </div>
            </div>

            <form onSubmit={handleMagicLinkSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="magic-email"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Sign in with Magic Link
                </label>
                <input
                  id="magic-email"
                  name="magic-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={magicLinkEmail}
                  onChange={(e) => setMagicLinkEmail(e.target.value)}
                  className="appearance-none relative block w-full px-4 py-3 border border-gray-700 bg-gray-900 text-white placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent"
                  placeholder="you@example.com"
                />
              </div>

              <button
                type="submit"
                disabled={isMagicLinkLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-gray-700 text-sm font-medium rounded-lg text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FFD700] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isMagicLinkLoading ? "Sending magic link..." : "Send Magic Link"}
              </button>

              <p className="text-center text-sm text-gray-400">
                We'll send you a secure magic link to sign in.
                <br />
                No password needed.
              </p>
            </form>
          </>
        )}

        {isSubmitted && (
          <div className="mt-8 p-6 bg-gray-900 border border-[#FFD700] rounded-lg">
            <div className="text-center">
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
              <h3 className="text-lg font-medium text-white mb-2">
                Check Your Email
              </h3>
              <p className="text-gray-400">
                We've sent a magic link to <strong className="text-white">{magicLinkEmail}</strong>
                <br />
                Click the link to sign in.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
