import React, { useState, useEffect } from "react";
import { axiosPrivate } from "../../api/axios";
import { Box, Typography } from "@mui/material";
import { SearchUserRelationshipCodes } from "../Utility/Constants";
import Chip from "@mui/material/Chip";
import FaceIcon from "@mui/icons-material/Face";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import CallMadeOutlinedIcon from "@mui/icons-material/CallMadeOutlined";
import CallReceivedOutlinedIcon from "@mui/icons-material/CallReceivedOutlined";

const Friend = ({
  friend,
  isCurrentUser,
  fetchFriends,
  setSelectedUserProfileId,
}) => {
  const [sentRequest, setSentRequest] = useState(false);

  const sendFriendRequest = async (friendId) => {
    const response = await axiosPrivate.post(
      `/api/Friendship/SendFriendRequest`,
      {
        SenderId: localStorage.getItem("userId"),
        ReceiverId: friendId,
      }
    );

    if (response.status == 200) {
      setSentRequest(true);
    }

    console.log();
  };
  // useEffect(() => {
  //   console.log("API call");
  //   fetchFriends(userId);
  // }, []);

  const handleClick = (friendId) => {
    setSelectedUserProfileId(friendId);
    fetchFriends(friendId);
  };

  return (
    <Box
      key={friend.friendId}
      sx={{
        display: "flex",
        width: "50%",
        "@media (min-width: 600px)": {
          width: "50%",
        },
        columnGap: 3,
        "&:hover": {
          bgcolor: "#F5F5F5",
          cursor: "pointer",
          transition: "all 0.3s",
        },
        p: 2,
        // border: "1px solid red",
        // justifyContent: "space-between",
      }}
    >
      <Box>
        <img
          alt="whoToFollow1"
          src={friend.friendDPURL}
          style={{
            width: "48px",
            height: "48px",
            objectFit: "cover",
            borderRadius: "50%",
          }}
          onClick={() => handleClick(friend.friendId)}
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
          <Typography
            fontSize="1rem"
            fontWeight="700"
            sx={{
              "&:hover": {
                textDecoration: "underline",
                cursor: "pointer",
              },
            }}
            onClick={() => handleClick(friend.friendId)}
          >
            {friend.friendName}
          </Typography>
        </Box>

        <Typography
          fontSize="0.9rem"
          fontWeight="200"
          color="#778da9"
          sx={{
            "&:hover": {
              textDecoration: "underline",
              cursor: "pointer",
            },
          }}
          onClick={() => handleClick(friend.friendId)}
        >
          @{friend.friendUserName}
        </Typography>
      </Box>
      {isCurrentUser ||
      friend.friendId === localStorage.getItem("userId") ? null : (
        <Box
          display="flex"
          columnGap={1}
          alignItems="center"
          disabled={
            friend.relationshipWithLoggedInUser !=
              SearchUserRelationshipCodes.NotFriends || sentRequest
          }
          onClick={
            friend.relationshipWithLoggedInUser ==
            SearchUserRelationshipCodes.NotFriends
              ? () => sendFriendRequest(friend.friendId)
              : null
          }
        >
          {sentRequest ? (
            <>
              <Chip
                sx={{
                  color: "#FFFFFF",
                  bgcolor: "#000000",
                  textTransform: "capitalize",
                  borderRadius: "20px",
                  fontWeight: "bold",
                  width: "100px",
                  "&:hover": {
                    bgcolor: "#262626",
                    cursor: "pointer",
                    transition: "all 0.3s",
                  },
                }}
                icon={<CallMadeOutlinedIcon />}
                label="Sent"
              />
            </>
          ) : friend.relationshipWithLoggedInUser ==
            SearchUserRelationshipCodes.Friends ? (
            <>
              <Chip
                sx={{
                  width: "100px",
                  "&:hover": {
                    bgcolor: "#1d9bf0",
                    transition: "all 0.3s",
                  },
                }}
                color="primary"
                icon={<FaceIcon />}
                label="Friend"
              />
            </>
          ) : friend.relationshipWithLoggedInUser ==
            SearchUserRelationshipCodes.SentRequest ? (
            <>
              <Chip
                sx={{
                  color: "#FFFFFF",
                  bgcolor: "#000000",
                  width: "100px",
                  textTransform: "capitalize",
                  borderRadius: "20px",
                  fontWeight: "bold",
                  "&:hover": {
                    bgcolor: "#262626",
                    cursor: "pointer",
                    transition: "all 0.3s",
                  },
                }}
                icon={<CallMadeOutlinedIcon />}
                label="Sent"
              />
            </>
          ) : friend.relationshipWithLoggedInUser ==
            SearchUserRelationshipCodes.ReceivedRequest ? (
            <>
              <Chip
                sx={{
                  color: "#FFFFFF",
                  bgcolor: "#000000",
                  width: "100px",
                  textTransform: "capitalize",
                  borderRadius: "20px",
                  fontWeight: "bold",
                  "&:hover": {
                    bgcolor: "#262626",
                    cursor: "pointer",
                    transition: "all 0.3s",
                  },
                }}
                icon={<CallReceivedOutlinedIcon />}
                label="Received"
              />
            </>
          ) : (
            <>
              <Chip
                sx={{
                  width: "100px",
                  "&:hover": {
                    cursor: "pointer",
                    transition: "all 0.3s",
                  },
                }}
                color="primary"
                icon={<AddCircleOutlineOutlinedIcon />}
                label="Add"
              />
            </>
          )}
        </Box>
      )}
    </Box>
  );
};

export default Friend;
