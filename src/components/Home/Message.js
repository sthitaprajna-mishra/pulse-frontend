import React, { useEffect, useState } from "react";
import { Box, Typography, Avatar } from "@mui/material";
import { extractTime } from "../Utility/TimeHelpers";

const Message = ({ message }) => {
  const [loggedInUserMessage, setLoggedInUserMessage] = useState(true);

  useEffect(() => {
    if (message.senderId !== localStorage.getItem("userId")) {
      setLoggedInUserMessage(false);
    }
  }, []);

  return (
    <Box
      px={0.5}
      //   border="1px solid red"
      display="flex"
      justifyContent={loggedInUserMessage ? "end" : "start"}
    >
      {/* <Box
        maxWidth="80%"
        padding={1}
        borderRadius="0.5rem"
        bgcolor={loggedInUserMessage ? "#EFF3F4" : "#1D9BF0"}
      >
        <Typography
          fontSize="0.9rem"
          color={loggedInUserMessage ? "#000000" : "#FFFFFF"}
        >
          {message.messageText}
        </Typography>
        <Box mt={1}>
          <Typography
            textAlign={loggedInUserMessage ? "left" : "right"}
            fontSize="0.65rem"
            color={loggedInUserMessage ? "#808080" : "#FFFFFF"}
          >
            {extractTime(message.createDate)}
          </Typography>
        </Box>
      </Box> */}

      <Box
        sx={{
          backgroundColor: loggedInUserMessage ? "#EFF3F4" : "#1976d2",
          color: loggedInUserMessage ? "#000000" : "#FFFFFF",
          fontSize: 14,
          display: "flex",
          flexDirection: "column",
          width: "fit-content",
          minWidth: "10%",
          maxWidth: "85%",
          padding: 1,
          textAlign: "left",
          border: 0,
          borderRadius: 1,
          marginBottom: 2,
          boxShadow:
            "0 1px 2px 0 rgba(0, 0, 0, 0.2), 0 2.5px 5px 0 rgba(0, 0, 0, 0.19);",
        }}
      >
        <Box>{message.messageText}</Box>
        <Box
          sx={{
            textAlign: "right",
            fontSize: 10,
            color: loggedInUserMessage ? "#808080" : "#E0F0F0",
          }}
        >
          {extractTime(message.createDate)}
        </Box>
      </Box>
    </Box>
  );
};

export default Message;
