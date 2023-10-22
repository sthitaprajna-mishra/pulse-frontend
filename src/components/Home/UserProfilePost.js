import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ModeCommentOutlinedIcon from "@mui/icons-material/ModeCommentOutlined";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
// import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import { Box, TextField, Button, Tooltip } from "@mui/material";
import { getTimeAgo, formatDate } from "../Utility/TimeHelpers";
import { axiosPrivate } from "../../api/axios";
import Comment from "./Comment";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material";
import "../../styles.css";

const bull = (
  <Box
    component="span"
    sx={{ display: "inline-block", mx: "2px", transform: "scale(0.8)" }}
  >
    •
  </Box>
);

export default function UserProfilePost({
  setSelectedUserProfileId,
  post,
  userProfilePosts = null,
  setUserProfilePosts = null,
}) {
  const theme = useTheme();

  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [liked, setLiked] = useState(post.isLikedByCurrentUser);
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState("");
  const [updateComments, setUpdateComments] = useState(false);

  console.log("inside Post");

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  useEffect(() => {
    fetchComments();
  }, [updateComments]);

  const fetchComments = async () => {
    const response = await axiosPrivate.get(
      `/api/Comment/GetAllComments/${
        post.postId
      }/?userId=${localStorage.getItem("userId")}`
    );
    // console.log(response);
    setComments(response.data);
  };

  const handleCommentSubmit = async () => {
    const response = await axiosPrivate.post(`/api/Comment/CreateComment`, {
      Text: comment,
      PostId: post.postId,
      AuthorId: localStorage.getItem("userId"),
    });
    // console.log(response);
    if (response.status == 200) {
      const res = await axiosPrivate.put(
        `/api/Post/UpdatePost/${post.postId}/?userId=${localStorage.getItem(
          "userId"
        )}&likesOrComments=comments`
      );
      if (res.status == 200) {
        console.log("line 66");
        setComment("");
        if (userProfilePosts != null) {
          const updatedPosts = [...userProfilePosts];
          const postIndex = updatedPosts.findIndex(
            (p) => p.postId === post.postId
          );
          if (postIndex !== -1) {
            updatedPosts[postIndex] = {
              ...updatedPosts[postIndex],
              numberOfComments: post.numberOfComments + 1,
            };

            setUserProfilePosts(updatedPosts);
            setUpdateComments((prev) => !prev);
          }
        } else {
          console.log("arrived from notif");
        }
      }
    }
  };

  const handleShowComment = async () => {
    if (showComments) {
      setShowComments(false);
      return;
    }
    setShowComments(true);
    fetchComments();
  };

  const likePost = async () => {
    if (liked) {
      return;
    }
    setLiked(true);
    axiosPrivate
      .put(
        `/api/Post/UpdatePost/${post.postId}/?userId=${localStorage.getItem(
          "userId"
        )}&likesOrComments=likes`
      )
      .then((response) => {
        // console.log(response);
        // setInProgress(false);
        if (response.status == 200) {
          //   handleCreatePostModalClose();
          if (userProfilePosts != null) {
            const updatedPosts = [...userProfilePosts];
            const postIndex = updatedPosts.findIndex(
              (p) => p.postId === post.postId
            );
            if (postIndex !== -1) {
              updatedPosts[postIndex] = {
                ...updatedPosts[postIndex],
                numberOfLikes: post.numberOfLikes + 1,
              };

              setUserProfilePosts(updatedPosts);
            }
            console.log("You liked a post");
          } else {
            console.log("arrive from notif");
          }
        }
      });
  };

  return (
    <Card
      sx={{
        borderRadius: 0,
        "&:hover": {
          bgcolor: "#EFF3F4",
          //   cursor: "pointer",
          transition: "0.3s all",
        },
      }}
      // sx={{ maxWidth: 345 }}
    >
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", columnGap: 1 }}>
            <Avatar
              src={post.authorDisplayPictureURL} // "https://ik.imagekit.io/pluipdnq6/2e2a4b2e-c906-4698-8a7e-81d8844ea53b_wDSAkdgJC"
              sx={{
                width: 44,
                height: 44,
                "&:hover": {
                  cursor: "pointer",
                },
              }}
              //   onClick={
              //     localStorage.getItem("userId") === post.authorId
              //       ? null
              //       : () => setSelectedUserProfileId(post.authorId)
              //   }
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "start",
                alignItems: "center",
                columnGap: 1,
              }}
            >
              <Typography
                className={isSmallScreen ? "hidecontent" : ""}
                fontSize="1rem"
                fontWeight={600}
                sx={{
                  fontSize: {
                    xs: "0.8rem",
                    sm: "0.8rem",
                    md: "0.8rem",
                    lg: "1rem",
                    // xl: "1rem",
                  },
                  "&:hover": {
                    textDecoration: "underline",
                    cursor: "pointer",
                  },
                }}
                // onClick={() => setSelectedUserProfileId(post.authorId)}
              >
                {post.authorName}{" "}
              </Typography>
              {bull}

              <Typography
                className={isSmallScreen ? "hidecontent" : ""}
                fontWeight="200"
                color="#778da9"
                sx={{
                  fontSize: {
                    xs: "0.8rem",
                    sm: "0.8rem",
                    md: "0.8rem",
                    lg: "1rem",
                    // xl: "1rem",
                  },
                  "&:hover": {
                    textDecoration: "underline",
                    cursor: "pointer",
                  },
                }}
                // onClick={() => setSelectedUserProfileId(post.authorId)}
              >
                @{post.authorUserName}
              </Typography>
              {bull}
              <Typography
                className={isSmallScreen ? "hidecontent" : ""}
                sx={{
                  fontSize: {
                    xs: "0.8rem",
                    sm: "0.8rem",
                    md: "0.8rem",
                    lg: "1rem",
                    // xl: "1rem",
                  },
                }}
                fontWeight="200"
                color="#778da9"
              >
                {getTimeAgo(post.createDate).includes("week")
                  ? formatDate(post.createDate)
                  : getTimeAgo(post.createDate)}
              </Typography>
            </Box>
          </Box>

          <Box>
            {/* <Tooltip title="Bookmark">
              <IconButton aria-label="share">
                <BookmarkBorderOutlinedIcon />
              </IconButton>
            </Tooltip> */}
            <IconButton aria-label="settings">
              <MoreVertIcon />
            </IconButton>
          </Box>
        </Box>

        <Typography
          textAlign="left"
          variant="body2"
          color="text.primary"
          paddingLeft={6.5}
        >
          {post.content}
        </Typography>
      </CardContent>
      <Box
        sx={{
          display: "flex",
          justifyContent: "start",
          columnGap: 3,
          paddingLeft: 7.25,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Tooltip title="Like">
            <>
              <IconButton
                title="Like"
                aria-label="like"
                onClick={() => likePost()}
              >
                {liked ? (
                  <FavoriteIcon color="error" />
                ) : (
                  <FavoriteBorderOutlinedIcon />
                )}
              </IconButton>
            </>
          </Tooltip>
          <Typography textAlign="left" variant="body2">
            {post.numberOfLikes}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Tooltip title="Comment">
            <>
              <IconButton
                title="Comment"
                aria-label="comment"
                onClick={() => handleShowComment()}
              >
                <ModeCommentOutlinedIcon />
              </IconButton>
            </>
          </Tooltip>
          <Typography textAlign="left" variant="body2">
            {post.numberOfComments}
          </Typography>
        </Box>
        {/* <Box>
          <IconButton title="Bookmark" aria-label="share">
            <BookmarkBorderOutlinedIcon />
          </IconButton>
        </Box> */}
      </Box>
      {showComments ? (
        <>
          <Box
            sx={{
              display: "flex",
              justifyContent: "start",
              alignItems: "center",
              paddingLeft: 7.25,
              paddingY: 1,
              columnGap: 2,
              //   backgroundColor: "#edf6f9",
            }}
          >
            <TextField
              // fullWidth
              multiline
              sx={{
                flex: 2,
                backgroundColor: "#FFFFFF",
                border: 0, // Set the border to 0
                outline: "none",
              }}
              variant="filled"
              size="small"
              value={comment}
              onChange={handleCommentChange}
              placeholder="Write a comment..."
            />
            <Button
              variant="contained"
              onClick={handleCommentSubmit}
              sx={{
                flex: 0.5,
                fontSize: 12,
                fontWeight: 700,
                textTransform: "capitalize",
                textAlign: "left",
                px: 0,
                mr: 1,
                height: "2rem",
                borderRadius: "212px",
              }}
            >
              Comment
            </Button>
          </Box>
          <Box>
            {comments ? (
              comments.map((comment) => {
                return (
                  <Comment
                    key={comment.commentId}
                    postId={post.postId}
                    userProfilePosts={userProfilePosts}
                    comment={comment}
                    comments={comments}
                    numberOfComments={post.numberOfComments}
                    setComments={setComments}
                    setUserProfilePosts={setUserProfilePosts}
                    setUpdateComments={setUpdateComments}
                    setSelectedUserProfileId={setSelectedUserProfileId}
                  />
                );
              })
            ) : (
              <h4>No comments</h4>
            )}
          </Box>
        </>
      ) : null}
    </Card>
  );
}
