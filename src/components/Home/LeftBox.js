import React, { useState } from "react";
import TwitterIcon from "@mui/icons-material/Twitter";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import DraftsOutlinedIcon from "@mui/icons-material/DraftsOutlined";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import ExitToAppOutlinedIcon from "@mui/icons-material/ExitToAppOutlined";
import GroupAddOutlinedIcon from "@mui/icons-material/GroupAddOutlined";
import DriveFileRenameOutlineOutlinedIcon from "@mui/icons-material/DriveFileRenameOutlineOutlined";
import LeftBoxIcon from "./LeftBoxIcon";
import {
  Box,
  Fab,
  List,
  ListItem,
  Tooltip,
  Avatar,
  Modal,
  Typography,
  Button,
  Badge,
} from "@mui/material";
import Logout from "./Logout";
import CreatePost from "./CreatePost";
import logov5 from "../../assets/logov5.png";

const TWITTER_LOGO_STYLES = {
  color: "#1D9BF0",
  fontSize: "36px",
  // ml: 1,
};

const STYLES = {
  color: "#0F1419",
  fontSize: "32px",
  // ml: 1,
  // "&:hover": {
  //   boxShadow: "20px 2px 4px rgba(0, 0, 0, 0.2)", // Adjust the offset to match the margin-left value
  // },
};

const MODAL_STYLES = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  // width: 400,
  width: "80%",
  maxWidth: "600px",
  bgcolor: "background.paper",
  border: "2px solid #fff",
  borderRadius: 0.5,
  boxShadow: 24,
  p: 4,
  // overflowY: "scroll",
};

const LeftBox = ({
  onMobile,
  onComponentSelect,
  numberOfConversations,
  numberOfFriendRequests,
  friendRequests,
  numberOfNotifs,
  setNumberOfDrafts,
  numberOfDrafts,
  setDrafts,
  setSelectedUserProfileId,
  userDP,
  handleCloseMenu,
}) => {
  console.log(numberOfFriendRequests);
  const handleIconClick = (component) => {
    if (onMobile) {
      handleCloseMenu();
    }
    if (component === "UserProfile") {
      console.log("USerProfile in leftbox");
      console.log(localStorage.getItem("userId"));
      setSelectedUserProfileId(localStorage.getItem("userId"));
    } else {
      setSelectedUserProfileId(null);
    }

    onComponentSelect(component);
  };

  const [progress, setProgress] = useState(0);
  const [logoutModelOpen, setLogoutModalOpen] = useState(false);
  const handleLogoutModalOpen = () => {
    setLogoutModalOpen(true);
    // document.body.style.overflow = "hidden";
  };
  const handleLogoutModalClose = () => {
    setLogoutModalOpen(false);
    // document.body.style.overflow = "";
  };

  const [createPostModelOpen, setCreatePostModalOpen] = useState(false);
  const handleCreatePostModalOpen = () => {
    setCreatePostModalOpen(true);
    // document.body.style.overflow = "hidden";
  };
  const handleCreatePostModalClose = () => {
    setCreatePostModalOpen(false);
    setProgress(0);
    // document.body.style.overflow = "";
  };

  return (
    <>
      <Logout
        logoutModelOpen={logoutModelOpen}
        handleLogoutModalClose={handleLogoutModalClose}
        MODAL_STYLES={MODAL_STYLES}
      />

      <CreatePost
        progress={progress}
        setProgress={setProgress}
        createPostModelOpen={createPostModelOpen}
        handleCreatePostModalClose={handleCreatePostModalClose}
        MODAL_STYLES={MODAL_STYLES}
        setNumberOfDrafts={setNumberOfDrafts}
        setDrafts={setDrafts}
      />

      <Box>
        <List
          sx={
            onMobile
              ? {
                  display: "flex",
                  flexWrap: "wrap",
                  overflow: "auto",
                  whiteSpace: "nowrap",
                }
              : {}
          }
        >
          <ListItem
            sx={{
              width: onMobile ? "fit-content" : "100%",
            }}
          >
            {/* <LeftBoxIcon icon={<TwitterIcon sx={TWITTER_LOGO_STYLES} />} /> */}
            <Box>
              <img
                src={logov5}
                alt="My Logo"
                style={{ width: 46, height: 46, borderRadius: "50%" }}
              />
            </Box>
          </ListItem>
          <ListItem
            sx={{ width: onMobile ? "fit-content" : "100%", pb: 0 }}
            onClick={() => handleIconClick("Home")}
          >
            <LeftBoxIcon icon={<HomeOutlinedIcon sx={STYLES} />} title="Home" />
          </ListItem>
          <ListItem
            sx={{ width: onMobile ? "fit-content" : "100%", pb: 0 }}
            onClick={() => handleIconClick("Notifications")}
          >
            <LeftBoxIcon
              num={numberOfNotifs}
              icon={<NotificationsOutlinedIcon sx={STYLES} />}
              title="Notifications"
            />
          </ListItem>

          <ListItem
            sx={{ width: onMobile ? "fit-content" : "100%", pb: 0 }}
            onClick={() => handleIconClick("FriendRequests")}
          >
            <LeftBoxIcon
              num={numberOfFriendRequests}
              icon={<GroupAddOutlinedIcon sx={STYLES} />}
              title="Friend Requests"
            />
          </ListItem>
          <ListItem
            sx={{ width: onMobile ? "fit-content" : "100%", pb: 0 }}
            onClick={() => handleIconClick("Drafts")}
          >
            <LeftBoxIcon
              num={numberOfDrafts}
              icon={<DriveFileRenameOutlineOutlinedIcon sx={STYLES} />}
              title="Drafts"
            />
          </ListItem>
          <ListItem
            sx={{ width: onMobile ? "fit-content" : "100%", pb: 0 }}
            onClick={() => handleIconClick("Inbox")}
          >
            <LeftBoxIcon
              num={numberOfConversations}
              icon={<DraftsOutlinedIcon sx={STYLES} />}
              title="Inbox"
            />
          </ListItem>
          <ListItem
            sx={{ width: onMobile ? "fit-content" : "100%", pb: 2 }}
            onClick={handleLogoutModalOpen}
          >
            <LeftBoxIcon
              icon={<ExitToAppOutlinedIcon sx={STYLES} />}
              title="Logout"
            />
          </ListItem>
          <ListItem
            sx={{ width: onMobile ? "fit-content" : "100%", pb: 4 }}
            onClick={handleCreatePostModalOpen}
          >
            <Fab
              sx={{
                bgcolor: "#1D9BF0",
                "&:hover": { bgcolor: "#1976d2" },
              }}
            >
              <Tooltip title="Tweet">
                <CreateOutlinedIcon sx={{ color: "#FFFFFF" }} />
              </Tooltip>
            </Fab>
          </ListItem>
          <ListItem
            sx={{ width: onMobile ? "fit-content" : "100%" }}
            onClick={() => handleIconClick("UserProfile")}
          >
            <Avatar
              // alt="Remy Sharp"
              src={userDP} // "https://ik.imagekit.io/pluipdnq6/2e2a4b2e-c906-4698-8a7e-81d8844ea53b_wDSAkdgJC"
              sx={{
                width: 56,
                height: 56,
                "&:hover": {
                  cursor: "pointer",
                  boxShadow: "0 0 20px rgba(0, 0, 0, 0.5)",
                  transition: "0.3s all",
                },
              }}
            />
          </ListItem>
        </List>
      </Box>
    </>
  );
};

export default LeftBox;
