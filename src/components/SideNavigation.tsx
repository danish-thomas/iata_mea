import { NavLink } from "react-router-dom";
import {
  Boxes,
  ChevronLeft,
  ChevronRight,
  Gauge,
  PanelsTopLeft,
  UserRound,
} from "lucide-react";
import iataLogo from "../assets/images/iata-logo.png";
import "./SideNavigation.css";

interface SideNavigationProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navigationItems = [
  { label: "System Performance Dashboard", path: "/", Icon: Gauge },
  { label: "Profile Management", path: "/listing", Icon: UserRound },
  { label: "Airlines", path: "/airlines", Icon: Boxes },
  { label: "Freight Forwarders", path: "/FreightForwarders", Icon: PanelsTopLeft },
];

export default function SideNavigation({
  collapsed,
  onToggle,
}: SideNavigationProps) {
  return (
    <aside
      className={`side-navigation${collapsed ? " side-navigation--collapsed" : ""}`}
      aria-label="Main navigation"
    >
      <div className="side-navigation__brand">
        <img src={iataLogo} alt="IATA" />
        {/* {!collapsed && (
          <span className="side-navigation__logo-placeholder">
            Placeholder for<br />secondary logo
          </span>
        )} */}
      </div>

      <button
        className="side-navigation__toggle"
        type="button"
        onClick={onToggle}
        aria-label={collapsed ? "Expand navigation" : "Collapse navigation"}
        aria-expanded={!collapsed}
        title={collapsed ? "Expand navigation" : "Collapse navigation"}
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      <nav className="side-navigation__links">
        {navigationItems.map(({ label, path, Icon }) => (
          <NavLink
            key={path}
            to={path}
            end
            className={({ isActive }) =>
              `side-navigation__link${isActive ? " side-navigation__link--active" : ""}`
            }
            title={collapsed ? label : undefined}
          >
            <span className="side-navigation__icon">
              <Icon size={15} strokeWidth={1.8} aria-hidden="true" />
            </span>
            {!collapsed && (
              <span className="side-navigation__label">{label}</span>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}