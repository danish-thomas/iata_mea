import { useEffect, useRef, useState } from "react";
import { Bell, ChevronDown, Repeat2, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
// import IataHeaderLogo from "./iata-logo-header.svg";
import "./HeaderNew.css";
import NotificationPopup, {
  NotificationItem,
} from "./notification/NotificationPopup";

interface NavItem {
  label: string;
  active?: boolean;
  dropdown?: boolean;
  type: string;
  children?: {
    label: string;
    page: string;
  }[];
}

const NAV_ITEMS: NavItem[] = [
  { label: "Public Reports", type: "iata" },
  { label: "Registered Users Reports", type: "iata" },

  { label: "Reports", type: "airline" },
  { label: "Manage eAWB Status", type: "airline" },

  {
    label: "Activation Notices",
    type: "airline",
    dropdown: true,
    children: [
      {
        label: "Create",
        page: "Activation Notice Create",
      },
      {
        label: "De-activate",
        page: "Activation Notice De-activate",
      },
      {
        label: "View Status",
        page: "Activation Notice View Status",
      },
      {
        label: "View History",
        page: "Activation Notice View History",
      },
    ],
  },

  { label: "Airline Profile", type: "airline" },

  // {
  //   label:
  //     "Subscription Alerts (new Freight Forwarders joining MeA)",
  //   type: "airline",
  // },

  { label: "Manage eAWB Status", type: "freight" },
  { label: "Freight Forwarder Profile", type: "freight" },
  { label: "Reports", type: "freight" },
];

interface HeaderProps {
  title?: string;
  showSearch?: boolean;
  showRegistrationButton?: boolean;
  activePage: string;
  onNavigate: (page: string) => void;
  role: "iata" | "airline" | "freight" | null;
}
const notifications: NotificationItem[] = [
  {
    id: "1",
    type: "request",
    message: "New registration submitted",
    reference: "FF-2026-0417",
    company: "Meridian Cargo Logistics",
    time: "2 hours ago",
    isRead: false,
    title: "",
  },
  {
    id: "2",
    type: "info",
    message: "Reply received on info request",
    reference: "FF-2026-0409",
    company: "Andes Global Shipping",
    time: "5 hours ago",
    isRead: false,
    title: "",
  },
  {
    id: "3",
    type: "signed",
    message: "Agreement signed",
    reference: "FF-2026-0415",
    company: "Pacific Rim Forwarding Co.",
    time: "Yesterday",
    isRead: false,
    title: "",
  },
  {
    id: "4",
    type: "deadline",
    message: "Signing link expires in 2 days",
    reference: "FF-2026-0415",
    company: "Pacific Rim Forwarding Co.",
    time: "Yesterday",
    isRead: false,
    title: "",
  },
  {
    id: "5",
    type: "request",
    message: "Document review requested",
    reference: "FF-2026-0412",
    company: "Global Freight Services",
    time: "Yesterday",
    isRead: true,
    title: "",
  },
];

export default function HeaderNew({
  activePage,
  onNavigate,
  role,
  title = "",
  showSearch = false,
  showRegistrationButton = false,
}: HeaderProps) {
  // const [darkMode, setDarkMode] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activationOpen, setActivationOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const handleNotificationClick = (notification: NotificationItem) => {
    console.log("Clicked:", notification);
  };

  const handleMarkAllRead = () => {
    console.log("Mark all notifications as read");
  };

  const handleViewAll = () => {
    console.log("View all notifications");
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const handleBellClick = () => {
    setIsOpen((previous) => !previous);
  };
  return (
    <header className="header_wrapper">
      <div className="header-inner">
        {/* ── Brand ── */}
        {/* <div className="header-brand">
          <img
            src="./iata-logo-header.svg"
            alt="IATA"
            className="header-logo"
          />

          <div className="header-brand-text">
            <div className="header-brand-name">MeA</div>
            <div className="header-brand-sub">Matchmaker</div>
          </div>
        </div> */}

        {/* <a
          href="#"
          className="header-home-link"
          style={{ color: activePage === "Home" ? "#2563eb" : "#4b5563" }}
          onClick={(e) => {
            e.preventDefault();
            onNavigate("Home");
          }}
          aria-label="Home"
        >
          <Home
            size={18}
            fill="none"
            color={activePage === "Home" ? "#2563eb" : "#374151"}
            strokeWidth={2}
          />
        </a> */}

        {/* ── Navigation ── */}
        <nav className="header-nav">
          {NAV_ITEMS.filter((item) => item.type === role).map((item) => {
            if (item.dropdown && item.children) {
              return (
                <div
                  key={item.label}
                  className={`header-nav-dropdown ${
                    activationOpen ? "header-nav-dropdown--open" : ""
                  }`}
                  onMouseEnter={() => setActivationOpen(true)}
                  onMouseLeave={() => setActivationOpen(false)}
                >
                  <button
                    type="button"
                    className={`header-nav-link header-nav-dropdown-trigger ${
                      item.children.some((child) => activePage === child.page)
                        ? "header-nav-link--active"
                        : ""
                    }`}
                    onClick={() => setActivationOpen((previous) => !previous)}
                  >
                    <span>{item.label}</span>

                    <ChevronDown
                      size={14}
                      className={
                        activationOpen ? "header-dropdown-arrow--open" : ""
                      }
                    />

                    {item.children.some(
                      (child) => activePage === child.page,
                    ) && <span className="header-nav-indicator" />}
                  </button>

                  {activationOpen && (
                    <div className="header-submenu">
                      {item.children.map((child) => (
                        <a
                          key={child.page}
                          href="#"
                          className={`header-submenu-link ${
                            activePage === child.page
                              ? "header-submenu-link--active"
                              : ""
                          }`}
                          onClick={(e) => {
                            e.preventDefault();

                            onNavigate(child.page);

                            setActivationOpen(false);
                          }}
                        >
                          {child.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <a
                key={item.label}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(item.label);
                }}
                className={`header-nav-link${
                  activePage === item.label ? " header-nav-link--active" : ""
                }`}
              >
                {item.label}

                {item.dropdown && (
                  <ChevronDown
                    size={14}
                    style={{
                      opacity: 0.6,
                      marginTop: "1px",
                    }}
                  />
                )}

                {activePage === item.label && (
                  <span className="header-nav-indicator" />
                )}
              </a>
            );
          })}
        </nav>
        <h1 className="urm-title">{title}</h1>
        <div className="header-right">
          {/* <Moon size={16} color="#6b7280" />
          <button
            aria-label="Toggle theme"
            onClick={() => setDarkMode((v) => !v)}
            className={`header-theme-toggle${darkMode ? " header-theme-toggle--dark" : ""}`}
          >
            <span
              className={`header-theme-knob${darkMode ? " header-theme-knob--dark" : ""}`}
            />
          </button> */}
          {/* <Sun size={16} color="#6b7280" /> */}

          {showRegistrationButton && (
            <button
              type="button"
              className="header-registration-button"
              onClick={() => navigate("/new-registration")}
            >
              <Repeat2 size={14} aria-hidden="true" />
              <span>Switch Reports</span>
            </button>
          )}

          {showSearch && (
            <label className="header-search" aria-label="Search">
              <Search size={14} aria-hidden="true" />
              <input
                type="search"
                placeholder="Find Names, Actors, Roles..."
                aria-label="Find names, actors, or roles"
              />
            </label>
          )}

          <div className="notification-container" ref={containerRef}>
            <button
              type="button"
              aria-label="Notifications"
              aria-expanded={isOpen}
              className="header-notif-btn"
              onClick={handleBellClick}
            >
              <Bell size={18} />
            </button>
            {isOpen && (
              <div className="notification-dropdown">
                <NotificationPopup
                  notifications={notifications}
                  onNotificationClick={handleNotificationClick}
                  onMarkAllRead={handleMarkAllRead}
                  onViewAll={handleViewAll}
                />
              </div>
            )}
          </div>

          <div className="header-user">
            <img className="header-avatar" src="/Avatar.png" alt="Jane Doe" />
            <span className="header-username">Jane Doe</span>
          </div>
        </div>
      </div>
    </header>
  );
}
