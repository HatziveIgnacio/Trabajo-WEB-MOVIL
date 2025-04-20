import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { useEffect } from "react";

// This is a simple redirect to the Ionic app running on port 3000
function IonicRedirect() {
  useEffect(() => {
    window.location.href = "http://0.0.0.0:3000";
  }, []);
  
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50">
      <div className="text-2xl font-bold mb-4">Redirecting to Ionic Application...</div>
      <div className="text-lg text-gray-600">
        If you are not redirected automatically, please{" "}
        <a href="http://0.0.0.0:3000" className="text-blue-500 hover:underline">
          click here
        </a>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={IonicRedirect} />
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
