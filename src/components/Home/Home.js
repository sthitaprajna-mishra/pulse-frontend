import {
  CssBaseline,
  Container,
  Grid,
  Box,
  Snackbar,
  Alert,
  SnackbarContent,
  Modal,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import LeftBox from "./LeftBox";
import { createTheme } from "@mui/material/styles";
import RightBox from "./RightBox";
import UserPost from "./UserPost";
import MainContent from "./MainContent";
import { axiosPrivate } from "../../api/axios";
import { HubConnectionBuilder } from "@microsoft/signalr";

const menuModalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const Home = () => {
  // const theme = useTheme();

  const [openMenu, setOpenMenu] = useState(false);
  const handleOpenMenu = () => setOpenMenu(true);
  const handleCloseMenu = () => setOpenMenu(false);

  // const [displayMenu, setDisplayMenu] = useState(true);

  const displayMenuHandler = () => {
    // setDisplayMenu(!displayMenu);
    setOpenMenu(!openMenu);
  };

  const [userDP, setUserDP] = useState(null);
  const [selectedUserProfileId, setSelectedUserProfileId] = useState(null);
  const [selectedNotif, setSelectedNotif] = useState(null);
  const [numberOfDrafts, setNumberOfDrafts] = useState(0);
  const [drafts, setDrafts] = useState([]);

  const [selectedConversation, setSelectedConversation] = useState(null);
  const [numberOfConversations, setNumberOfConversations] = useState(0);
  const [conversations, setConversations] = useState([]);

  const [numberOfNotifs, setNumberOfNotifs] = useState(0);
  const [notifications, setNotifications] = useState([]);

  const [searchTermMain, setSearchTermMain] = useState();
  const [openNotif, setOpenNotif] = React.useState(false);
  const [notifMessage, setNotifMessage] = React.useState();

  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [numberOfFriendRequests, setNumberOfFriendRequests] = useState(0);
  const [friendRequests, setFriendRequests] = useState([]);

  const [selectedComponent, setSelectedComponent] = useState(null);

  const markAllAsReadFunc = async () => {
    const response = await axiosPrivate.put(
      `/api/Notification/UpdateNotification/MarkAllAsRead?userId=${localStorage.getItem(
        "userId"
      )}`
    );
    if (response.status === 200) {
      fetchNotifications();
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenNotif(false);
  };

  const handleComponentSelect = (component) => {
    if (component === "Notifications") {
      setSelectedNotif(null);
    }
    if (component === "Inbox") {
      setSelectedConversation(null);
    }
    setSelectedComponent(component);
  };

  const updateUniqueConvos = (allConversations) => {
    const newConvos = new Map();

    console.log(JSON.stringify(allConversations, null, 4));

    allConversations.forEach((conversation) => {
      if (newConvos.has(conversation.conversationId)) {
        newConvos.delete(conversation.conversationId);
      }
      newConvos.set(conversation.conversationId, conversation);
    });

    const updatedConvos = Array.from(newConvos.values());

    setConversations(updatedConvos);
  };

  useEffect(() => {
    axiosPrivate
      .get(`/api/User/UserProfile/${localStorage.getItem("loginid")}`)
      .then((res) => {
        console.log(res.data);
        localStorage.setItem("displayPictureURL", res.data.displayPictureURL);
        localStorage.setItem("dob", res.data.dob);
        localStorage.setItem("createDate", res.data.createDate);
        setUserDP(res.data.displayPictureURL);
        localStorage.setItem("name", res.data.name);
        localStorage.setItem("userName", res.data.userName);
        localStorage.setItem(
          "backgroundPictureURL",
          res.data.backgroundPictureURL
        );
      })
      .catch((err) => {
        console.log(err);
      });

    let clientId = localStorage.getItem("userId");

    console.log(clientId);

    const connectionConvo1 = new HubConnectionBuilder()
      .withUrl(
        `https://closeconnect.azurewebsites.net/hubs/homeconversations?clientId=${clientId}`
      )
      .withAutomaticReconnect()
      .build();

    // Start the connection
    connectionConvo1.start().then(
      () => {
        console.log("Chat Connection established");
      },
      () => {
        console.log("Chat Rejected");
      }
    );

    // Listen for incoming notifications
    connectionConvo1.on("ReceiveHomeMessage", (result) => {
      console.log("received something");
      console.log(result);
      const newConversation = result.conversation;
      newConversation.isRead = false;

      updateUniqueConvos([...conversations, newConversation]);
    });

    // Fetch existing notifications from the server when the component mounts

    // Connect to the SignalR hub
    const connection = new HubConnectionBuilder()
      .withUrl(
        `https://closeconnect.azurewebsites.net/hubs/notifs?clientId=${clientId}`
      )
      .withAutomaticReconnect()
      .build();

    // Start the connection
    connection.start().then(
      () => {
        console.log("Connection established");
      },
      () => {
        console.log("Rejected");
      }
    );

    // Listen for incoming notifications
    connection.on("ReceiveNotification", (message) => {
      console.log("received something");
      console.log(message);

      if (message.hasOwnProperty("isRead")) {
        setNotifMessage(message.message);

        if (!message.isRead) setNumberOfNotifs((prev) => prev + 1);

        setNotifications((prev) =>
          [...prev, message].sort((a, b) => b.id - a.id)
        );
      } else {
        setNotifMessage(
          `${message.senderName} just sent you a friend request!`
        );

        setNumberOfFriendRequests((prev) => prev + 1);
        setFriendRequests((prev) =>
          [...prev, message].sort(
            (a, b) => b.friendRequestId - a.friendRequestId
          )
        );
      }
      setOpenNotif(true);
    });

    // Fetch existing notifications from the server when the component mounts
    fetchConversations();
    fetchFriendRequests();
    fetchNotifications();
    fetchDrafts();

    // Clean up the connection on unmount
    return () => {
      connection.stop();
      connectionConvo1.stop();
    };

    // fetchFriendRequests();
    // fetchNumberOfFriendRequests();
  }, []);

  const fetchConversations = async () => {
    try {
      // setInProgress("loading");
      const response = await axiosPrivate.get(
        `/api/Conversation/GetAllConversationsForCurrentUser/${localStorage.getItem(
          "userId"
        )}`
      );
      console.log(response);
      const data = response.data;
      // setInProgress("done");
      setConversations(data);
      const count = data.reduce((count, obj) => {
        if (!obj.isRead) {
          return count + 1;
        }
        return count;
      }, 0);
      setNumberOfConversations(count);
    } catch (err) {
      console.error(err.response.data);
    }
  };

  const fetchFriendRequests = async () => {
    try {
      // setInProgress("loading");
      const response = await axiosPrivate.get(
        `/api/Friendship/GetAllFriendRequests/${localStorage.getItem(
          "loginid"
        )}/received/`
      );
      console.log(response);
      const data = response.data;
      // setInProgress("done");
      setFriendRequests(data);
      setNumberOfFriendRequests(data.length);
    } catch (err) {
      console.error(err.response.data);
    }
  };

  const fetchNotifications = async () => {
    try {
      // setInProgress("loading");
      const response = await axiosPrivate.get(
        `/api/Notification/GetAllNotifications/${localStorage.getItem(
          "loginid"
        )}`
      );
      console.log(response);
      const data = response.data;
      // setInProgress("done");
      // setFriendRequests(data);
      setNotifications(data);
      setNumberOfNotifs(data.filter((d) => !d.isRead).length);
    } catch (err) {
      console.error(err.response.data);
    }
  };

  const fetchDrafts = async () => {
    try {
      const response = await axiosPrivate.get(
        `/api/Draft/GetDrafts/${localStorage.getItem("loginid")}`
      );
      console.log(response);
      const data = response.data;
      setDrafts(data);
      setNumberOfDrafts(data.length);
    } catch (err) {
      console.error(err.response.data);
    }
  };

  const theme = createTheme({
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1536,
        xxl: 1860,
      },
    },
  });

  return (
    <>
      <CssBaseline />
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={openNotif}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <SnackbarContent message={notifMessage} />
      </Snackbar>
      <Modal
        open={openMenu}
        onClose={handleCloseMenu}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={menuModalStyle}>
          <LeftBox
            onMobile={openMenu}
            onComponentSelect={handleComponentSelect}
            numberOfConversations={numberOfConversations}
            numberOfFriendRequests={numberOfFriendRequests}
            numberOfNotifs={numberOfNotifs}
            numberOfDrafts={numberOfDrafts}
            setNumberOfDrafts={setNumberOfDrafts}
            setDrafts={setDrafts}
            setSelectedUserProfileId={setSelectedUserProfileId}
            userDP={userDP}
            handleCloseMenu={handleCloseMenu}
          />
        </Box>
      </Modal>
      <Container
        maxWidth="xl"
        // disableGutters={useMediaQuery(theme.breakpoints.only("sm"))}
        // disableGutters={theme.breakpoints.down("sm")}
      >
        <Grid container sx={{ textAlign: "center" }}>
          <Grid
            // bgcolor="red"
            item
            sx={{
              display: { xs: "none", sm: "block" },
            }}
            sm={2}
            md={2}
            lg={1}
            xl={1}
          >
            <Box
              sx={{
                position: "sticky",
                top: 0,
                // overflow: "scrollable",
                // height: "100vh",
                margin: 0,
                padding: 0,
                display: "flex",
                justifyContent: {
                  sm: "flex-end",
                  md: "flex-end",
                  lg: "flex-end",
                  xl: "flex-start",
                },
              }}
            >
              <LeftBox
                onComponentSelect={handleComponentSelect}
                numberOfConversations={numberOfConversations}
                numberOfFriendRequests={numberOfFriendRequests}
                numberOfNotifs={numberOfNotifs}
                numberOfDrafts={numberOfDrafts}
                setNumberOfDrafts={setNumberOfDrafts}
                setDrafts={setDrafts}
                setSelectedUserProfileId={setSelectedUserProfileId}
                userDP={userDP}
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={10} md={10} lg={7} xl={7}>
            <MainContent
              displayMenuHandler={displayMenuHandler}
              searchTermMain={searchTermMain}
              selectedComponent={selectedComponent}
              friendRequests={friendRequests}
              numberOfFriendRequests={numberOfFriendRequests}
              setFriendRequests={setFriendRequests}
              setNumberOfFriendRequests={setNumberOfFriendRequests}
              notifications={notifications}
              setNotifications={setNotifications}
              numberOfNotifs={numberOfNotifs}
              setNumberOfNotifs={setNumberOfNotifs}
              drafts={drafts}
              numberOfDrafts={numberOfDrafts}
              setDrafts={setDrafts}
              setNumberOfDrafts={setNumberOfDrafts}
              selectedNotif={selectedNotif}
              setSelectedNotif={setSelectedNotif}
              selectedUserProfileId={selectedUserProfileId}
              setSelectedUserProfileId={setSelectedUserProfileId}
              userDP={userDP}
              setUserDP={setUserDP}
              conversations={conversations}
              setConversations={setConversations}
              numberOfConversations={numberOfConversations}
              setNumberOfConversations={setNumberOfConversations}
              selectedConversation={selectedConversation}
              setSelectedConversation={setSelectedConversation}
              markAllAsReadFunc={markAllAsReadFunc}
            />
            {/* <Box>
              {users.map((user) => {
                return <h2>{user.name}</h2>;
              })}
            </Box> */}
          </Grid>
          <Grid
            item
            sx={{
              display: { xs: "none", sm: "none", md: "none", lg: "block" },
              height: "100%",
              overflowY: "scroll",
              position: "fixed",
              right: { lg: 20, xl: 300 },
              bottom: { lg: 20, xl: 300 },
              top: 0,
              marginLeft: { md: 0, lg: "150px" },
              [theme.breakpoints.between("xl", "xxl")]: {
                right: 100,
                bottom: 100,
              },
            }}
            lg={4}
            xl={4}
          >
            <RightBox
              onComponentSelect={handleComponentSelect}
              setSearchTermMain={setSearchTermMain}
              setSelectedUserProfileId={setSelectedUserProfileId}
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Home;
