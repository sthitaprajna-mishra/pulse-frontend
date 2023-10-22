import React, { useState, useEffect } from "react";
import {
  Box,
  Avatar,
  Typography,
  Badge,
  IconButton,
  Tabs,
  Tab,
} from "@mui/material";
import PropTypes from "prop-types";
import CakeOutlinedIcon from "@mui/icons-material/CakeOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import Diversity1OutlinedIcon from "@mui/icons-material/Diversity1Outlined";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import bg1 from "../../assets/bg1.jpg";
import axios, { axiosPrivate } from "../../api/axios";
import Axios from "axios";
import { v4 as uuidv4 } from "uuid";
import UserProfilePosts from "./UserProfilePosts";
import { SearchUserRelationshipCodes } from "../Utility/Constants";
import Chip from "@mui/material/Chip";
import FaceIcon from "@mui/icons-material/Face";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import CallMadeOutlinedIcon from "@mui/icons-material/CallMadeOutlined";
import CallReceivedOutlinedIcon from "@mui/icons-material/CallReceivedOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import Heading from "./Heading";
import Friends from "./Friends";
import {
  formatDateInternational,
  formatDateInternationalMonthYear,
} from "../Utility/TimeHelpers";
import InProgress from "../Utility/InProgress";

const SIGN_URL = "/api/auth/CalculateSignature";

const IMAGEKITIO_PUBLIC_KEY = "public_4acFW+bY8EFRt2LbrdVfdem+MHo=";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const UserProfile = ({
  userId,
  setSelectedUserProfileId,
  userDP,
  setUserDP,
}) => {
  const [value, setValue] = React.useState(0);
  const [numOfFriends, setNumOfFriends] = React.useState("Friends");

  const [friends, setFriends] = useState([]);

  const fetchFriends = async (userId) => {
    const response = await axiosPrivate.get(
      `/api/Friendship/GetAllFriendsByUserId/${userId}/${localStorage.getItem(
        "userId"
      )}`
    );
    console.log(response.data);
    if (response.data && response.data.length > 0) {
      let num = response.data.length;
      console.log(num);
      setNumOfFriends(`Friends (${num})`);
    } else {
      setNumOfFriends(`Friends`);
    }
    setFriends(response.data);
  };

  useEffect(() => {
    fetchFriends(userId);
  }, [userId]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [backgroundURL, setBackgroundURL] = useState(
    localStorage.getItem("backgroundPictureURL")
  );
  const [userProfile, setUserProfile] = useState(null);
  let isCurrentUser = localStorage.getItem("userId") === userId;
  console.log(`isCurrentUser: ${isCurrentUser}`);

  const [sentRequest, setSentRequest] = useState(false);

  const sendFriendRequest = async () => {
    const response = await axiosPrivate.post(
      `/api/Friendship/SendFriendRequest`,
      {
        SenderId: localStorage.getItem("userId"),
        ReceiverId: userId,
      }
    );

    if (response.status == 200) {
      setSentRequest(true);
    }

    console.log();
  };

  const fetchUserData = async () => {
    axiosPrivate
      .get(`/api/User/UserData/${userId}/${localStorage.getItem("userId")}`)
      .then((response) => {
        if (response.status === 200) {
          console.log(response.data);
          setUserProfile(response.data);
        }
      });
  };

  if (userProfile != null && userProfile.id != userId) {
    fetchUserData();
  }
  function getBase64(file) {
    return new Promise(function (resolve, reject) {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onerror = reject;
      reader.onload = function () {
        resolve(reader.result);
      };
    });
  }

  const handleUserProfilePictureUpload = (e, isBackgroundParam) => {
    const selectedPicture = e.target.files[0];
    console.log("just uploaded");
    console.log(selectedPicture);

    // file type validation
    if (
      !["image/jpeg", "image/jpg", "image/png"].includes(selectedPicture.type)
    ) {
      return;
    }
    // file size validation
    if (selectedPicture.size >= 2000000) {
      return;
    }
    // setImageFile(selectedPicture);

    getBase64(selectedPicture).then((res) => {
      console.log(res + "");
      localStorage.setItem("tempUserDPBase64", res + "");
      updateUserDP(isBackgroundParam);
    });
  };

  const updateUserDP = async (isBackground) => {
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };

    axios.get(SIGN_URL).then((res) => {
      Axios.post(
        "https://upload.imagekit.io/api/v1/files/upload",
        {
          file:
            localStorage.getItem("tempUserDPBase64").length > 0
              ? localStorage.getItem("tempUserDPBase64")
              : "https://xsgames.co/randomusers/avatar.php?g=pixel",
          publicKey: IMAGEKITIO_PUBLIC_KEY,
          signature: res.data.result.signature,
          expire: res.data.result.expire,
          token: res.data.result.token,
          fileName: uuidv4(),
          useUniqueFileName: true,
        },
        config
      ).then((res) => {
        console.log(res);

        let newURL = res.data.url;
        let photoType = isBackground ? "backgroundPicture" : "displayPicture";

        axiosPrivate
          .put(
            `/api/User/UpdateUserPicture/${userId}?URL=${newURL}&photoType=${photoType}`
          )
          .then((res) => {
            console.log(res);
            if (res.status == 200) {
              console.log("DP updated");
              if (isBackground) {
                localStorage.removeItem("backgroundPictureURL");
                localStorage.setItem("backgroundPictureURL", newURL);
                setBackgroundURL(newURL);
              } else {
                localStorage.removeItem("displayPictureURL");
                localStorage.setItem("displayPictureURL", newURL);
                setUserDP(newURL);
              }
            } else {
              console.log("error while updating DP");
            }
          });
      });
    });
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <>
      {userProfile ? (
        <>
          <Box
            display="flex"
            rowGap={2}
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            // mt={8}
          >
            <Box
              display="flex"
              justifyContent="center"
              sx={{
                // bgcolor: "#EFF3F4",
                width: "100%",
                backgroundImage: `url(${
                  isCurrentUser
                    ? !backgroundURL
                      ? `https://ik.imagekit.io/pluipdnq6/bg1.jpg?updatedAt=1690730731584`
                      : backgroundURL
                    : userProfile.backgroundPictureURL
                    ? `https://ik.imagekit.io/pluipdnq6/bg1.jpg?updatedAt=1690730731584`
                    : userProfile.backgroundPictureURL
                })`, //`url(${bg1})`,
                objectFit: "cover",
                backgroundPosition: "center",
              }}
            >
              {isCurrentUser ? (
                <IconButton
                  color="primary"
                  aria-label="upload picture"
                  component="label"
                  disableRipple
                  sx={{
                    mt: "2.5rem",
                    transform: "translate(900%, 50%)",
                    //   "&:hover": {
                    //     boxShadow: "none",
                    //   },
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: "primary.main",
                      height: 30,
                      width: 30,
                    }}
                  >
                    <input
                      hidden
                      accept="image/*"
                      type="file"
                      onChange={(e) => handleUserProfilePictureUpload(e, true)}
                    />
                    <PhotoCamera sx={{ height: 20, width: 20 }} />
                  </Avatar>
                </IconButton>
              ) : null}

              {isCurrentUser ? (
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  badgeContent={
                    <IconButton
                      color="primary"
                      aria-label="upload picture"
                      component="label"
                      sx={{
                        mt: "2.5rem",
                        transform: "translate(-45%, 150%)",
                      }}
                    >
                      <Avatar
                        sx={{
                          bgcolor: "primary.main",
                          height: 30,
                          width: 30,
                        }}
                      >
                        <input
                          hidden
                          accept="image/*"
                          type="file"
                          onChange={(e) =>
                            handleUserProfilePictureUpload(e, false)
                          }
                        />
                        <PhotoCamera sx={{ height: 20, width: 20 }} />
                      </Avatar>
                    </IconButton>
                  }
                >
                  <Avatar
                    // alt="Remy Sharp"
                    src={isCurrentUser ? userDP : userProfile.displayPictureURL} // "https://ik.imagekit.io/pluipdnq6/2e2a4b2e-c906-4698-8a7e-81d8844ea53b_wDSAkdgJC"
                    sx={{
                      mt: "2.5rem",
                      transform: "translate(-12.5%, 50%)",
                      width: 180,
                      height: 180,
                      border: "0.45rem solid white",
                      borderRadius: "50%",

                      //   mt: 2,
                      //   height: 60,
                      //   width: 60,
                      //   padding: 1,
                      //   border: `2px solid #bdbdbd`,
                    }}
                  />
                </Badge>
              ) : (
                <Avatar
                  // alt="Remy Sharp"
                  src={userProfile.displayPictureURL} // "https://ik.imagekit.io/pluipdnq6/2e2a4b2e-c906-4698-8a7e-81d8844ea53b_wDSAkdgJC"
                  sx={{
                    mt: "2.5rem",
                    transform: "translate(0%, 50%)",
                    width: 180,
                    height: 180,
                    border: "0.45rem solid white",
                    borderRadius: "50%",
                    // boxShadow: "0 0 20px rgba(255, 255, 255, 1)",
                  }}
                />
              )}
            </Box>
            <Box mt={10}>
              <Typography fontSize="1.2rem" fontWeight="700">
                {/* {localStorage.getItem("name")} */}
                {isCurrentUser
                  ? localStorage.getItem("name")
                  : userProfile.name}
              </Typography>
              <Typography fontSize="0.9rem" color="#778da9">
                @
                {isCurrentUser
                  ? localStorage.getItem("userName")
                  : userProfile.userName}
              </Typography>
            </Box>
          </Box>
          <Box display="flex" justifyContent="space-around" mt={5}>
            <Box display="flex" columnGap={1} alignItems="center">
              <CakeOutlinedIcon />
              <Typography fontSize="0.9rem" color="#778da9" mt={1}>
                Born{" "}
                {isCurrentUser
                  ? formatDateInternational(localStorage.getItem("dob"))
                  : formatDateInternational(userProfile.dob)}
              </Typography>
            </Box>
            <Box display="flex" columnGap={1} alignItems="center">
              <CalendarMonthOutlinedIcon />
              <Typography fontSize="0.9rem" color="#778da9" mt={1}>
                Joined{" "}
                {isCurrentUser
                  ? formatDateInternationalMonthYear(
                      localStorage.getItem("createDate")
                    )
                  : formatDateInternationalMonthYear(userProfile.createDate)}
              </Typography>
            </Box>
            {isCurrentUser ? null : (
              <Box
                display="flex"
                columnGap={1}
                alignItems="center"
                disabled={
                  userProfile.relationshipWithLoggedInUser !=
                    SearchUserRelationshipCodes.NotFriends || sentRequest
                }
                onClick={
                  userProfile.relationshipWithLoggedInUser ==
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
                        width: "120px",
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
                ) : userProfile.relationshipWithLoggedInUser ==
                  SearchUserRelationshipCodes.Friends ? (
                  <>
                    <Chip
                      sx={{
                        width: "120px",
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
                ) : userProfile.relationshipWithLoggedInUser ==
                  SearchUserRelationshipCodes.SentRequest ? (
                  <>
                    <Chip
                      sx={{
                        color: "#FFFFFF",
                        bgcolor: "#000000",
                        width: "120px",
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
                ) : userProfile.relationshipWithLoggedInUser ==
                  SearchUserRelationshipCodes.ReceivedRequest ? (
                  <>
                    <Chip
                      sx={{
                        color: "#FFFFFF",
                        bgcolor: "#000000",
                        width: "120px",
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
                        width: "120px",
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
          <Box sx={{ mt: 5, borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              sx={{ display: "flex" }}
              value={value}
              onChange={handleChange}
              aria-label="User Profile Tabs"
            >
              <Tab
                sx={{
                  flex: 1,
                  fontSize: 18,
                  fontWeight: 700,
                  textTransform: "capitalize",
                }}
                icon=<EmailOutlinedIcon />
                label="Posts"
                {...a11yProps(0)}
              ></Tab>
              <Tab
                sx={{
                  flex: 1,
                  fontSize: 18,
                  fontWeight: 700,
                  textTransform: "capitalize",
                }}
                icon=<Diversity1OutlinedIcon />
                label={numOfFriends}
                {...a11yProps(1)}
              />
            </Tabs>
          </Box>
          <CustomTabPanel value={value} index={0}>
            <UserProfilePosts
              setSelectedUserProfileId={setSelectedUserProfileId}
              userId={isCurrentUser ? localStorage.getItem("userId") : userId}
            />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <Friends
              friends={friends}
              fetchFriends={fetchFriends}
              setNumOfFriends={setNumOfFriends}
              setSelectedUserProfileId={setSelectedUserProfileId}
              userId={userId}
              isCurrentUser={isCurrentUser}
            />
          </CustomTabPanel>
        </>
      ) : (
        <InProgress />
      )}
    </>
  );
};

export default UserProfile;
