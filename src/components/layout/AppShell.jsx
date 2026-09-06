import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

import "./AppShell.css";

function AppShell({ children }) {
  return (
    <div className="app-shell">
      <Navbar />

      <div className="app-shell__body">
        <Sidebar />

        <main className="app-shell__content">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AppShell;