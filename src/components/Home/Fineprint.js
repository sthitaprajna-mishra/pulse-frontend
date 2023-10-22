import { Box, Typography } from "@mui/material";
import React from "react";

const Fineprint = () => {
  return (
    <Box
      sx={{
        maxWidth: "350px",
        display: "flex",
        flexDirection: "column",
        flexWrap: "wrap",
        ml: 2,
        mt: 8,
        mb: 2,
        pt: 2,
      }}
    >
      <Box sx={{ display: "flex", flexWrap: "wrap", columnGap: 2 }}>
        <Typography fontSize="0.8rem" fontWeight="200" color="#778da9">
          Terms of Service
        </Typography>
        <Typography fontSize="0.8rem" fontWeight="200" color="#778da9">
          Privacy Policy
        </Typography>
        <Typography fontSize="0.8rem" fontWeight="200" color="#778da9">
          Cookie Policy
        </Typography>
        <Typography fontSize="0.8rem" fontWeight="200" color="#778da9">
          Accessibility
        </Typography>
        <Typography fontSize="0.8rem" fontWeight="200" color="#778da9">
          Ads info
        </Typography>
        <Typography fontSize="0.8rem" fontWeight="200" color="#778da9">
          More
        </Typography>
      </Box>
      <Box sx={{ display: "flex" }}>
        <Typography fontSize="0.8rem" fontWeight="200" color="#778da9">
          &#xA9; 2023 Pulse, Inc.
        </Typography>
      </Box>
    </Box>
  );
};

export default Fineprint;
