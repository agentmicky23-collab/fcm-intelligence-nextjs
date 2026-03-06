import { InsidersSidebar } from "./InsidersHome";
import { Bookmark } from "lucide-react";

export default function InsiderProfile() {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <InsidersSidebar active="/insiders/profile" />
      <main className="flex-1 overflow-y-auto p-6 md:p-8 max-w-3xl">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>

        <div className="fcm-card mb-8">
          <h2 className="text-xl font-bold mb-6">Account Details</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-border">
              <span className="text-sm text-muted-foreground">Name</span>
              <span className="font-medium">FCM Partner</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-border">
              <span className="text-sm text-muted-foreground">Email</span>
              <span className="font-medium font-mono text-sm">partner@example.com</span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-sm text-muted-foreground">Member Since</span>
              <span className="font-financial">Mar 2026</span>
            </div>
          </div>
        </div>

        <div className="fcm-card mb-8">
          <h2 className="text-xl font-bold mb-6">Notification Preferences</h2>
          <div className="space-y-4">
            {["New Opportunity Alerts", "Weekly Market Digest", "Content Updates"].map(pref => (
              <div key={pref} className="flex items-center justify-between py-2">
                <span className="text-sm">{pref}</span>
                <div className="w-12 h-6 rounded-full bg-gold relative cursor-pointer">
                  <span className="absolute top-0.5 translate-x-6 w-5 h-5 rounded-full bg-black transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="fcm-card">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Bookmark size={20} className="text-gold" /> Saved Listings
          </h2>
          <div className="text-center py-12 text-muted-foreground border border-dashed border-border rounded-lg">
            <Bookmark size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">No saved listings yet.</p>
            <p className="text-xs mt-1">Bookmark opportunities from the listings page to save them here.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
