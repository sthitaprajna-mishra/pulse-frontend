import React, { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import VerifiedIcon from "@mui/icons-material/Verified";
import { Box, Button } from "@mui/material";
import { axiosPrivate } from "../../api/axios";
import { SearchUserRelationshipCodes } from "../Utility/Constants";
import CallMadeOutlinedIcon from "@mui/icons-material/CallMadeOutlined";
import CallReceivedOutlinedIcon from "@mui/icons-material/CallReceivedOutlined";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import Chip from "@mui/material/Chip";
import FaceIcon from "@mui/icons-material/Face";

const SearchUserResult = ({
  id,
  name,
  userName,
  displayPictureURL,
  emailConfirmed,
  relationshipWithLoggedInUser,
  setSelectedUserProfileId,
}) => {
  const [sentRequest, setSentRequest] = useState(false);

  const handleClick = () => {
    console.log("clicked");
    setSelectedUserProfileId(id);
  };

  const sendFriendRequest = async () => {
    const response = await axiosPrivate.post(
      `/api/Friendship/SendFriendRequest`,
      {
        SenderId: localStorage.getItem("userId"),
        ReceiverId: id,
      }
    );

    if (response.status == 200) {
      setSentRequest(true);
    }

    console.log();
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
          onClick={handleClick}
        >
          <Box>
            <img
              alt="whoToFollow1"
              src={displayPictureURL}
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
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              <Typography fontSize="1rem" fontWeight="700">
                {name}
              </Typography>
              {emailConfirmed && (
                <VerifiedIcon sx={{ fontSize: "1.2rem", color: "#1D9BF0" }} />
              )}
            </Box>

            <Typography
              fontSize="0.9rem"
              fontWeight="200"
              color="#778da9"
              sx={{
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              @{userName}
            </Typography>
          </Box>
        </Box>
        <Box
          display="flex"
          columnGap={1}
          alignItems="center"
          disabled={
            relationshipWithLoggedInUser !=
              SearchUserRelationshipCodes.NotFriends || sentRequest
          }
          onClick={
            relationshipWithLoggedInUser ==
            SearchUserRelationshipCodes.NotFriends
              ? () => sendFriendRequest()
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
          ) : relationshipWithLoggedInUser ==
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
          ) : relationshipWithLoggedInUser ==
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
          ) : relationshipWithLoggedInUser ==
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
        {/* <Box>
          <Button
            disabled={
              relationshipWithLoggedInUser !=
                SearchUserRelationshipCodes.NotFriends || sentRequest
            }
            onClick={
              relationshipWithLoggedInUser ==
              SearchUserRelationshipCodes.NotFriends
                ? () => sendFriendRequest()
                : null
            }
            // variant="contained"
            // sx={{
            //   mr: 2,
            // }}
            variant="contained"
            // sx={{
            //   // flex: 0.5,
            //   fontSize: 12,
            //   fontWeight: 700,
            //   textTransform: "capitalize",
            //   textAlign: "left",
            //   px: 1.5,
            //   mr: 1,
            //   height: "2rem",
            //   borderRadius: "212px",
            // }}
            sx={{
              color: "#FFFFFF",
              bgcolor: "#000000",
              textTransform: "capitalize",
              borderRadius: "20px",
              fontWeight: "bold",
              "&:hover": {
                bgcolor: "#262626",
                transition: "all 0.3s",
              },
            }}
          >
            {relationshipWithLoggedInUser ==
            SearchUserRelationshipCodes.Friends ? (
              <>
                <PeopleOutlinedIcon />
                <Typography sx={{ pl: 1 }}>Friends</Typography>
              </>
            ) : relationshipWithLoggedInUser ==
              SearchUserRelationshipCodes.SentRequest ? (
              <>
                <CallMadeOutlinedIcon />
                <Typography sx={{ pl: 1 }}>Sent</Typography>
              </>
            ) : relationshipWithLoggedInUser ==
              SearchUserRelationshipCodes.ReceivedRequest ? (
              <>
                <CallReceivedOutlinedIcon />
                <Typography sx={{ pl: 1 }}>Received</Typography>
              </>
            ) : (
              <>
                <AddCircleOutlineOutlinedIcon />
                <Typography sx={{ pl: 1 }}>Add</Typography>
              </>
            )}
          </Button>
        </Box> */}
      </Box>
    </>
  );
};

export default SearchUserResult;
