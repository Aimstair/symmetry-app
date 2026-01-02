import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/layouts/AppLayout";
import Dashboard from "./pages/Dashboard";
import WorkoutPlan from "./pages/WorkoutPlan";
import ActiveWorkout from "./pages/ActiveWorkout";
import PhysiqueScan from "./pages/PhysiqueScan";
import Progress from "./pages/Progress";
import SymmetryHistory from "./pages/SymmetryHistory";
import Settings from "./pages/Settings";
import Onboarding from "./pages/Onboarding";
import Install from "./pages/Install";
import NotFound from "./pages/NotFound";
import { useAppStore } from "./store/useAppStore";

const queryClient = new QueryClient();

function AppRoutes() {
  const { onboarding } = useAppStore();

  // Show onboarding if not completed
  if (!onboarding.completed) {
    return (
      <Routes>
        <Route path="/install" element={<Install />} />
        <Route path="*" element={<Onboarding />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/workout" element={<WorkoutPlan />} />
        <Route path="/scan" element={<PhysiqueScan />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/symmetry" element={<SymmetryHistory />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
      <Route path="/workout/active" element={<ActiveWorkout />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/install" element={<Install />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
