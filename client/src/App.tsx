import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import Home from "@/pages/Home";
import About from "@/pages/About";
import Services from "@/pages/Services";
import Blog from "@/pages/Blog";
import Contact from "@/pages/Contact";

import DashboardHome from "@/pages/dashboard/DashboardHome";
import DashboardOpportunities from "@/pages/dashboard/Opportunities";
import ContentPipeline from "@/pages/dashboard/ContentPipeline";
import DashboardCosts from "@/pages/dashboard/Costs";
import DashboardAgents from "@/pages/dashboard/Agents";
import DashboardHrCases from "@/pages/dashboard/HrCases";
import DashboardSettings from "@/pages/dashboard/DashboardSettings";

import InsidersHome from "@/pages/insiders/InsidersHome";
import InsiderListings from "@/pages/insiders/Listings";
import InsiderMarket from "@/pages/insiders/Market";
import InsiderInsights from "@/pages/insiders/Insights";
import InsiderProfile from "@/pages/insiders/Profile";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/services" component={Services} />
      <Route path="/blog" component={Blog} />
      <Route path="/contact" component={Contact} />

      <Route path="/dashboard" component={DashboardHome} />
      <Route path="/dashboard/opportunities" component={DashboardOpportunities} />
      <Route path="/dashboard/content" component={ContentPipeline} />
      <Route path="/dashboard/costs" component={DashboardCosts} />
      <Route path="/dashboard/agents" component={DashboardAgents} />
      <Route path="/dashboard/hr" component={DashboardHrCases} />
      <Route path="/dashboard/settings" component={DashboardSettings} />

      <Route path="/insiders" component={InsidersHome} />
      <Route path="/insiders/listings" component={InsiderListings} />
      <Route path="/insiders/market" component={InsiderMarket} />
      <Route path="/insiders/insights" component={InsiderInsights} />
      <Route path="/insiders/profile" component={InsiderProfile} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
