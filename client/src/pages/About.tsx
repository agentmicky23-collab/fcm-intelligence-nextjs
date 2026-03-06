import { AppLayout } from "@/components/layout/AppLayout";
import { Link } from "wouter";

export default function About() {
  return (
    <AppLayout>
      <div className="pt-32 pb-20 container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-8 tracking-tight">
            The Story Behind <span className="text-gold">FCM</span>
          </h1>
          
          <div className="max-w-none">
            <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
              Founded by Mikesh Parekh, FCM represents over 17 years of deep, operational experience in the UK retail and Post Office sector. What began as a single branch has evolved into an intelligence-driven network spanning more than 40 locations.
            </p>

            <blockquote className="border-l-4 border-gold pl-6 py-2 mb-12 bg-card/30 rounded-r-lg">
              <p className="text-2xl font-medium text-white italic leading-snug">
                "Our approach isn't just about managing branches; it's about engineering a system where data, experience, and rigorous standards compound to create undeniable market advantage."
              </p>
              <footer className="mt-4 text-gold font-medium">— Mikesh Parekh, Founder</footer>
            </blockquote>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 my-16">
              <div>
                <h3 className="text-2xl font-bold mb-4 text-white">Our Mission</h3>
                <p className="text-muted-foreground">
                  To professionalize and scale the independent retail sector through technology, rigorous operational standards, and shared intelligence, enabling franchise operators to maximize their portfolio value.
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-4 text-white">Our Edge</h3>
                <p className="text-muted-foreground">
                  We combine boots-on-the-ground operational reality with advanced data scraping and AI-driven analysis. We don't just react to the market; we anticipate it.
                </p>
              </div>
            </div>

            <h2 className="text-3xl font-bold mb-8 mt-16 text-white border-b border-border pb-4">Core Values</h2>
            
            <div className="space-y-8">
              <div className="fcm-card">
                <h4 className="text-xl font-bold text-gold mb-2">1. Uncompromising Standards</h4>
                <p className="text-muted-foreground">Excellence is not an aspiration; it is the baseline. We apply rigorous operational discipline to every aspect of the business, from customer service to financial compliance.</p>
              </div>
              <div className="fcm-card">
                <h4 className="text-xl font-bold text-gold mb-2">2. Data-Driven Clarity</h4>
                <p className="text-muted-foreground">We rely on hard numbers and market intelligence over intuition. Every decision, acquisition, and operational tweak is backed by comprehensive data analysis.</p>
              </div>
              <div className="fcm-card">
                <h4 className="text-xl font-bold text-gold mb-2">3. Strategic Agility</h4>
                <p className="text-muted-foreground">The retail landscape shifts rapidly. We move with speed and precision, leveraging technology and deep networks to capitalize on opportunities before they become obvious.</p>
              </div>
            </div>

            <div className="mt-16 p-8 bg-card border border-gold/30 rounded-lg text-center">
              <h3 className="text-2xl font-bold mb-4 text-white">Ready to elevate your operations?</h3>
              <p className="text-muted-foreground mb-6">Connect with us to discuss bespoke support packages.</p>
              <Link href="/contact" className="btn-primary" data-testid="button-contact-cta">
                Contact Our Team
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
