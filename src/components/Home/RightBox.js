import React from "react";
import Happenings from "./Happenings";
import SearchBar from "./SearchBar";
import WhoToFollow from "./WhoToFollow";
import Fineprint from "./Fineprint";

const RightBox = ({
  onComponentSelect,
  setSearchTermMain,
  setSelectedUserProfileId,
}) => {
  return (
    <>
      <SearchBar
        onComponentSelect={onComponentSelect}
        setSearchTermMain={setSearchTermMain}
        setSelectedUserProfileId={setSelectedUserProfileId}
      />
      <Happenings />
      {/* <WhoToFollow /> */}
      <Fineprint />
    </>
  );
};

export default RightBox;
