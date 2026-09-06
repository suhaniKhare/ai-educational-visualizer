import AppShell from "../components/layout/AppShell";
import routes from "./routes";

function App() {
  const currentPath = window.location.pathname;

  const currentRoute =
    routes.find((route) => route.path === currentPath) ||
    routes[0];

  return (
    <AppShell>
      {currentRoute.element}
    </AppShell>
  );
}

export default App;