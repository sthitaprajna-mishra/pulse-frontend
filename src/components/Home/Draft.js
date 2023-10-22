import {
  Card,
  CardActions,
  CardContent,
  IconButton,
  Typography,
  Button,
  Box,
  Modal,
  Snackbar,
  Alert,
  Stack,
} from "@mui/material";
import DriveFileRenameOutlineOutlinedIcon from "@mui/icons-material/DriveFileRenameOutlineOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import React, { useEffect, useState } from "react";
import { getTimeAgo, formatDate } from "../Utility/TimeHelpers";
import { axiosPrivate } from "../../api/axios";
import InProgress from "../Utility/InProgress";
import CreatePost from "./CreatePost";

const MODAL_STYLES = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  // width: 400,
  width: "80%",
  maxWidth: "600px",
  bgcolor: "background.paper",
  border: "2px solid #fff",
  borderRadius: 0.5,
  boxShadow: 24,
  p: 4,
  // overflowY: "scroll",
};

const Draft = ({
  draftId,
  content,
  createDate,
  updateDate,
  authorId,
  characterCount,
  setDrafts,
  setNumberOfDrafts,
}) => {
  const [progress, setProgress] = useState(0);

  const [createPostModelOpen, setCreatePostModalOpen] = useState(false);
  const handleCreatePostModalOpen = () => {
    setCreatePostModalOpen(true);
    // document.body.style.overflow = "hidden";
  };
  const handleCreatePostModalClose = () => {
    setCreatePostModalOpen(false);
    setProgress(0);
    // document.body.style.overflow = "";
  };

  const [displayedContent, setDisplayedContent] = useState();
  const [showContent, setShowContent] = useState(false);
  const [buttonText, setButtonText] = useState();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleDeleteModalOpen = () => {
    setDeleteModalOpen(true);
  };
  const handleDeleteModalClose = () => {
    setDeleteModalOpen(false);
  };

  const [openNotif, setOpenNotif] = useState(false);
  const [notifMessage, setNotifMessage] = useState();
  const [severity, setSeverity] = useState("success");

  const handleDeleteDraftResponse = (result) => {
    if (result === "success") {
      setNotifMessage("Draft deleted successfully.");
    } else {
      setSeverity("error");
      setNotifMessage("Error occurred!");
    }

    setOpenNotif(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenNotif(false);
  };

  const [inProgress, setInProgress] = useState(null);

  const deleteDraft = async () => {
    setInProgress("inprocess");
    handleDeleteModalClose();
    axiosPrivate.delete(`/api/Draft/DeleteDraft/${draftId}`).then((res) => {
      setInProgress("processed");
      if (res.status == 200) {
        handleDeleteDraftResponse("success");
        setDrafts((prevDrafts) =>
          prevDrafts.filter((draft) => draft.draftId !== draftId)
        );
        setNumberOfDrafts((prev) => prev - 1);
      } else {
        handleDeleteDraftResponse("failure");
      }
    });
    // handleClick();
  };

  useEffect(() => {
    if (characterCount > 30) {
      setDisplayedContent(content.slice(0, 30) + "...");
      setButtonText("Read more");
    } else {
      setDisplayedContent(content);
    }
  }, []);

  const showMore = () => {
    if (!showContent) {
      setDisplayedContent(content);
      setShowContent(true);
      setButtonText("Read less");
    } else {
      setDisplayedContent(content.slice(0, 30) + "...");
      setShowContent(false);
      setButtonText("Read more");
    }
  };

  const contentStyle = showContent
    ? {
        textAlign: "left",
      }
    : {
        textAlign: "left",
        maxHeight: "2rem",
        overflow: "hidden",
      };

  return (
    <>
      {inProgress == "inProcess" ? <InProgress /> : null}

      {createPostModelOpen ? (
        <CreatePost
          progress={progress}
          setProgress={setProgress}
          createPostModelOpen={createPostModelOpen}
          handleCreatePostModalClose={handleCreatePostModalClose}
          MODAL_STYLES={MODAL_STYLES}
          setNumberOfDrafts={setNumberOfDrafts}
          setDrafts={setDrafts}
          isUpdate={true}
          content={content}
          draftId={draftId}
        />
      ) : null}

      <Snackbar
        open={openNotif}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity={severity}
          sx={{ width: "100%" }}
          //   color={severity == "success" ? "primary" : null}
        >
          {notifMessage}
        </Alert>
      </Snackbar>

      <Modal
        open={deleteModalOpen}
        onClose={handleDeleteModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{ ...MODAL_STYLES, width: 400, maxWidth: 400 }}>
          <Typography>Are you sure you want to delete this draft?</Typography>
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
              onClick={() => handleDeleteModalClose()}
            >
              No
            </Button>
            <Button
              variant="outlined"
              color="error"
              sx={{ flex: 1 }}
              onClick={() => deleteDraft()}
            >
              Yes
            </Button>
          </Box>
        </Box>
      </Modal>

      <Card
        sx={{
          m: 1,
          "&:hover": {
            bgcolor: "#F5F5F5",
            cursor: "pointer",
            transition: "background-color 0.3s",
          },
        }}
      >
        <CardContent
          sx={{
            display: "flex",
            justifyContent: "end",
            m: 2,
            p: 0,
            color: "#778da9",
          }}
        >
          <Typography sx={{ fontSize: 12, fontStyle: "italic" }}>
            Last updated{" "}
            {
              <Typography
                component="span"
                sx={{ fontSize: 12, fontWeight: "bold", color: "#181f3f" }}
              >
                {getTimeAgo(updateDate)}
              </Typography>
            }{" "}
            ago on{" "}
            {
              <Typography
                component="span"
                sx={{
                  fontSize: 12,
                  fontWeight: "bold",
                  color: "#181f3f",
                }}
              >
                {formatDate(updateDate)}
              </Typography>
            }
          </Typography>
        </CardContent>
        <CardContent sx={{ py: 0 }}>
          <pre>
            <Typography sx={contentStyle}>{displayedContent}</Typography>
          </pre>
        </CardContent>
        <CardActions
          sx={{ display: "flex", justifyContent: "space-between", px: 2 }}
        >
          <Box>
            <Button size="small" onClick={handleCreatePostModalOpen}>
              <IconButton color="primary">
                <DriveFileRenameOutlineOutlinedIcon />
              </IconButton>
              <Typography>Edit</Typography>
            </Button>
            <Button
              size="small"
              color="error"
              onClick={() => handleDeleteModalOpen()}
            >
              <IconButton color="error">
                <DeleteOutlinedIcon />
              </IconButton>
              <Typography>Delete</Typography>
            </Button>
          </Box>
          {characterCount > 30 ? (
            <Box onClick={() => showMore()}>
              <Button size="small">{buttonText}</Button>
            </Box>
          ) : null}
        </CardActions>
      </Card>
    </>
  );
};

export default Draft;
