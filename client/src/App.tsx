import React from 'react';
import { Route, Switch } from 'wouter';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { UserRole } from './types/user';
import Marquee from './components/Marquee';

// Public pages
import NotFound from "./pages/not-found";
import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import Executives from "./pages/executives";
import Events from "./pages/events";
import About from "./pages/about";
import Contact from "./pages/contact";
import Logout from "./pages/admin/logout";

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
import SarApplication from "./pages/sar/application";

// Admin pages
import AdminDashboard from "./pages/admin/dashboard";
import AdminUsers from "./pages/admin/users";
import AdminSARApplications from "./pages/admin/sar-applications";
import AdminEIARApplications from "./pages/admin/eiar-applications";
import AdminSubscriptions from "./pages/admin/subscriptions";
import AdminContent from "./pages/admin/content-management";
import AdminComplaints from "./pages/admin/complaints";
import AdminELearning from "./pages/admin/e-learning";
import AdminSettings from "./pages/admin/site-settings";
import AdminAnalytics from "./pages/admin/analytics";
import AdminProfile from "./pages/admin/profile";

// Ethics pages
import EthicsDashboard from "./pages/ethics/dashboard";

// Finance pages
import FinanceDashboard from "./pages/finance-dashboard";

const App = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AuthProvider>
        <Marquee />
        <main className="container mx-auto px-4 py-8">
          <Switch>
            {/* Public Routes */}
            <Route path="/" component={Home} />
            <Route path="/about" component={About} />
            <Route path="/events" component={Events} />
            <Route path="/executives" component={Executives} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/contact" component={Contact} />
            <Route path="/logout" component={Logout} />

            {/* Private Routes */}
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/profile" component={Profile} />
            <Route path="/subscription" component={Subscription} />
            <Route path="/applications" component={Applications} />
            <Route path="/sar/application" component={SarApplication} />
            <Route path="/e-learning" component={ELearning} />
            <Route path="/member-tools" component={MemberTools} />
            <Route path="/chat" component={Chat} />
            <Route path="/directory" component={Directory} />
            <Route path="/elections" component={Elections} />

            {/* Admin Routes */}
            <Route path="/admin/dashboard" component={AdminDashboard} />
            <Route path="/admin/users" component={AdminUsers} />
            <Route path="/admin/sar-applications" component={AdminSARApplications} />
            <Route path="/admin/eiar-applications" component={AdminEIARApplications} />
            <Route path="/admin/subscriptions" component={AdminSubscriptions} />
            <Route path="/admin/content" component={AdminContent} />
            <Route path="/admin/complaints" component={AdminComplaints} />
            <Route path="/admin/e-learning" component={AdminELearning} />
            <Route path="/admin/settings" component={AdminSettings} />
            <Route path="/admin/analytics" component={AdminAnalytics} />
            <Route path="/admin/profile" component={AdminProfile} />

            {/* Ethics Routes */}
            <ProtectedRoute 
              path="/ethics-dashboard" 
              component={EthicsDashboard} 
              roles={[UserRole.ETHICS_OFFICER]} 
            />

            {/* Finance Routes */}
            <ProtectedRoute 
              path="/finance-dashboard" 
              component={FinanceDashboard} 
              roles={[UserRole.FINANCIAL_OFFICER, UserRole.FINANCIAL_ADMINISTRATOR]} 
            />

            {/* 404 Route */}
            <Route component={NotFound} />
          </Switch>
        </main>
      </AuthProvider>
    </div>
  );
};

export default App;
