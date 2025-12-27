import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/dashboard/DashboardPage";
import BooksPage from "@/pages/dashboard/BooksPage";
import CategoriesPage from "@/pages/dashboard/CategoriesPage";
import UsersPage from "@/pages/dashboard/UsersPage";
import EmpruntsPage from "@/pages/dashboard/EmpruntsPage";
import MyEmpruntsPage from "@/pages/dashboard/MyEmpruntsPage";
import ClientBooksPage from "@/pages/dashboard/ClientBooksPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ 
  children, 
  allowedRoles 
}: { 
  children: React.ReactNode; 
  allowedRoles?: string[] 
}) {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
}

function AppRoutes() {
  const { user } = useAuth();
  
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<DashboardPage />} />
        
        {/* Books Route - Different page based on role */}
        <Route
          path="books"
          element={
            user?.role === 'ADMIN' ? (
              <BooksPage />
            ) : user?.role === 'CLIENT' ? (
              <ClientBooksPage />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />
        <Route
          path="categories"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <CategoriesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="users"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <UsersPage />
            </ProtectedRoute>
          }
        />
        
        {/* Responsable Routes */}
        <Route
          path="emprunts"
          element={
            <ProtectedRoute allowedRoles={['RESPONSABLE']}>
              <EmpruntsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="my-emprunts"
          element={
            <ProtectedRoute allowedRoles={['CLIENT']}>
              <MyEmpruntsPage />
            </ProtectedRoute>
          }
        />
      </Route>
      
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
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
