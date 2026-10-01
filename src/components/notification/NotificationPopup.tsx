import React from "react";
import "./NotificationPopup.css";

export type NotificationType =
  | "request"
  | "info"
  | "signed"
  | "deadline"
  | "warning"
  | "success";

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  reference?: string;
  company?: string;
  time?: string;
  isRead?: boolean;
  icon?: string;
}

interface NotificationPopupProps {
  notifications: NotificationItem[];
  onNotificationClick?: (notification: NotificationItem) => void;
  onMarkAllRead?: () => void;
  onViewAll?: () => void;
  maxHeight?: number;
}

const typeConfig: Record<
  NotificationType,
  {
    label: string;
    color: string;
    background: string;
    icon: string;
  }
> = {
  request: {
    label: "REQUEST",
    color: "#a66b00",
    background: "#f8edd7",
    icon: "R",
  },
  info: {
    label: "INFO RECEIVED",
    color: "#386da8",
    background: "#e7eef7",
    icon: "I",
  },
  signed: {
    label: "SIGNED",
    color: "#267765",
    background: "#e2f1ed",
    icon: "S",
  },
  deadline: {
    label: "DEADLINE",
    color: "#c83c32",
    background: "#f8e6e5",
    icon: "D",
  },
  warning: {
    label: "WARNING",
    color: "#a66b00",
    background: "#f8edd7",
    icon: "!",
  },
  success: {
    label: "SUCCESS",
    color: "#267765",
    background: "#e2f1ed",
    icon: "✓",
  },
};

const NotificationPopup: React.FC<NotificationPopupProps> = ({
  notifications,
  onNotificationClick,
  onMarkAllRead,
  onViewAll,
  maxHeight = 360,
}) => {
  return (
    <div className="notification-popup">
      {/* Header */}
      <div className="notification-header">
        <h3>Notifications</h3>

        <button
          type="button"
          className="mark-read-button"
          onClick={onMarkAllRead}
        >
          Mark all read
        </button>
      </div>

      {/* Notification List */}
      <div
        className="notification-list"
        style={{ maxHeight: `${maxHeight}px` }}
      >
        {notifications.length === 0 ? (
          <div className="notification-empty">
            <span>No notifications</span>
          </div>
        ) : (
          notifications.map((notification) => {
            const config = typeConfig[notification.type];

            return (
              <button
                type="button"
                key={notification.id}
                className={`notification-item ${
                  notification.isRead ? "is-read" : "is-unread"
                }`}
                onClick={() => onNotificationClick?.(notification)}
              >
                {/* Icon */}
                <div
                  className="notification-icon"
                  style={{
                    color: config.color,
                    backgroundColor: config.background,
                  }}
                >
                  {notification.icon || config.icon}
                </div>

                {/* Content */}
                <div className="notification-content">
                  <div className="notification-title-row">
                    <span
                      className="notification-type"
                      style={{ color: config.color }}
                    >
                      {config.label}
                    </span>

                    {!notification.isRead && (
                      <span className="unread-dot" />
                    )}
                  </div>

                  <div className="notification-message">
                    {notification.message}
                    {notification.reference && (
                      <> — {notification.reference}</>
                    )}
                  </div>

                  {(notification.company || notification.time) && (
                    <div className="notification-meta">
                      {notification.company && (
                        <span>{notification.company}</span>
                      )}

                      {notification.company && notification.time && (
                        <span className="meta-separator">•</span>
                      )}

                      {notification.time && (
                        <span>{notification.time}</span>
                      )}
                    </div>
                  )}
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* Footer */}
      <button
        type="button"
        className="view-all-button"
        onClick={onViewAll}
      >
        View all notifications
      </button>
    </div>
  );
};

export default NotificationPopup;
