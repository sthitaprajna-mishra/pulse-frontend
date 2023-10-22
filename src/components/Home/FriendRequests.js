import React, { useState, useEffect } from "react";
import FriendRequest from "./FriendRequest";
import { axiosPrivate } from "../../api/axios";
import InProgress from "../Utility/InProgress";
import Heading from "./Heading";

const FriendRequests = ({
  friendRequests,
  setNumberOfFriendRequests,
  setFriendRequests,
  numberOfFriendRequests,
}) => {
  //   const [friendRequests, setFriendRequests] = useState([]);
  const [inProgress, setInProgress] = useState(null);

  return (
    <>
      <Heading title="Friend Requests" num={numberOfFriendRequests} />
      {friendRequests.map((friendRequest, index) => {
        return (
          <FriendRequest
            friendRequests={friendRequests}
            setFriendRequests={setFriendRequests}
            setNumberOfFriendRequests={setNumberOfFriendRequests}
            key={index}
            userId={friendRequest.senderId}
            userFullName={friendRequest.senderName}
            userUserName={friendRequest.senderUserName}
            userDP={friendRequest.senderDPURL}
            requestId={friendRequest.friendRequestId}
          />
        );
      })}

      {inProgress === "loading" ? <InProgress /> : <></>}
    </>
  );
};

export default FriendRequests;
