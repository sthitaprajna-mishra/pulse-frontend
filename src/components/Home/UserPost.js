import * as React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import ModeCommentOutlinedIcon from "@mui/icons-material/ModeCommentOutlined";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import { Box } from "@mui/material";

const bull = (
  <Box
    component="span"
    sx={{ display: "inline-block", mx: "2px", transform: "scale(0.8)" }}
  >
    •
  </Box>
);

export default function UserPost({ post }) {
  return (
    <Card
      sx={{ borderRadius: 0 }}
      // sx={{ maxWidth: 345 }}
    >
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            R
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        sx={{
          textAlign: "left",
          paddingBottom: 0,
        }}
        title={
          <Box
            sx={{
              display: "flex",
              justifyContent: "start",
              alignItems: "center",
              columnGap: 1,
            }}
          >
            <Typography>Shrimp and Chorizo Paella </Typography>
            <Typography variant="h5" component="div">
              {bull}
            </Typography>
            <Typography fontWeight="200" color="#778da9">
              @recipeman
            </Typography>
          </Box>
        }
        subheader="September 14, 2016"
      />
      <CardContent>
        <Typography
          textAlign="left"
          variant="body2"
          color="text.primary"
          paddingX={6.5}
        >
          {post.content}
        </Typography>
      </CardContent>
      <CardActions
        disableSpacing
        sx={{
          display: "flex",
          justifyContent: "start",
          columnGap: 3,
          paddingLeft: 7,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <IconButton aria-label="like">
            <FavoriteBorderOutlinedIcon />
          </IconButton>
          <Typography textAlign="left" variant="body2" color="text.secondary">
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
          <IconButton aria-label="comment">
            <ModeCommentOutlinedIcon />
          </IconButton>
          <Typography textAlign="left" variant="body2" color="text.secondary">
            {post.numberOfComments}
          </Typography>
        </Box>
        <Box>
          <IconButton aria-label="share">
            <ReportProblemOutlinedIcon />
          </IconButton>
        </Box>
      </CardActions>
    </Card>
  );
}
