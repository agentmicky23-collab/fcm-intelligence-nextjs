import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

// Pages
import Home from "@/pages/Home";
import About from "@/pages/About";
import Services from "@/pages/Services";
// We will create these shortly
import DashboardHome from "@/pages/dashboard/DashboardHome";
import InsidersHome from "@/pages/insiders/InsidersHome";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/services" component={Services} />
      {/* 
      <Route path="/blog" component={Blog} />
      <Route path="/contact" component={Contact} /> 
      */}
      
      <Route path="/dashboard" component={DashboardHome} />
      <Route path="/insiders" component={InsidersHome} />

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
