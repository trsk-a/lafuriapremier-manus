import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Jornadas from "./pages/Jornadas";
import MatchDetail from "./pages/MatchDetail";
import Planes from "./pages/Planes";
import Rumores from "./pages/Rumores";
import Noticias from "./pages/Noticias";
import Fichajes from "./pages/Fichajes";
import RadarLatino from "./pages/RadarLatino";
import TalentoIberico from "./pages/TalentoIberico";
import Jugadores from "./pages/Jugadores";
import PlayerProfile from "./pages/PlayerProfile";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminModeration from "./pages/admin/Moderation";
import AnalisisTactico from "./pages/AnalisisTactico";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/jornadas"} component={Jornadas} />
      <Route path={"/partido/:id"} component={MatchDetail} />
      <Route path={"/planes"} component={Planes} />
      <Route path={"/rumores"} component={Rumores} />
      <Route path={"/noticias"} component={Noticias} />
      <Route path={"/fichajes"} component={Fichajes} />
      <Route path={"/radar-latino"} component={RadarLatino} />
      <Route path={"/talento-iberico"} component={TalentoIberico} />
      <Route path={"/jugadores"} component={Jugadores} />
      <Route path={"/jugador/:id"} component={PlayerProfile} />
      <Route path={"/admin"} component={AdminDashboard} />
      <Route path={"/admin/moderacion"} component={AdminModeration} />
      <Route path={"/analisis-tactico"} component={AnalisisTactico} />
      <Route path={"/404"} component={NotFound} />
      {/* TODO: Add more routes here */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="dark"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
