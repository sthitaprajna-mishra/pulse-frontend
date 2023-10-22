import React, { useState, useEffect } from "react";
import Conversation from "./Conversation";
import Heading from "./Heading";

const Inbox = ({
  conversations,
  setConversations,
  numberOfConversations,
  setNumberOfConversations,
  setSelectedUserProfileId,
  setSelectedConversation,
}) => {
  return (
    <>
      <Heading title="Conversations" num={numberOfConversations} />
      <ul>
        {conversations.map((conversation) => {
          return (
            <Conversation
              key={conversation.conversationId}
              conversations={conversations}
              setConversations={setConversations}
              conversation={conversation}
              setSelectedUserProfileId={setSelectedUserProfileId}
              setSelectedConversation={setSelectedConversation}
              setNumberOfConversations={setNumberOfConversations}
            />
          );
        })}
      </ul>
    </>
  );
};

export default Inbox;
