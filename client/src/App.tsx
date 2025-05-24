import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Public pages
import NotFound from "./pages/not-found";
import Home from "./pages/home";
import Login from "./pages/login";

// Member pages
import Dashboard from "./pages/dashboard";
import Profile from "./pages/profile";
import Subscription from "./pages/subscription";
import Applications from "./pages/applications";
import ELearning from "./pages/e-learning";
import MemberTools from "./pages/member-tools";
import Chat from "./pages/chat";
import Directory from "./pages/directory";
import Elections from "./pages/elections";

// Role-specific dashboard pages (to be created later)
import AdminDashboard from "./pages/admin-dashboard";
import EthicsDashboard from "./pages/ethics-dashboard";
import FinanceDashboard from "./pages/finance-dashboard";
import Unauthorized from "./pages/unauthorized";
import SubmitComplaint from "./pages/submit-complaint";

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/submit-complaint" component={SubmitComplaint} />
      <Route path="/unauthorized" component={Unauthorized} />
      
      {/* Protected Member Routes */}
      <Route path="/dashboard">
        {() => <ProtectedRoute component={Dashboard} roles="MEMBER" />}
      </Route>
      <Route path="/profile">
        {() => <ProtectedRoute component={Profile} />}
      </Route>
      <Route path="/subscription">
        {() => <ProtectedRoute component={Subscription} />}
      </Route>
      <Route path="/applications">
        {() => <ProtectedRoute component={Applications} />}
      </Route>
      <Route path="/e-learning">
        {() => <ProtectedRoute component={ELearning} />}
      </Route>
      <Route path="/member-tools">
        {() => <ProtectedRoute component={MemberTools} />}
      </Route>
      <Route path="/chat">
        {() => <ProtectedRoute component={Chat} />}
      </Route>
      <Route path="/directory">
        {() => <ProtectedRoute component={Directory} />}
      </Route>
      <Route path="/elections">
        {() => <ProtectedRoute component={Elections} />}
      </Route>
      
      {/* Admin Routes */}
      <Route path="/admin-dashboard">
        {() => <ProtectedRoute component={AdminDashboard} roles="ADMINISTRATOR" />}
      </Route>
      
      {/* Ethics Officer Routes */}
      <Route path="/ethics-dashboard">
        {() => <ProtectedRoute component={EthicsDashboard} roles="ETHICS_OFFICER" />}
      </Route>
      
      {/* Finance Routes */}
      <Route path="/finance-dashboard">
        {() => (
          <ProtectedRoute 
            component={FinanceDashboard}
            roles={["FINANCIAL_ADMINISTRATOR", "FINANCIAL_OFFICER", "FINANCIAL_AUDITOR"]}
          />
        )}
      </Route>
      
      {/* Fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
