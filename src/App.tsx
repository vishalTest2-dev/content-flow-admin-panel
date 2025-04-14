
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login/Login";
import Register from "./pages/Login/Register";
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
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/quiz"
              element={
                <ProtectedRoute>
                  <QuizList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/quiz-category"
              element={
                <ProtectedRoute>
                  <QuizCategoryList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/blog"
              element={
                <ProtectedRoute>
                  <BlogList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/blog-category"
              element={
                <ProtectedRoute>
                  <BlogCategoryList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/links"
              element={
                <ProtectedRoute>
                  <LinkList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/change-password"
              element={
                <ProtectedRoute>
                  <ChangePassword />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
