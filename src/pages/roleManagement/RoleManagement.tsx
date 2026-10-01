import { useEffect, useRef, useState } from "react";
import HeaderNew from "../../components/HeaderNew";
import RoleDrawer from "./RoleDrawer";
import UserManagement from "./UserManagement";
import "./IataDashboard.scss";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Trash2,
  Pencil,
  Users,
} from "lucide-react";

type Role = {
  name: string;
  type: string;
  status: "Active" | "Inactive";
  createdOn: string;
  createdBy: string;
  modifiedBy: string;
  email: string;
  description: string;
};

const roles: Role[] = [
  {
    name: "Airline Role 01",
    type: "Airline Role",
    status: "Active",
    createdOn: "Dec 31, 2024",
    createdBy: "Emily Carter",
    modifiedBy: "Emily Carter",
    email: "olivia@untitledui.com",
    description: "This is for Admin",
  },
  {
    name: "Agent Role 01",
    type: "Agent role",
    status: "Active",
    createdOn: "Dec 31, 2024",
    createdBy: "Michael Thompson",
    modifiedBy: "Michael Thompson",
    email: "phoenix@untitledui.com",
    description: "This is for Admin",
  },
  {
    name: "Airline Role 02",
    type: "Airline Role",
    status: "Inactive",
    createdOn: "Dec 29, 2024",
    createdBy: "Jessica Lee",
    modifiedBy: "Jessica Lee",
    email: "lana@untitledui.com",
    description: "This is for Admin",
  },
  {
    name: "Agent Role 02",
    type: "Agent role",
    status: "Active",
    createdOn: "Dec 27, 2024",
    createdBy: "David Johnson",
    modifiedBy: "David Johnson",
    email: "demi@untitledui.com",
    description: "This is for Admin",
  },
  {
    name: "Agent Role 03",
    type: "Agent role",
    status: "Inactive",
    createdOn: "Dec 25, 2024",
    createdBy: "Sarah Miller",
    modifiedBy: "Sarah Miller",
    email: "candice@untitledui.com",
    description: "This is for Admin",
  },
];

const RoleManagement = () => {
  const [activePage, setActivePage] = useState("Home");
  const [activeTab, setActiveTab] = useState<"roles" | "users">("roles");
  const [isRoleDrawerOpen, setIsRoleDrawerOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [roleTypeFilter, setRoleTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleSearch, setRoleSearch] = useState("");
  const filterControlRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isFilterOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterControlRef.current &&
        !filterControlRef.current.contains(event.target as Node)
      ) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isFilterOpen]);

  const filteredRoles = roles.filter((role) => {
    const matchesType =
      roleTypeFilter === "all" || role.type === roleTypeFilter;
    const matchesStatus =
      statusFilter === "all" || role.status === statusFilter;
    const query = roleSearch.trim().toLowerCase();
    const matchesSearch =
      !query ||
      [role.name, role.type, role.createdBy, role.modifiedBy, role.email].some(
        (value) => value.toLowerCase().includes(query),
      );

    return matchesType && matchesStatus && matchesSearch;
  });

  const clearFilters = () => {
    setRoleTypeFilter("all");
    setStatusFilter("all");
    setRoleSearch("");
  };

  return (
    <>
      <HeaderNew
        role={null}
        title="User & Role Management"
        showSearch
        showRegistrationButton
        activePage={activePage}
        onNavigate={setActivePage}
      />

      <main className="iata-dashboard">
        <div className="urm-page">
          {/* Header */}

          {/* Tabs / Actions */}
          <div className="urm-toolbar">
            <div className="urm-tabs">
              <button
                className={`urm-tab${activeTab === "roles" ? " active" : ""}`}
                type="button"
                aria-pressed={activeTab === "roles"}
                onClick={() => setActiveTab("roles")}
              >
                Role Management
              </button>
              <button
                className={`urm-tab${activeTab === "users" ? " active" : ""}`}
                type="button"
                aria-pressed={activeTab === "users"}
                onClick={() => {
                  setActiveTab("users");
                  setIsRoleDrawerOpen(false);
                }}
              >
                User Management
              </button>
            </div>

            {activeTab === "roles" && (
              <div className="urm-actions">
                <div className="filter-control" ref={filterControlRef}>
                  <button
                    className="filter-button"
                    type="button"
                    aria-expanded={isFilterOpen}
                    aria-controls="role-filter-panel"
                    onClick={() => setIsFilterOpen((open) => !open)}
                  >
                    <span>Filters</span>
                    <ChevronDown size={14} />
                  </button>

                  {isFilterOpen && (
                    <div className="role-filter-panel" id="role-filter-panel">
                      <label className="role-filter-search">
                        Search roles
                        <input
                          type="search"
                          placeholder="Name, creator, or email"
                          value={roleSearch}
                          onChange={(event) =>
                            setRoleSearch(event.target.value)
                          }
                        />
                      </label>
                      <label>
                        Role type
                        <select
                          value={roleTypeFilter}
                          onChange={(event) =>
                            setRoleTypeFilter(event.target.value)
                          }
                        >
                          <option value="all">All role types</option>
                          <option value="Airline Role">Airline Role</option>
                          <option value="Agent role">Agent role</option>
                        </select>
                      </label>
                      <label>
                        Status
                        <select
                          value={statusFilter}
                          onChange={(event) =>
                            setStatusFilter(event.target.value)
                          }
                        >
                          <option value="all">All statuses</option>
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      </label>
                      <button
                        className="role-filter-clear"
                        type="button"
                        onClick={clearFilters}
                      >
                        Clear filters
                      </button>
                    </div>
                  )}
                </div>

                <button className="download-button">Download All</button>

                <button
                  className="add-role-button"
                  onClick={() => setIsRoleDrawerOpen(true)}
                >
                  Add Role
                </button>
              </div>
            )}
          </div>

          {activeTab === "users" ? (
            <UserManagement />
          ) : (
            <>
              {/* Table */}
              <div className="urm-table-container">
                <table className="urm-table">
                  <thead>
                    <tr>
                      <th className="role-column">
                        <TableHeader title="Role" />
                      </th>

                      <th className="created-column">
                        <TableHeader title="Created on" />
                      </th>

                      <th className="created-by-column">
                        <TableHeader title="Created by" />
                      </th>

                      <th className="modified-by-column">
                        <TableHeader title="Modified by" />
                      </th>

                      <th className="status-column">
                        <TableHeader title="Status" />
                      </th>

                      <th className="email-column">
                        <TableHeader title="Email address" />
                      </th>

                      <th className="description-column">
                        <TableHeader title="Description" />
                      </th>

                      <th className="actions-column" />
                    </tr>
                  </thead>

                  <tbody>
                    {filteredRoles.map((role) => (
                      <tr key={role.name}>
                        <td>
                          <div className="role-cell">
                            <input type="checkbox" />

                            <div>
                              <div className="role-name">{role.name}</div>
                              <div className="role-type">{role.type}</div>
                            </div>
                          </div>
                        </td>

                        <td>{role.createdOn}</td>

                        <td>{role.createdBy}</td>

                        <td>{role.modifiedBy}</td>

                        <td>
                          <span
                            className={`status-badge${role.status === "Inactive" ? " status-badge-inactive" : ""}`}
                          >
                            {role.status}
                          </span>
                        </td>

                        <td className="truncate">{role.email}</td>

                        <td className="truncate">{role.description}</td>

                        <td>
                          <div className="row-actions">
                            <button aria-label="Delete">
                              <Trash2 size={14} />
                            </button>

                            <button aria-label="Edit">
                              <Pencil size={14} />
                            </button>

                            <button aria-label="Users">
                              <Users size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredRoles.length === 0 && (
                  <div className="role-filter-empty">
                    No roles match these filters.
                  </div>
                )}
              </div>

              {/* Pagination */}
              <div className="urm-pagination">
                <button>
                  <ChevronsLeft size={14} />
                </button>

                <button>
                  <ChevronLeft size={14} />
                </button>

                <button className="page-number">1</button>

                <button>
                  <ChevronRight size={14} />
                </button>

                <button>
                  <ChevronsRight size={14} />
                </button>
              </div>
            </>
          )}
        </div>
      </main>
      {activeTab === "roles" && (
        <RoleDrawer
          isOpen={isRoleDrawerOpen}
          onClose={() => setIsRoleDrawerOpen(false)}
        />
      )}
    </>
  );
};
const TableHeader = ({ title }: { title: string }) => {
  return (
    <div className="table-header">
      <span>{title}</span>
      {/* <span className="sort-icon">↕</span> */}
    </div>
  );
};
export default RoleManagement;
