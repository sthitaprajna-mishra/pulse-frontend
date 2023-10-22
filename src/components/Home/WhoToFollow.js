import React from "react";
import { Box, Button, Typography } from "@mui/material";
import VerifiedIcon from "@mui/icons-material/Verified";
import LaunchIcon from "@mui/icons-material/Launch";

const WhoToFollow = () => {
  return (
    <Box
      sx={{
        height: "auto",
        bgcolor: "#EFF3F4",
        mt: "2rem",
        ml: "0.5rem",
        pt: "1rem",
        borderRadius: "20px",
        width: "350px",
        // display: "flex",
        // flexDirection: "column",
        // alignItems: "start",
      }}
    >
      <Box sx={{ textAlign: "left", pb: "1.5rem", pl: "1rem" }}>
        <Typography fontSize="1.4rem" fontWeight="700">
          Who to follow
        </Typography>
      </Box>
      <Box
        sx={{
          py: "0.5rem",
          px: "1rem",
          display: "flex",
          justifyContent: "space-between",
          "&:hover": {
            bgcolor: "#E1E8EA",
            cursor: "pointer",
            transition: "background-color 0.3s",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            columnGap: 2,
            justifyContent: "space-between",
          }}
        >
          <Box>
            <img
              alt="whoToFollow1"
              src="https://pbs.twimg.com/profile_images/1559106887534014464/gtzFvYzr_400x400.jpg"
              style={{
                width: "48px",
                height: "48px",
                objectFit: "cover",
                borderRadius: "50%",
              }}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "start",
            }}
          >
            <Box
              sx={{
                display: "flex",
                columnGap: 0.5,
                alignItems: "center",
              }}
            >
              <Typography fontSize="1rem" fontWeight="700">
                Major Gaurav Ar...
              </Typography>
              <VerifiedIcon sx={{ fontSize: "1.2rem", color: "#1D9BF0" }} />
            </Box>

            <Typography fontSize="0.9rem" fontWeight="200" color="#778da9">
              @majorgauravarya
            </Typography>
          </Box>
        </Box>
        <Box>
          <Button
            variant="contained"
            sx={{
              color: "#FFFFFF",
              bgcolor: "#000000",
              textTransform: "capitalize",
              borderRadius: "20px",
              fontWeight: "bold",
              "&:hover": {
                bgcolor: "#262626",
                transition: "all 0.3s",
              },
            }}
          >
            Follow
          </Button>
        </Box>
      </Box>
      <Box
        sx={{
          // mt: 3,
          py: "0.5rem",
          px: "1rem",
          display: "flex",
          justifyContent: "space-between",
          "&:hover": {
            bgcolor: "#E1E8EA",
            cursor: "pointer",
            transition: "background-color 0.3s",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            columnGap: 2,
            justifyContent: "space-between",
          }}
        >
          <Box>
            <img
              alt="whoToFollow2"
              src="https://pbs.twimg.com/profile_images/1411235524250005509/aKapTpMD_400x400.jpg"
              style={{
                width: "48px",
                height: "48px",
                objectFit: "cover",
                borderRadius: "50%",
              }}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "start",
            }}
          >
            <Box
              sx={{
                display: "flex",
                columnGap: 0.5,
                alignItems: "center",
              }}
            >
              <Typography fontSize="1rem" fontWeight="700">
                The Fauxy
              </Typography>
              <VerifiedIcon sx={{ fontSize: "1.2rem", color: "#1D9BF0" }} />
            </Box>
            <Typography fontSize="0.9rem" fontWeight="200" color="#778da9">
              @the_fauxy
            </Typography>
          </Box>
        </Box>
        <Box>
          <Button
            variant="contained"
            sx={{
              color: "#FFFFFF",
              bgcolor: "#000000",
              textTransform: "capitalize",
              borderRadius: "20px",
              fontWeight: "bold",
              "&:hover": {
                bgcolor: "#262626",
                transition: "all 0.3s",
              },
            }}
          >
            Follow
          </Button>
        </Box>
      </Box>
      <Box
        sx={{
          // mt: 3,
          py: "0.5rem",
          px: "1rem",
          display: "flex",
          justifyContent: "space-between",
          "&:hover": {
            bgcolor: "#E1E8EA",
            cursor: "pointer",
            transition: "background-color 0.3s",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            columnGap: 2,
            justifyContent: "space-between",
          }}
        >
          <Box>
            <img
              alt="whoToFollow3"
              src="https://pbs.twimg.com/profile_images/1438548612464644101/yhtvY1Fk_400x400.png"
              style={{
                width: "48px",
                height: "48px",
                objectFit: "cover",
                borderRadius: "2%",
              }}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "start",
            }}
          >
            <Box
              sx={{
                display: "flex",
                columnGap: 0.5,
                alignItems: "center",
              }}
            >
              <Typography fontSize="1rem" fontWeight="700">
                aramco
              </Typography>
              <VerifiedIcon sx={{ fontSize: "1.2rem", color: "#FFD700" }} />
            </Box>
            <Typography fontSize="0.9rem" fontWeight="200" color="#778da9">
              @aramco
            </Typography>
            <Box
              sx={{
                display: "flex",
                columnGap: 0.5,
                mt: 1,
                alignItems: "center",
              }}
            >
              <LaunchIcon sx={{ fontSize: "1rem" }} />
              <Typography fontSize="0.9rem" fontWeight="200" color="#778da9">
                Promoted
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box>
          <Button
            variant="contained"
            sx={{
              color: "#FFFFFF",
              bgcolor: "#000000",
              textTransform: "capitalize",
              borderRadius: "20px",
              fontWeight: "bold",
              "&:hover": {
                bgcolor: "#262626",
                transition: "all 0.3s",
              },
            }}
          >
            Follow
          </Button>
        </Box>
      </Box>
      <Box
        sx={{
          pt: "0.5rem",
          pb: "1rem",
          px: "1rem",
          display: "flex",
          justifyContent: "space-between",
          "&:hover": {
            bgcolor: "#E1E8EA",
            cursor: "pointer",
            borderBottomLeftRadius: "20px",
            borderBottomRightRadius: "20px",
            transition: "background-color 0.3s",
          },
        }}
      >
        <Box
          sx={{ display: "flex", flexDirection: "column", alignItems: "start" }}
        >
          <Typography fontSize="1rem" fontWeight="200" color="#1D9BF0">
            Show more
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default WhoToFollow;
