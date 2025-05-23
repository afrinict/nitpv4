import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import NotFound from "./pages/not-found";
import Home from "./pages/home";
import Dashboard from "./pages/dashboard";
import Profile from "./pages/profile";
import Subscription from "./pages/subscription";
import Applications from "./pages/applications";
import ELearning from "./pages/e-learning";
import MemberTools from "./pages/member-tools";
import Chat from "./pages/chat";
import Directory from "./pages/directory";
import Elections from "./pages/elections";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/profile" component={Profile} />
      <Route path="/subscription" component={Subscription} />
      <Route path="/applications" component={Applications} />
      <Route path="/e-learning" component={ELearning} />
      <Route path="/member-tools" component={MemberTools} />
      <Route path="/chat" component={Chat} />
      <Route path="/directory" component={Directory} />
      <Route path="/elections" component={Elections} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
    </QueryClientProvider>
  );
}

export default App;
