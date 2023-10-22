import React from "react";
import FriendRequests from "./FriendRequests";
import Friends from "./Friends";
import Drafts from "./Drafts";
import SearchBarMain from "./SearchBarMain";
import Notifications from "./Notifications";
import Posts from "./Posts";
import Post from "./Post";
import SinglePost from "./SinglePost";
import { axiosPrivate } from "../../api/axios";
import UserProfile from "./UserProfile";
import Inbox from "./Inbox";
import ConversationTimeline from "./ConversationTimeline";
import { Fab } from "@mui/material";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";

const MainContent = ({
  displayMenuHandler,
  searchTermMain,
  selectedComponent,
  friendRequests = [],
  numberOfFriendRequests = 0,
  setFriendRequests = null,
  setNumberOfFriendRequests = null,
  notifications = [],
  numberOfNotifs = 0,
  drafts,
  numberOfDrafts,
  setDrafts,
  setNumberOfDrafts,
  selectedNotif,
  setSelectedNotif,
  setNotifications,
  setNumberOfNotifs,
  selectedUserProfileId,
  setSelectedUserProfileId,
  userDP,
  setUserDP,
  conversations,
  setConversations,
  numberOfConversations,
  setNumberOfConversations,
  selectedConversation,
  setSelectedConversation,
  markAllAsReadFunc,
}) => {
  let componentToRender = null;

  switch (selectedComponent) {
    case "UserProfile":
      componentToRender = (
        <UserProfile
          userId={selectedUserProfileId}
          setSelectedUserProfileId={setSelectedUserProfileId}
          userDP={userDP}
          setUserDP={setUserDP}
        />
      );
      break;
    case "FriendRequests":
      componentToRender = (
        <FriendRequests
          friendRequests={friendRequests}
          setFriendRequests={setFriendRequests}
          setNumberOfFriendRequests={setNumberOfFriendRequests}
          numberOfFriendRequests={numberOfFriendRequests}
        />
      );
      break;
    case "Friends":
      componentToRender = <Friends />;
      break;
    case "Drafts":
      componentToRender = (
        <Drafts
          drafts={drafts}
          numberOfDrafts={numberOfDrafts}
          setDrafts={setDrafts}
          setNumberOfDrafts={setNumberOfDrafts}
        />
      );
      break;
    case "Inbox":
      console.log(selectedConversation);
      if (selectedConversation !== null) {
        componentToRender = (
          <ConversationTimeline
            conversationId={selectedConversation}
            conversations={conversations}
            setConversations={setConversations}
          />
        );
      } else {
        componentToRender = (
          <Inbox
            conversations={conversations}
            setConversations={setConversations}
            numberOfConversations={numberOfConversations}
            setNumberOfConversations={setNumberOfConversations}
            setSelectedUserProfileId={setSelectedUserProfileId}
            setSelectedConversation={setSelectedConversation}
          />
        );
      }

      break;
    case "SearchBarMain":
      componentToRender = (
        <SearchBarMain
          setSelectedUserProfileId={setSelectedUserProfileId}
          searchTermMain={searchTermMain}
        />
      );
      break;
    case "Notifications":
      if (selectedNotif !== null) {
        componentToRender = (
          <SinglePost notif={selectedNotif} postId={selectedNotif.actionUrl} />
        );
      } else {
        componentToRender = (
          <Notifications
            notifications={notifications}
            setNotifications={setNotifications}
            numberOfNotifs={numberOfNotifs}
            setSelectedNotif={setSelectedNotif}
            setNumberOfNotifs={setNumberOfNotifs}
            markAllAsReadFunc={markAllAsReadFunc}
          />
        );
      }

      break;
    // Handle other components
    default:
      componentToRender = (
        <Posts setSelectedUserProfileId={setSelectedUserProfileId} />
      );
      break;
  }

  if (selectedUserProfileId != null) {
    componentToRender = (
      <UserProfile
        userId={selectedUserProfileId}
        setSelectedUserProfileId={setSelectedUserProfileId}
        userDP={userDP}
        setUserDP={setUserDP}
      />
    );
  }

  return (
    <>
      <Fab
        sx={{
          display: {
            xs: "block",
            sm: "none",
          },
          position: "fixed",
          bottom: "1rem",
          bgcolor: "#1D9BF0",
          "&:hover": { bgcolor: "#1976d2" },
        }}
        onClick={displayMenuHandler}
      >
        <MenuRoundedIcon sx={{ mt: 1, fontSize: "2rem", color: "#FFFFFF" }} />
      </Fab>
      {componentToRender}
    </>
  );
};
export default MainContent;
