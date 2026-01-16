
import type { ReactNode } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAppSelector } from "./lib/store";
import AuthPage from "./pages/auth/Auth.tsx";
import { ROUTES } from "./config/routes";
import RootLayout from "./components/layout/RootLayout";
import Dashboard from "./pages/Dashboard";
import Workspaces from "./pages/workspaces/Workspaces";
import WorkspaceDetails from "./pages/projects/WorkspaceDetails.tsx";
import ProjectDetails from "./pages/projects/ProjectDetails.tsx";
import TaskDetailsPage from "./pages/tasks/TaskDetailsPage.tsx";
import ProfileSettings from "./pages/profile/profileSettings.tsx";
import MyTasksPage from "./pages/tasks/MyTasksPage.tsx";
import PaymentPage from "./pages/payment/paymentPage.tsx";
import { Toaster } from "sonner";

// Protected Route Component
const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  
  if (!isAuthenticated) {
     return <Navigate to={ROUTES.AUTH.SIGN_IN} replace />;
  }

  return children;
}

// ... imports

function App() {
  return (
    <BrowserRouter>

      <Toaster position="top-center" richColors
      duration={2000}
      theme="system"
      />
      <Routes>
        <Route path={ROUTES.AUTH.SIGN_IN} element={<AuthPage />} />
        <Route path={ROUTES.AUTH.SIGN_UP} element={<AuthPage />} />
        
        {/* Default redirect */}
        <Route path="/" element={<Navigate to={ROUTES.AUTH.SIGN_IN} replace />} />

        {/* Protected Routes */}
        <Route
          element={
            <ProtectedRoute>
              <RootLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/workspaces" element={<Workspaces />} />
          <Route path="/workspace/:workspaceId" element={<WorkspaceDetails />} />
          <Route path="/projects/:projectId" element={<ProjectDetails />} />
          <Route path="/task/:taskId" element={<TaskDetailsPage />} />
          <Route path="/profile" element={<ProfileSettings />} />
          <Route path="/my-tasks" element={<MyTasksPage />} />
          <Route path="/payment" element={<PaymentPage />} />
        </Route>
        
        {/* Catch all */}
         <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
