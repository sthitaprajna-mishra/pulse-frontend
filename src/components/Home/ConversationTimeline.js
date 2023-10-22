import React, { useState, useEffect, useRef } from "react";
import { axiosPrivate } from "../../api/axios";
import { Box, Typography, Avatar, TextField, Button } from "@mui/material";
import Message from "./Message";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { formatDateInternational } from "../Utility/TimeHelpers";
import "../../styles.css";
import InProgress from "../Utility/InProgress";

const ConversationTimeline = ({
  conversationId,
  conversations,
  setConversations,
}) => {
  const messagesEndRef = useRef(null);

  const [uniqueConvos, setUniqueConvos] = useState([]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  //   const messagesContainerRef = useRef(null); // Ref for the messages container
  const [writtenMessage, setWrittenMessage] = useState("");

  const [messages, setMessages] = useState([]);
  const [DP, setDP] = useState(null);
  const [name, setName] = useState(null);
  const [userName, setUserName] = useState(null);

  const fetchMessages = async () => {
    const response = await axiosPrivate.get(
      `/api/Conversation/GetAllMessagesForConversation/${conversationId}/${localStorage.getItem(
        "userId"
      )}`
    );
    const data = response.data;
    if (data.length > 0) {
      setDP(data[0].participantDPURL);
      setName(data[0].participantName);
      setUserName(data[0].participantUserName);
    }
    setMessages(data);

    // Scroll to the latest message after messages are updated
    scrollToBottom();

    // Automatically scroll down to show new messages
    // if (messagesContainerRef.current) {
    //   messagesContainerRef.current.scrollTop =
    //     messagesContainerRef.current.scrollHeight;
    // }
  };

  // Scroll to the bottom whenever messages are updated
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    let clientId = localStorage.getItem("userId");

    console.log(clientId);

    // Connect to the SignalR hub
    const connection = new HubConnectionBuilder()
      .withUrl(
        `https://closeconnect.azurewebsites.net/hubs/conversations?clientId=${clientId}`
      )
      .withAutomaticReconnect()
      .build();

    // Start the connection
    connection.start().then(
      () => {
        console.log("Chat Connection established");
      },
      () => {
        console.log("Chat Rejected");
      }
    );

    // Listen for incoming notifications
    connection.on("ReceiveMessage", (result) => {
      console.log("received something");
      console.log(result);
      setMessages((prev) => [...prev, result.message]);
      const newConversation = result.conversation;

      updateUniqueConvos([...conversations, newConversation]);

      // Scroll to the latest message after messages are updated
      scrollToBottom();

      // Automatically scroll down to show new messages
      //   if (messagesContainerRef.current) {
      //     messagesContainerRef.current.scrollTop =
      //       messagesContainerRef.current.scrollHeight;
      //   }
    });

    // Fetch existing notifications from the server when the component mounts
    fetchMessages();
    // Clean up the connection on unmount
    return () => {
      connection.stop();
    };
  }, []);

  const updateUniqueConvos = (allConversations) => {
    const newConvos = new Map();

    console.log(JSON.stringify(allConversations, null, 4));

    allConversations.forEach((conversation) => {
      if (newConvos.has(conversation.conversationId)) {
        newConvos.delete(conversation.conversationId);
      }
      newConvos.set(conversation.conversationId, conversation);
    });

    const updatedConvos = Array.from(newConvos.values());

    setConversations(updatedConvos);
  };

  const sendMessage = async () => {
    if (writtenMessage.trim().length === 0) {
      return;
    }

    const response = await axiosPrivate.post(`/api/Conversation/SendMessage`, {
      ConversationId: conversationId,
      IsInitialMessage: "N",
      SenderId: localStorage.getItem("userId"),
      ReceiverId: messages[0].participantId,
      MessageText: writtenMessage,
    });

    if (response.status === 200) {
      setMessages((prev) => [...prev, response.data.message]);
      const newConversation = response.data.conversation;

      updateUniqueConvos([...conversations, newConversation]);

      //   setConversations((prev) => [...prev, response.data.conversation]);
      setWrittenMessage("");
    }
    console.log(response);
  };

  return (
    <>
      {DP !== null ? (
        <Box
          sx={{
            // bgColor: "",
            position: "sticky",
            top: 0,
            p: 4,
            display: "flex",
            justifyContent: "start",
            columnGap: 2,
            // border: "1px solid #EFF3F4",
            bgcolor: "#EFF3F4",
            // "&:hover": {
            // //   bgcolor: "#EFF3F4",
            //   //   cursor: "pointer",
            // //   transition: "0.3s all",
            // },
          }}
        >
          <Avatar
            src={DP} // "https://ik.imagekit.io/pluipdnq6/2e2a4b2e-c906-4698-8a7e-81d8844ea53b_wDSAkdgJC"
            sx={{
              width: 52,
              height: 52,
            }}
          />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "start",
              alignItems: "center",
              mt: 0.5,
            }}
          >
            <Typography fontSize="1rem" fontWeight={600}>
              {name}
            </Typography>
            <Typography mr={1.75} fontSize="0.8rem" color="#778da9">
              @{userName}
            </Typography>
          </Box>
        </Box>
      ) : (
        <InProgress />
      )}
      <p></p>
      <Box
        // ref={messagesContainerRef} // Attach the ref to the container
        sx={{
          maxHeight: "calc(100vh - 240px)", // Adjust the max height as needed
          overflowY: "scroll",
          // Hide the scrollbar
          scrollbarWidth: "none",
          "-ms-overflow-style": "none",
          "&::-webkit-scrollbar": {
            // width: "0.4em", // Set the width of the scrollbar
            display: "none", // Hide the scrollbar
          },
        }}
      >
        {messages ? (
          messages.map((message, index) => (
            <>
              {index === 0 ||
              formatDateInternational(messages[index - 1].createDate) !==
                formatDateInternational(message.createDate) ? (
                <Box display="flex" justifyContent="center">
                  <Typography
                    variant="caption"
                    borderRadius="5%"
                    sx={{
                      backgroundColor: "#EFF3F4",
                      color: "#000000",
                      px: 1,
                      py: 0.25,
                    }}
                  >
                    {formatDateInternational(message.createDate)}
                  </Typography>
                </Box>
              ) : null}
              <Message key={message.messageId} message={message} />
            </>
          ))
        ) : (
          <InProgress />
        )}
        <div
          style={{ float: "left", clear: "both" }}
          ref={messagesEndRef}
        ></div>
      </Box>

      <Typography sx={{ mt: "6rem" }}></Typography>
      <Box
        bgcolor="#FFFFFF"
        py={2}
        position="fixed"
        bottom="0rem"
        display="flex"
        columnGap={1}
        justifyContent="space-between"
        sx={{
          width: "56.5%", // Default width for screens below 600px
          "@media (min-width: 1281px)": {
            width: "46%", // Width for screens greater than or equal to 600px
          },
        }}
      >
        <TextField
          value={writtenMessage}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
          onChange={(e) => setWrittenMessage(e.target.value)}
          sx={{
            flex: 5,
          }}
          InputProps={{ disableUnderline: true }}
          maxRows={1}
          variant="filled"
          //   multiline
        />
        <Button
          type="submit"
          onClick={sendMessage}
          sx={{ mr: 1 }}
          variant="contained"
          size="small"
        >
          <SendOutlinedIcon />
        </Button>
      </Box>
    </>
  );
};

export default ConversationTimeline;
