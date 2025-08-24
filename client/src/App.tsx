import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import Home from "@/pages/Home";
import Forecast from "@/pages/Forecast";
import Locations from "@/pages/Locations";
import Analytics from "@/pages/Analytics";
import Calendar from "@/pages/Calendar";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/forecast" component={Forecast} />
      <Route path="/locations" component={Locations} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/calendar" component={Calendar} />
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
