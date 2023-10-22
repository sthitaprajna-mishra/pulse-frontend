import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import Friend from "./Friend";
import InProgress from "../Utility/InProgress";

const Friends = ({
  friends,
  fetchFriends,
  setSelectedUserProfileId,
  userId,
  isCurrentUser,
}) => {
  console.log(`isCurrentUser: ${isCurrentUser}`);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        rowGap: 2,
        "@media (min-width: 600px)": {
          flexDirection: "row",
          flexWrap: "wrap",
        },
      }}
    >
      {friends ? (
        <>
          {friends.map((friend) => {
            console.log(friend);
            return (
              <Friend
                friend={friend}
                fetchFriends={fetchFriends}
                setSelectedUserProfileId={setSelectedUserProfileId}
                isCurrentUser={isCurrentUser}
              />
            );
          })}
        </>
      ) : (
        <InProgress />
      )}
    </Box>
  );
};

export default Friends;
