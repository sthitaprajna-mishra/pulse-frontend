import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";
import { getTimeAgo, formatDate } from "../Utility/TimeHelpers";
import { axiosPrivate } from "../../api/axios";

const bull = (
  <Box
    component="span"
    sx={{ display: "inline-block", mx: "2px", transform: "scale(0.8)" }}
  >
    •
  </Box>
);

const Conversation = ({
  conversations,
  setConversations,
  conversation,
  setSelectedUserProfileId,
  setSelectedConversation,
  setNumberOfConversations,
}) => {
  const handleConversationClick = () => {
    const updatedConversations = conversations.map((conv) => {
      if (conv.conversationId === conversation.conversationId) {
        return { ...conv, isRead: true };
      }
      return conv;
    });
    const count = updatedConversations.reduce((count, obj) => {
      if (!obj.isRead) {
        return count + 1;
      }
      return count;
    }, 0);
    setNumberOfConversations(count);
    setConversations(updatedConversations);

    setSelectedConversation(conversation.conversationId);
  };

  return (
    <Card
      sx={{
        borderRadius: 0,
        bgcolor:
          !conversation.isRead &&
          conversation.conversationPreviewUserId !==
            localStorage.getItem("userId")
            ? "#bde0fe"
            : "#FFFEFE",
        "&:hover": {
          bgcolor:
            !conversation.isRead &&
            conversation.conversationPreviewUserId !==
              localStorage.getItem("userId")
              ? "#a2d2ff"
              : "#EFF3F4",
          cursor: "pointer",
          transition: "0.3s all",
        },
      }}
      onClick={handleConversationClick}
      // sx={{ maxWidth: 345 }}
    >
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", columnGap: 1 }}>
            <Avatar
              src={conversation.participantDPURL} // "https://ik.imagekit.io/pluipdnq6/2e2a4b2e-c906-4698-8a7e-81d8844ea53b_wDSAkdgJC"
              sx={{
                width: 44,
                height: 44,
              }}
              onClick={() =>
                setSelectedUserProfileId(conversation.participantId)
              }
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "start",
                alignItems: "center",
                columnGap: 1,
                paddingLeft: 1,
              }}
            >
              <Typography
                fontSize="1rem"
                fontWeight={600}
                sx={{
                  "&:hover": {
                    textDecoration: "underline",
                    cursor: "pointer",
                  },
                }}
                onClick={() =>
                  setSelectedUserProfileId(conversation.participantId)
                }
              >
                {conversation.participantName}{" "}
              </Typography>
              <Typography fontSize="0.8rem" variant="h5" component="div">
                {bull}
              </Typography>
              <Typography
                fontWeight="200"
                color="#778da9"
                sx={{
                  "&:hover": {
                    textDecoration: "underline",
                    cursor: "pointer",
                  },
                }}
                onClick={() =>
                  setSelectedUserProfileId(conversation.participantId)
                }
              >
                @{conversation.participantUserName}
              </Typography>
            </Box>
          </Box>

          <Box mt={0.5}>
            <Typography fontWeight="200" color="#778da9">
              {getTimeAgo(conversation.latestDate).includes("week")
                ? formatDate(conversation.latestDate)
                : getTimeAgo(conversation.latestDate)}
            </Typography>
          </Box>
        </Box>

        <Typography
          textAlign="left"
          variant="body2"
          color={
            !conversation.isRead &&
            conversation.conversationPreviewUserId !==
              localStorage.getItem("userId")
              ? "#000000"
              : "#778da9"
          }
          paddingLeft={7.5}
          fontWeight={
            !conversation.isRead &&
            conversation.conversationPreviewUserId !==
              localStorage.getItem("userId")
              ? "700"
              : "200"
          }
        >
          {conversation.conversationPreviewUserId !==
          localStorage.getItem("userId")
            ? conversation.conversationPreview
            : `You: ${conversation.conversationPreview}`}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default Conversation;
