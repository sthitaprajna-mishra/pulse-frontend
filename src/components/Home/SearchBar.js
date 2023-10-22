import React, { useState, useEffect } from "react";
import { styled, alpha } from "@mui/material/styles";
import { Box, Button, InputBase, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { axiosPrivate } from "../../api/axios";
import SearchUserResult from "./SearchUserResult";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  maxWidth: "350px",
  borderRadius: "20px", //theme.shape.borderRadius,
  backgroundColor: "#EFF3F4", //alpha(theme.palette.common., 0.15),
  border: "1px solid #EFF3F4",
  "&:hover": {
    border: "1px solid #1D9BF0",
    backgroundColor: alpha(theme.palette.common.white, 0.25),
    transition: "all 0.3s",
  },
  marginLeft: 0,
  marginTop: 8,
  paddingTop: "5px",
  paddingBottom: "5px",
  //   width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  top: "1px",
}));

const SearchBar = ({
  onComponentSelect,
  setSearchTermMain,
  setSelectedUserProfileId,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [allSearchResults, setAllSearchResults] = useState([]);

  const handleIconClick = (component) => {
    setSelectedUserProfileId(null);
    onComponentSelect(component);
    setSearchTermMain(searchTerm);
    setSearchTerm("");
    setSearchResults([]);
    setAllSearchResults([]);
  };

  useEffect(() => {
    if (searchTerm) {
      axiosPrivate
        .get(
          `/api/User/Search/${localStorage.getItem("loginid")}/${searchTerm}/`
        )
        .then((response) => {
          console.log(response.data);
          const users = response.data.filter(
            (user) => user.id !== localStorage.getItem("userId")
          );
          setSearchResults(users.slice(0, 5));
          setAllSearchResults(users);
          setShowMore(users.length > 5);
        })
        .catch((error) => {
          console.error("Error fetching search results:", error);
        });
    } else {
      setSearchResults([]);
      setShowMore(false);
      setAllSearchResults([]);
    }
  }, [searchTerm]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleShowMore = () => {
    setSearchResults(allSearchResults);
    setShowMore(false);
  };

  return (
    <>
      <Search>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <InputBase
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search Pulse"
        />
      </Search>
      {searchResults.length > 0 && (
        <Box ml={2} sx={{ boxShadow: "0 0 20px rgba(0, 0, 0, 0.1)" }}>
          {searchResults.map((user) => {
            return (
              <SearchUserResult
                id={user.id}
                name={user.name}
                userName={user.userName}
                displayPictureURL={user.displayPictureURL}
                emailConfirmed={user.emailConfirmed}
                relationshipWithLoggedInUser={user.relationshipWithLoggedInUser}
                setSelectedUserProfileId={setSelectedUserProfileId}
              />
            );
          })}
          {showMore && (
            <Button
              sx={{ my: 1 }}
              variant="outlined"
              onClick={() => handleIconClick("SearchBarMain")}
            >
              Show More
            </Button>
          )}
        </Box>
      )}
    </>
  );
};

export default SearchBar;
