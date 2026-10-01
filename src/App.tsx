import { useState } from "react";
import { useLocation } from "react-router-dom";
import SideNavigation from "./components/SideNavigation";
import AppRoutes from "./routes/AppRoutes";
import "./App.css";

function App() {
  const location = useLocation();
  const [navigationCollapsed, setNavigationCollapsed] = useState(false);
  const navigationPaths = ["/", "/listing", "/airlines", "/FreightForwarders"];
  const showNavigation = navigationPaths.includes(location.pathname);

  if (!showNavigation) {
    return <AppRoutes />;
  }

  return (
    <div className="app-shell">
      <SideNavigation
        collapsed={navigationCollapsed}
        onToggle={() => setNavigationCollapsed((collapsed) => !collapsed)}
      />
      <div className="app-shell__content">
        <AppRoutes />
      </div>
    </div>
  );
}

export default App;
