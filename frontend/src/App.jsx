import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import useAuthStore from './store/authStore';
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TreeView from './pages/TreeView';
import TreeEditor from './pages/TreeEditor';
import PersonProfile from './pages/PersonProfile';
import TreeSettings from './pages/TreeSettings';
import RelationshipCalculator from './pages/RelationshipCalculator';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminRoles from './pages/AdminRoles';
import AdminTrees from './pages/AdminTrees';
import AdminActivityLog from './pages/AdminActivityLog';
import PublicTrees from './pages/PublicTrees';
import PublicTreeView from './pages/PublicTreeView';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30000 },
  },
});

function ProtectedRoute({ children }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function GuestRoute({ children }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
}

function AdminRoute({ children }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isAdmin = useAuthStore((s) => s.isAdmin);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin()) return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />

          {/* Main App Routes */}
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="trees/:treeSlug" element={<TreeView />} />
            <Route path="trees/:treeSlug/editor" element={<TreeEditor />} />
            <Route path="trees/:treeSlug/persons/:personId" element={<PersonProfile />} />
            <Route path="trees/:treeSlug/settings" element={<TreeSettings />} />
            <Route path="trees/:treeSlug/relationships" element={<RelationshipCalculator />} />
          </Route>

          {/* Public Tree View (no auth required) */}
          <Route path="public" element={<Navigate to="/" replace />} />
          <Route path="public/" element={<Navigate to="/" replace />} />
          <Route path="public/trees" element={<PublicTrees />} />
          <Route path="public/trees/:treeSlug" element={<PublicTreeView />} />

          {/* Admin Routes */}
          <Route element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="admin/users" element={<AdminUsers />} />
            <Route path="admin/roles" element={<AdminRoles />} />
            <Route path="admin/trees" element={<AdminTrees />} />
            <Route path="admin/activity" element={<AdminActivityLog />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
