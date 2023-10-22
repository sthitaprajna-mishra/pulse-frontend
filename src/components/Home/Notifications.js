import React from "react";
import Heading from "./Heading";
import Notification from "./Notification";
import { Button } from "@mui/material";

const Notifications = ({
  notifications,
  setNotifications,
  numberOfNotifs,
  setSelectedNotif,
  setNumberOfNotifs,
  markAllAsReadFunc,
}) => {
  return (
    <div>
      <Heading
        title="Notifications"
        num={numberOfNotifs}
        markAllAsReadFunc={markAllAsReadFunc}
      />
      <ul>
        {notifications.map((notification) => {
          return (
            <Notification
              key={notification.id}
              notif={notification}
              notifications={notifications}
              setNotifications={setNotifications}
              setSelectedNotif={setSelectedNotif}
              setNumberOfNotifs={setNumberOfNotifs}
            />
          );
        })}
      </ul>
    </div>
  );
};

export default Notifications;
