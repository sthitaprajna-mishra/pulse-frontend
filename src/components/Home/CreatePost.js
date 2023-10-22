import React, { useState, useEffect } from "react";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import GraphemeSplitter from "grapheme-splitter";
import TextField from "@mui/material/TextField";
import {
  Box,
  Modal,
  Typography,
  Button,
  Avatar,
  CircularProgress,
  IconButton,
  Snackbar,
} from "@mui/material";
import { axiosPrivate } from "../../api/axios";
import CloseIcon from "@mui/icons-material/Close";

const TOTAL_LIMIT = 280;

const CreatePost = ({
  createPostModelOpen,
  handleCreatePostModalClose,
  progress,
  setProgress,
  MODAL_STYLES,
  setNumberOfDrafts,
  setDrafts,
  content,
  isUpdate,
  draftId,
}) => {
  // console.log(
  //   `CreatePost comp opene. isUpdate: ${isUpdate}, content: ${content}`
  // );
  const [characterCount, setCharacterCount] = useState(0);
  const [postContent, setPostContent] = useState();
  const [inProgress, setInProgress] = useState(false);

  useEffect(() => {
    if (isUpdate) {
      setPostContent(content);
    }
  }, []);

  const calculateProgress = (event) => {
    const { key, target } = event;
    const text = target.value;

    setPostContent(text);

    const isEnterKey = key === "Enter";
    const isBackspaceKey = key === "Backspace";

    // Split text into grapheme clusters
    const splitter = new GraphemeSplitter();
    const graphemes = splitter.splitGraphemes(text);

    // Calculate character count based on the event
    let newCharacterCount = graphemes.length;

    if (isEnterKey) {
      // Increment character count by 2 for newline characters
      newCharacterCount += 2;
    } else if (isBackspaceKey) {
      // Decrement character count for backspace key
      newCharacterCount = Math.max(newCharacterCount - 1, 0);
    }

    // Check if character count exceeds the limit
    if (newCharacterCount > TOTAL_LIMIT) {
      event.preventDefault();
      return;
    }

    // Update the character count
    setCharacterCount(newCharacterCount);

    let percentage = (characterCount / TOTAL_LIMIT) * 100;
    setProgress(percentage);

    console.log(characterCount);
  };

  const saveAsDraft = async () => {
    setInProgress(true);
    axiosPrivate
      .post("/api/Draft/CreateDraft", {
        Content: postContent,
        AuthorId: localStorage.getItem("userId"),
        CharacterCount: characterCount,
      })
      .then((response) => {
        console.log(response);
        setInProgress(false);
        if (response.status == 200) {
          handleCreatePostModalClose();
          setNumberOfDrafts((prevDrafts) => prevDrafts + 1);
          axiosPrivate
            .get(`/api/Draft/GetDrafts/${localStorage.getItem("loginid")}`)
            .then((response) => {
              const data = response.data;
              setDrafts(data);
            });

          console.log("Draft saved successfully");
        }
      });
  };

  const saveChanges = async () => {
    setInProgress(true);
    axiosPrivate
      .put(`/api/Draft/UpdateDraft/${draftId}`, {
        Content: postContent,
        CharacterCount: characterCount,
      })
      .then((response) => {
        console.log(response);
        setInProgress(false);
        if (response.status == 200) {
          handleCreatePostModalClose();
          setNumberOfDrafts((prevDrafts) => prevDrafts + 1);
          axiosPrivate
            .get(`/api/Draft/GetDrafts/${localStorage.getItem("loginid")}`)
            .then((response) => {
              const data = response.data;
              setDrafts(data);
            });

          console.log("Draft updated successfully");
        }
      });
  };

  const [open, setOpen] = React.useState(false);

  const handlePostEvent = () => {
    setOpen(true);
    setTimeout(() => {
      setOpen(false);
    }, 6000);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const sendPost = async () => {
    setInProgress(true);

    axiosPrivate.delete(`/api/Draft/DeleteDraft/${draftId}`).then((res) => {
      console.log(res.status);
    });

    axiosPrivate
      .post("/api/Post/CreatePost", {
        Content: postContent,
        AuthorId: localStorage.getItem("userId"),
        CharacterCount: characterCount,
      })
      .then((response) => {
        console.log(response);
        setInProgress(false);
        if (response.status == 200) {
          handlePostEvent();
          handleCreatePostModalClose();

          console.log("Draft saved successfully");
        }
      });
  };

  const action = (
    <>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </>
  );

  return (
    <>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message="Post sent successfully"
        action={action}
        color="primary"
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      />
      <Modal
        open={createPostModelOpen}
        onClose={handleCreatePostModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={MODAL_STYLES}>
          <IconButton onClick={handleCreatePostModalClose}>
            <CloseOutlinedIcon></CloseOutlinedIcon>
          </IconButton>
          <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
            <Avatar
              //   alt="Remy Sharp"
              src={localStorage.getItem("displayPictureURL")} // "https://ik.imagekit.io/pluipdnq6/2e2a4b2e-c906-4698-8a7e-81d8844ea53b_wDSAkdgJC"
              sx={{
                width: 56,
                height: 56,
              }}
            />
          </Box>
          <Typography
            variant="h6"
            component="h2"
            sx={{ display: "flex", justifyContent: "center" }}
          >
            {localStorage.getItem("name")}
          </Typography>
          <TextField
            sx={{ display: "flex", justifyContent: "center", mt: 3 }}
            id="outlined-multiline-static"
            // label="Multiline"
            multiline
            onChange={(e) => calculateProgress(e)}
            disabled={inProgress}
            // rows={4}
            defaultValue={isUpdate ? content : null}
          />
          <Box sx={{ display: "flex", justifyContent: "end", gap: 2, mt: 3 }}>
            {inProgress && (
              <>
                <Typography>Saving...</Typography>
                <CircularProgress />
              </>
            )}
            <CircularProgress variant="determinate" value={progress} />
            {isUpdate ? (
              <Button
                variant="outlined"
                size="small"
                color="error"
                disabled={inProgress}
                onClick={handleCreatePostModalClose}
              >
                Do not save
              </Button>
            ) : null}
            <Button
              variant="outlined"
              size="small"
              //   sx={{ flex: 1 }}
              onClick={isUpdate ? saveChanges : saveAsDraft}
              disabled={inProgress}
            >
              {isUpdate ? "Save changes" : "Save As Draft"}
            </Button>
            <Button
              size="small"
              variant="contained"
              disabled={inProgress}
              //   sx={{ flex: 1 }}
              onClick={() => sendPost()}
            >
              Send
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

CreatePost.defaultProps = {
  isUpdate: false,
  content: "",
  draftId: 0,
};

export default CreatePost;
