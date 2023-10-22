import React from "react";
import { Box, Typography } from "@mui/material";
import { getTimeAgo } from "../Utility/TimeHelpers";

const HappeningItem = ({ newsItem }) => {
  const handleOpenNews = (url) => {
    window.open(url, "_blank");
  };

  return (
    <Box
      sx={{
        py: "0.5rem",
        px: "1rem",
        display: "flex",
        justifyContent: "space-between",
        columnGap: 2,
        "&:hover": {
          bgcolor: "#E1E8EA",
          cursor: "pointer",
          transition: "background-color 0.3s",
        },
      }}
      onClick={() => handleOpenNews(newsItem.url)}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "start",
        }}
      >
        <Typography
          fontSize="0.8rem"
          fontWeight="200"
          color="#778da9"
          textAlign="left"
        >
          {newsItem.source} &#x2022; {getTimeAgo(newsItem.published_at)}
        </Typography>
        <Typography fontSize="0.9rem" fontWeight="700" textAlign="left">
          {newsItem.title}
        </Typography>
      </Box>
      <Box>
        <img
          alt="happeningImage"
          src={newsItem.image}
          style={{
            width: "68px",
            height: "68px",
            objectFit: "cover",
            borderRadius: "10px",
          }}
        />
      </Box>
    </Box>
  );
};

export default HappeningItem;
