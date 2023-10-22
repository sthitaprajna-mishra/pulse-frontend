import React, { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import VerifiedIcon from "@mui/icons-material/Verified";
import { Box, Button } from "@mui/material";
import { axiosPrivate } from "../../api/axios";

export default function FriendRequest({
  friendRequests,
  setFriendRequests,
  setNumberOfFriendRequests,
  userId,
  userFullName,
  userUserName,
  userDP,
  requestId,
}) {
  const acceptOrDecline = async (acceptedOrNot) => {
    const response = await axiosPrivate.post(
      `/api/Friendship/AcceptOrDecline`,
      {
        FriendRequestId: requestId,
        IsAccepted: acceptedOrNot,
        IsDeclined: !acceptedOrNot,
      }
    );
    console.log(response.data);
    console.log(`requestId: ${requestId}`);
    setFriendRequests((prevFriends) => {
      const filteredFriends = prevFriends.filter(
        (friend) => friend.friendRequestId !== requestId
      );
      console.log(filteredFriends);
      return filteredFriends;
    });
    // console.log(friendRequests);
    setNumberOfFriendRequests((prev) => prev - 1);
  };

  return (
    <>
      <Box
        sx={{
          py: "0.5rem",
          px: "1rem",
          display: "flex",
          justifyContent: "space-between",
          "&:hover": {
            bgcolor: "#F5F5F5",
            cursor: "pointer",
            transition: "background-color 0.3s",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            columnGap: 2,
            justifyContent: "space-between",
          }}
        >
          <Box>
            <img
              alt="whoToFollow1"
              src={userDP}
              style={{
                width: "48px",
                height: "48px",
                objectFit: "cover",
                borderRadius: "50%",
              }}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "start",
            }}
          >
            <Box
              sx={{
                display: "flex",
                columnGap: 0.5,
                alignItems: "center",
              }}
            >
              <Typography fontSize="1rem" fontWeight="700">
                {userFullName}
              </Typography>
              <VerifiedIcon sx={{ fontSize: "1.2rem", color: "#1D9BF0" }} />
            </Box>

            <Typography fontSize="0.9rem" fontWeight="200" color="#778da9">
              @{userUserName}
            </Typography>
          </Box>
        </Box>
        <Box>
          <>
            <Button
              variant="contained"
              sx={{
                mr: 2,
              }}
              onClick={() => acceptOrDecline(true)}
            >
              Accept
            </Button>
            <Button
              variant="outlined"
              color="error"
              sx={{
                ml: 2,
              }}
              onClick={() => acceptOrDecline(false)}
            >
              Decline
            </Button>
          </>
        </Box>
      </Box>
    </>
  );
}
