import React from "react";
import { Box, Typography, Card, Button } from "@mui/material";

const Heading = ({ title, num = 0, markAllAsReadFunc = null }) => {
  const handleMarkAllClick = () => {
    console.log(`mark all as read function`);
    markAllAsReadFunc();
  };

  return (
    <>
      {title !== "Home" &&
      title !== "Notification" &&
      title !== "User Posts" ? (
        title === "Notifications" ? (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box
              sx={{
                p: 4,
                display: "flex",
                justifyContent: "start",
              }}
            >
              <Typography sx={{ fontSize: 18 }}>
                <strong>
                  {title} ({num})
                </strong>
              </Typography>
            </Box>
            <Button
              variant="contained"
              sx={{
                // flex: 0.5,
                fontSize: 12,
                fontWeight: 700,
                textTransform: "capitalize",
                textAlign: "left",
                px: 2,
                height: "2rem",
                borderRadius: "212px",
              }}
              onClick={() => handleMarkAllClick()}
            >
              Mark All As Read
            </Button>
          </Box>
        ) : (
          <Box sx={{ p: 4, display: "flex", justifyContent: "start" }}>
            <Typography sx={{ fontSize: 18 }}>
              <strong>
                {title} ({num})
              </strong>
            </Typography>
          </Box>
        )
      ) : (
        <Card
          sx={{
            borderRadius: 0,
            boxShadow: "none",
            p: 4,
            textAlign: "left",
            fontWeight: "bold",
          }}
        >
          <Typography fontSize={18} fontWeight={700}>
            {title}
          </Typography>
        </Card>
      )}
    </>
  );
};

export default Heading;
