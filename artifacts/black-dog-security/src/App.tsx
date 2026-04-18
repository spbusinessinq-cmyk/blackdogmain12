import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { setAuthTokenGetter } from "@workspace/api-client-react/custom-fetch";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import CommanderLogin from "@/pages/CommanderLogin";
import CommanderDashboard from "@/pages/CommanderDashboard";
import CommanderRequestDetail from "@/pages/CommanderRequestDetail";

const TOKEN_KEY = "bds_commander_token";

const queryClient = new QueryClient();

setAuthTokenGetter(() => sessionStorage.getItem(TOKEN_KEY));

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const token = sessionStorage.getItem(TOKEN_KEY);
  if (!token) return <Redirect to="/commander/login" />;
  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/commander/login" component={CommanderLogin} />
      <Route path="/commander/dashboard">
        {() => <ProtectedRoute component={CommanderDashboard} />}
      </Route>
      <Route path="/commander">
        {() => <ProtectedRoute component={CommanderDashboard} />}
      </Route>
      <Route path="/commander/requests/:id">
        {() => <ProtectedRoute component={CommanderRequestDetail} />}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <div className="dark">
            <Router />
          </div>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
