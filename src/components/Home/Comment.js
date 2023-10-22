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
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import { Box, TextField, Button } from "@mui/material";
import { getTimeAgo, formatDate } from "../Utility/TimeHelpers";
import { axiosPrivate } from "../../api/axios";
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

const Comment = ({
  postId,
  comment,
  comments,
  posts = null,
  setComments,
  numberOfComments,
  setPosts = null,
  setUpdateComments,
  setSelectedUserProfileId,
}) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleCommentClick = () => {
    // if (localStorage.getItem("userId") === comment.authorId) {
    //   return;
    // }
    console.log("comment clicked 123");
    setSelectedUserProfileId(comment.authorId);
  };

  const [liked, setLiked] = useState(comment.isLikedByCurrentUser);
  const [replyToUsername, setReplyToUsername] = useState("");
  const [reply, setReply] = useState("");

  //   console.log(comment);

  const likeComment = async () => {
    if (liked) {
      return;
    }
    setLiked(true);
    axiosPrivate
      .put(
        `/api/Comment/UpdateComment/${
          comment.commentId
        }/?currentUserId=${localStorage.getItem(
          "userId"
        )}&likesOrComments=likes`
      )
      .then((response) => {
        console.log(response);
        // setInProgress(false);
        if (response.status == 200) {
          //   handleCreatePostModalClose();
          const updatedComments = [...comments];
          const commentIndex = updatedComments.findIndex(
            (p) => p.commentId === comment.commentId
          );
          if (commentIndex !== -1) {
            updatedComments[commentIndex] = {
              ...updatedComments[commentIndex],
              numberOfLikes: comment.numberOfLikes + 1,
            };

            setComments(updatedComments);
          }
          console.log("You liked a comment");
        }
      });
  };

  const handleCommentChange = (event) => {
    setReply(event.target.value);
  };

  const handleReply = () => {
    setReplyToUsername(comment.authorUserName);
    setReply(`@${comment.authorUserName} `);
  };

  const handleCommentSubmit = async () => {
    const response = await axiosPrivate.post(`/api/Comment/CreateComment`, {
      Text: reply,
      PostId: postId,
      ParentCommentId: comment.commentId,
      AuthorId: localStorage.getItem("userId"),
    });

    if (response.status == 200) {
      setReplyToUsername(null);
      const result = await axiosPrivate.put(
        `/api/Comment/UpdateComment/${
          comment.commentId
        }/?currentUserId=${localStorage.getItem(
          "userId"
        )}&likesOrComments=comments`
      );

      const updatedComments = [...comments];
      const commentIndex = updatedComments.findIndex(
        (p) => p.commentId === comment.commentId
      );
      if (commentIndex !== -1) {
        updatedComments[commentIndex] = {
          ...updatedComments[commentIndex],
          numberOfComments: comment.numberOfComments + 1,
        };

        console.log(updatedComments);

        setComments(updatedComments);
      }

      if (result.status == 200) {
        const res = await axiosPrivate.put(
          `/api/Post/UpdatePost/${postId}/?userId=${localStorage.getItem(
            "userId"
          )}&likesOrComments=comments`
        );
        if (res.status == 200) {
          if (posts != null) {
            console.log("line 66");
            setReply("");
            const updatedPosts = [...posts];
            const postIndex = updatedPosts.findIndex(
              (p) => p.postId === postId
            );
            if (postIndex !== -1) {
              updatedPosts[postIndex] = {
                ...updatedPosts[postIndex],
                numberOfComments: numberOfComments + 1,
              };

              setPosts(updatedPosts);
              setUpdateComments((prev) => !prev);
            }
          } else {
            console.log("arrive from notif");
          }
        }
      }
    }
  };

  return (
    <Card
      sx={{
        borderRadius: 0,
        pl: 5,
        "&:hover": {
          bgcolor: "#EFF3F4",
          cursor: "pointer",
          transition: "0.3s all",
        },
      }}
      // sx={{ maxWidth: 345 }}
    >
      <CardContent sx={comment.parentCommentId != null ? { ml: 6 } : null}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", columnGap: 1 }}>
            <Avatar
              src={comment.authorDisplayPictureURL} // "https://ik.imagekit.io/pluipdnq6/2e2a4b2e-c906-4698-8a7e-81d8844ea53b_wDSAkdgJC"
              sx={{
                width: 36,
                height: 36,
                "&:hover": {
                  textDecoration: "underline",
                  cursor: "pointer",
                },
              }}
              onClick={handleCommentClick}
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "start",
                alignItems: "center",
                columnGap: isSmallScreen ? 0.5 : 1,
                pl: 1,
              }}
            >
              <Typography
                className={isSmallScreen ? "hidecontent" : ""}
                sx={{
                  maxWidth: "100%",
                  fontSize: {
                    xs: "0.8rem",
                    sm: "0.8rem",
                    md: "0.8rem",
                    lg: "0.9rem",
                    // xl: "1rem",
                  },
                  "&:hover": {
                    textDecoration: "underline",
                    cursor: "pointer",
                  },
                }}
                fontWeight={600}
                onClick={handleCommentClick}
              >
                {comment.authorName}{" "}
              </Typography>
              {bull}
              <Typography
                className={isSmallScreen ? "hidecontent" : ""}
                sx={{
                  fontSize: {
                    xs: "0.8rem",
                    sm: "0.8rem",
                    md: "0.8rem",
                    lg: "0.9rem",
                    // xl: "1rem",
                  },
                  "&:hover": {
                    textDecoration: "underline",
                    cursor: "pointer",
                  },
                }}
                fontSize="0.9rem"
                fontWeight="200"
                color="#778da9"
                onClick={handleCommentClick}
              >
                @{comment.authorUserName}
              </Typography>
              {bull}
              <Typography
                className={isSmallScreen ? "hidecontent" : ""}
                sx={{
                  fontSize: {
                    xs: "0.8rem",
                    sm: "0.8rem",
                    md: "0.8rem",
                    lg: "0.9rem",
                    // xl: "1rem",
                  },
                }}
                fontWeight="200"
                color="#778da9"
              >
                {getTimeAgo(comment.createDate).includes("week")
                  ? formatDate(comment.createDate)
                  : getTimeAgo(comment.createDate)}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Typography
          textAlign="left"
          variant="body2"
          color="text.primary"
          paddingLeft={6.5}
        >
          {comment.text}
        </Typography>
      </CardContent>
      <Box
        sx={
          comment.parentCommentId != null
            ? {
                display: "flex",
                justifyContent: "start",
                columnGap: 3,
                paddingLeft: 7.25,
                ml: 6,
              }
            : {
                display: "flex",
                justifyContent: "start",
                columnGap: 3,
                paddingLeft: 7.25,
              }
        }
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <IconButton
            aria-label="like"
            onClick={() => likeComment()}
            // fontSize="20px"
          >
            {liked ? (
              <FavoriteIcon fontSize="small" color="error" />
            ) : (
              <FavoriteBorderOutlinedIcon fontSize="small" />
            )}
          </IconButton>
          <Typography textAlign="left" variant="body2">
            {comment.numberOfLikes}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <IconButton
            aria-label="comment" //onClick={() => handleShowComment()}
          >
            <ModeCommentOutlinedIcon fontSize="small" />
          </IconButton>
          <Typography textAlign="left" variant="body2">
            {comment.numberOfComments}
          </Typography>
        </Box>
        <Button
          variant="contained"
          onClick={() => handleReply()}
          sx={{
            // flex: 0.5,
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
          Reply
        </Button>
      </Box>
      {replyToUsername ? (
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
            value={reply}
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
      ) : null}
    </Card>
  );
};

export default Comment;
