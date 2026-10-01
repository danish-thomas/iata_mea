import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  Club,
  Home,
  Moon,
  UserRoundCog,
} from "lucide-react";
import iataLogo from "../../../assets/images/iata-logo.png";
import "../../../components/HeaderNew.css";

const REPORTS_CHILDREN = [
  {
    label: "List of Airlines and Airports",
    path: "/reports/airlines-and-airports",
  },
  {
    label: "List of Freight Forwarders and Affiliates",
    path: "/reports/freight-forwarders-and-affiliates",
  },
];

export default function FreightForwarderHeader() {
  const [reportsOpen, setReportsOpen] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isReportsActive = REPORTS_CHILDREN.some(
    (child) => child.path && pathname === child.path,
  );

  return (
    <header className="header_wrapper freight-forwarder-header">
      <div className="header-inner">
        <img className="freight-forwarder-header__logo" src={iataLogo} alt="IATA" />
        <nav className="header-nav">
          <button
            type="button"
            className="header-home-link"
            onClick={() => navigate("/")}
            aria-label="Home"
            title="Home"
          >
            <Home size={14} strokeWidth={1.7} aria-hidden="true" />
          </button>

          <a
            href="#"
            onClick={(event) => event.preventDefault()}
            className="header-nav-link"
          >
            Dashboard
          </a>

          <a
            href="#"
            onClick={(event) => {
              event.preventDefault();
              navigate("/new-registration");
            }}
            className={`header-nav-link${
              pathname === "/new-registration" ? " header-nav-link--active" : ""
            }`}
          >
            New Registration
            {pathname === "/new-registration" && (
              <span className="header-nav-indicator" />
            )}
          </a>

          <div
            className={`header-nav-dropdown ${
              reportsOpen ? "header-nav-dropdown--open" : ""
            }`}
            onMouseEnter={() => setReportsOpen(true)}
            onMouseLeave={() => setReportsOpen(false)}
          >
            <button
              type="button"
              className={`header-nav-link header-nav-dropdown-trigger ${
                isReportsActive ? "header-nav-link--active" : ""
              }`}
              onClick={() => setReportsOpen((previous) => !previous)}
            >
              <span>Reports</span>

              <ChevronDown
                size={14}
                className={reportsOpen ? "header-dropdown-arrow--open" : ""}
              />

              {isReportsActive && <span className="header-nav-indicator" />}
            </button>

            {reportsOpen && (
              <div className="header-submenu">
                {REPORTS_CHILDREN.map((child) => (
                  <a
                    key={child.label}
                    href="#"
                    className={`header-submenu-link ${
                      child.path && pathname === child.path
                        ? "header-submenu-link--active"
                        : ""
                    }`}
                    onClick={(event) => {
                      event.preventDefault();
                      if (child.path) {
                        navigate(child.path);
                      }
                      setReportsOpen(false);
                    }}
                  >
                    {child.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </nav>

        <div className="header-right">
          <button
            type="button"
            className="freight-forwarder-header__switch-button"
            onClick={() => navigate("/")}
          >
            <UserRoundCog size={15} aria-hidden="true" />
            Role Management
          </button>
          <button
            type="button"
            className="freight-forwarder-header__utility-button"
            aria-label="Toggle dark mode"
            title="Toggle dark mode"
          >
            <Moon size={13} strokeWidth={1.8} aria-hidden="true" />
          </button>
          <button
            type="button"
            className="freight-forwarder-header__utility-button"
            aria-label="Club"
            title="Club"
          >
            <Club size={16} strokeWidth={1.8} aria-hidden="true" />
          </button>

          <div className="header-user">
            <img className="header-avatar" src="../assets/images/Avatar.png" alt="Jane Doe" />
            <span className="header-username">Jane Doe</span>
          </div>
        </div>
      </div>
    </header>
  );
}
