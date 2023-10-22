import React from "react";
import Heading from "./Heading";
import Draft from "./Draft";

const Drafts = ({ drafts, numberOfDrafts, setDrafts, setNumberOfDrafts }) => {
  console.log(`numberOfDrafts: ${numberOfDrafts}`);
  return (
    <>
      <Heading title="Drafts" num={numberOfDrafts} />
      <ul>
        {" "}
        {drafts.map((draft) => {
          return (
            <>
              <Draft
                key={draft.draftId}
                {...draft}
                setDrafts={setDrafts}
                setNumberOfDrafts={setNumberOfDrafts}
              />
            </>
          );
        })}
      </ul>
    </>
  );
};

export default Drafts;
