import React from "react";
import { Box, Modal, Typography, Button } from "@mui/material";

const Logout = ({ logoutModelOpen, handleLogoutModalClose, MODAL_STYLES }) => {
  const logout = () => {
    localStorage.removeItem("loginid");
    localStorage.removeItem("name");
    localStorage.removeItem("displayPictureURL");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("backgroundPictureURL");
    localStorage.removeItem("dob");
    localStorage.removeItem("createDate");
    window.location.href = "/";
  };

  return (
    <>
      <Modal
        open={logoutModelOpen}
        onClose={handleLogoutModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{ ...MODAL_STYLES, width: 400, maxWidth: 400 }}>
          <Typography>Are you sure you want to logout?</Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-evenly",
              gap: 2,
              pt: 2,
            }}
          >
            <Button
              variant="contained"
              sx={{ flex: 1 }}
              onClick={() => handleLogoutModalClose()}
            >
              No
            </Button>
            <Button
              variant="outlined"
              color="error"
              sx={{ flex: 1 }}
              onClick={() => logout()}
            >
              Yes
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default Logout;
