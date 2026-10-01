import { useEffect, useState } from "react";
import "./RoleDrawer.scss";

type RoleDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};
type Permission = {
  add: boolean;
  copy?: boolean;
  edit: boolean;
  delete: boolean;
  search: boolean;
  xls: boolean;
};

type PermissionRow = {
  role: string;
  permission: Permission;
};

const initialPermissions: PermissionRow[] = [
  {
    role: "Manage Users (View, Add, Assign roles)",
    permission: {
      add: false,
      copy: true,
      edit: false,
      delete: false,
      search: true,
      xls: false,
    },
  },
  {
    role: "Reports",
    permission: {
      add: false,
      edit: false,
      delete: false,
      search: true,
      xls: false,
    },
  },
  {
    role: "Manage eAWB Status",
    permission: {
      add: false,
      edit: true,
      delete: false,
      search: false,
      xls: true,
    },
  },
  {
    role: "Activation notices",
    permission: {
      add: true,
      edit: true,
      delete: false,
      search: true,
      xls: false,
    },
  },
  {
    role: "Access to Airline profile",
    permission: {
      add: false,
      edit: true,
      delete: false,
      search: false,
      xls: false,
    },
  },
];


const RoleDrawer = ({ isOpen, onClose }: RoleDrawerProps) => {
  const [roleName, setRoleName] = useState("Airline Role 02");
  const [roleType, setRoleType] = useState("External");
  const [description, setDescription] = useState("");
  const [permissions, setPermissions] =
    useState<PermissionRow[]>(initialPermissions);

  const updatePermission = (
    rowIndex: number,
    key: keyof Permission,
  ) => {
    setPermissions((current) =>
      current.map((row, index) => {
        if (index !== rowIndex) return row;

        return {
          ...row,
          permission: {
            ...row.permission,
            [key]: !row.permission[key],
          },
        };
      }),
    );
  };

  const handleCreate = () => {
    // Handle the creation of the role here
  };
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="role-drawer-backdrop" onMouseDown={onClose}>
      <aside
        className="role-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="role-drawer-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="add-role-header">
          <h2>Add Role</h2>
        </div>

        {/* Content */}
        <div className="add-role-content">
          {/* Role details */}
          <div className="add-role-details">
            <div className="add-role-field">
              <label htmlFor="role-name">
                Enter Role Name
              </label>

              <input
                id="role-name"
                type="text"
                value={roleName}
                onChange={(event) =>
                  setRoleName(event.target.value)
                }
              />
            </div>

            <div className="add-role-field">
              <label htmlFor="role-type">
                Internal / External
              </label>

              <div className="add-role-select-wrapper">
                <select
                  id="role-type"
                  value={roleType}
                  onChange={(event) =>
                    setRoleType(event.target.value)
                  }
                >
                  <option value="Internal">
                    Internal
                  </option>

                  <option value="External">
                    External
                  </option>
                </select>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="add-role-field add-role-description">
            <label htmlFor="role-description">
              Remarks / Description
            </label>

            <input
              id="role-description"
              type="text"
              placeholder="Enter text"
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
            />
          </div>

          {/* Permissions */}
          <section className="permissions-section">

            <h3>Permissions by user role:</h3>

            <div className="permissions-table">

              {/* Table header */}
              <div className="permission-row permission-header">
                <div className="permission-role">
                  Role
                </div>

                <div className="permission-list-title">
                  Permissions
                </div>
              </div>

              {permissions.map((item, index) => (
                <div
                  className="permission-row"
                  key={item.role}
                >
                  <div className="permission-role">
                    {item.role ===
                    "Manage Users (View, Add, Assign roles)" ? (
                      <>
                        Manage Users (View, Add,
                        <br />
                        Assign roles)
                      </>
                    ) : (
                      item.role
                    )}
                  </div>

                  <div className="permission-list">

                    <PermissionCheckbox
                      label="Add"
                      checked={item.permission.add}
                      onChange={() =>
                        updatePermission(index, "add")
                      }
                    />

                    {item.permission.copy !== undefined && (
                      <PermissionCheckbox
                        label="Copy"
                        checked={item.permission.copy}
                        onChange={() =>
                          updatePermission(index, "copy")
                        }
                      />
                    )}

                    <PermissionCheckbox
                      label="Edit"
                      checked={item.permission.edit}
                      onChange={() =>
                        updatePermission(index, "edit")
                      }
                    />

                    <PermissionCheckbox
                      label="Delete"
                      checked={item.permission.delete}
                      onChange={() =>
                        updatePermission(index, "delete")
                      }
                    />

                    <PermissionCheckbox
                      label="List & Search"
                      checked={item.permission.search}
                      onChange={() =>
                        updatePermission(index, "search")
                      }
                    />

                    <PermissionCheckbox
                      label="XLS"
                      checked={item.permission.xls}
                      onChange={() =>
                        updatePermission(index, "xls")
                      }
                    />

                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="add-role-footer">
          <button
            type="button"
            className="add-role-cancel"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            type="button"
            className="add-role-create"
            onClick={handleCreate}
          >
            Create
          </button>
        </div>
      </aside>
    </div>
  );
};
interface PermissionCheckboxProps {
  label: string;
  checked: boolean;
  onChange: () => void;
}

const PermissionCheckbox: React.FC<
  PermissionCheckboxProps
> = ({ label, checked, onChange }) => {
  return (
    <label className="permission-checkbox">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
      />

      <span>{label}</span>
    </label>
  );
};
export default RoleDrawer;