import React from "react";
import { Box, Skeleton, Stack } from "@mui/material";

const SkeletonNotification = () => {
  return (
    <>
      <Box
        sx={{
          py: "0.5rem",
          px: "1rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          columnGap: 2,
          "&:hover": {
            bgcolor: "#E1E8EA",
            cursor: "pointer",
            transition: "background-color 0.3s",
          },
        }}
      >
        <Skeleton variant="circular" width={40} height={40} />
        <Skeleton variant="text" sx={{ maxWidth: 150, fontSize: "1rem" }} />
        <Stack>
          <Skeleton variant="text" sx={{ minWidth: 250, fontSize: "1rem" }} />
          <Skeleton variant="text" sx={{ minWidth: 250, fontSize: "1rem" }} />
        </Stack>
      </Box>
    </>
  );
};

export default SkeletonNotification;
