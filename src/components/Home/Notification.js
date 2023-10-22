import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import BeenhereIcon from "@mui/icons-material/Beenhere";
import BeenhereOutlinedIcon from "@mui/icons-material/BeenhereOutlined";
import { Box } from "@mui/material";
import { getTimeAgo, formatDate } from "../Utility/TimeHelpers";
import { axiosPrivate } from "../../api/axios";

const bull = (
  <Box
    component="span"
    sx={{ display: "inline-block", mx: "2px", transform: "scale(0.8)" }}
  >
    •
  </Box>
);

const Notification = ({
  notif,
  notifications,
  setNotifications,
  setSelectedNotif,
  setNumberOfNotifs,
}) => {
  //   console.log(notif);

  const handleNotificationClick = () => {
    axiosPrivate
      .put(`/api/Notification/UpdateNotification/MarkAsRead/${notif.id}`)
      .then((response) => {
        console.log(response);
        if (response.status == 200) {
          console.log("Marked as read successfully");
        }
      });

    const updatedNotifications = [...notifications];
    const notifIndex = updatedNotifications.findIndex((n) => n.id === notif.id);
    if (notifIndex !== -1) {
      updatedNotifications[notifIndex] = {
        ...updatedNotifications[notifIndex],
        isRead: true,
      };

      setNotifications(updatedNotifications);
    }

    setNumberOfNotifs((prev) => (prev > 0 ? prev - 1 : prev));
    setSelectedNotif(notif);
  };

  return (
    <Card
      sx={{
        borderRadius: 0,
        bgcolor: notif.isRead ? "#FFFEFE" : "#EFF3F4",
        "&:hover": {
          bgcolor: notif.isRead ? "#EFF3F4" : "#FFFEFE",
          cursor: "pointer",
          transition: "0.3s all",
        },
      }}
      onClick={handleNotificationClick}
      // sx={{ maxWidth: 345 }}
    >
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", columnGap: 1 }}>
            <Avatar
              src={notif.senderDPURL} // "https://ik.imagekit.io/pluipdnq6/2e2a4b2e-c906-4698-8a7e-81d8844ea53b_wDSAkdgJC"
              sx={{
                width: 44,
                height: 44,
              }}
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "start",
                alignItems: "center",
                columnGap: 1,
              }}
            >
              <Typography fontSize="0.8rem" fontWeight={600}>
                {notif.senderName}{" "}
              </Typography>
              <Typography fontSize="0.8rem" variant="h5" component="div">
                {bull}
              </Typography>
              <Typography fontSize="0.8rem" fontWeight="200" color="#778da9">
                @{notif.senderUserName}
              </Typography>
              <Typography fontSize="0.8rem" variant="h5" component="div">
                {bull}
              </Typography>
              <Typography fontSize="0.8rem" fontWeight="200" color="#778da9">
                {getTimeAgo(notif.timestamp).includes("week")
                  ? formatDate(notif.timestamp)
                  : getTimeAgo(notif.timestamp)}
              </Typography>
            </Box>
          </Box>

          <Box>
            <IconButton aria-label="settings">
              {notif.isRead ? <BeenhereIcon /> : <BeenhereOutlinedIcon />}
            </IconButton>
          </Box>
        </Box>

        <Typography
          textAlign="left"
          variant="body2"
          color="text.primary"
          paddingLeft={6.5}
        >
          {notif.message}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default Notification;
