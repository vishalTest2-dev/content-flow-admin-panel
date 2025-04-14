
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import QuizList from "./pages/Quiz/QuizList";
import QuizCategoryList from "./pages/QuizCategory/QuizCategoryList";
import BlogList from "./pages/Blog/BlogList";
import BlogCategoryList from "./pages/BlogCategory/BlogCategoryList";
import LinkList from "./pages/Link/LinkList";
import Settings from "./pages/Settings/Settings";
import Profile from "./pages/Profile/Profile";
import ChangePassword from "./pages/Profile/ChangePassword";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/quiz" element={<QuizList />} />
          <Route path="/quiz-category" element={<QuizCategoryList />} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog-category" element={<BlogCategoryList />} />
          <Route path="/links" element={<LinkList />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
