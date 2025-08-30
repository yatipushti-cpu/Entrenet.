import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Settings from "@/pages/settings";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import JobSeekerDashboard from "@/pages/job-seeker-dashboard";
import EmployerDashboard from "@/pages/employer-dashboard";
import JobListings from "@/pages/job-listings";
import Messages from "@/pages/messages";
import EditProfile from "@/pages/edit-profile";
import Login from "@/pages/login";

function Router() {
  const { isAuthenticated, isLoading, user } = useAuth();

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Switch>
      {!isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/job-seeker" component={JobSeekerDashboard} />
          <Route path="/employer" component={EmployerDashboard} />
          <Route path="/jobs" component={JobListings} />
          <Route path="/messages" component={Messages} />
          <Route path="/edit-profile" component={EditProfile} />
          <Route path="/settings" component={Settings} />
          <Route path="/create-job" component={() => import('./pages/create-job')} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider delayDuration={300}>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
