import React, { useEffect, useState } from "react";
import { axiosPrivate } from "../../api/axios";
import UserProfilePost from "./UserProfilePost";
import Heading from "./Heading";
import SkeletonNotification from "../Utility/SkeletonNotification";

const UserProfilePosts = ({ userId, setSelectedUserProfileId }) => {
  const [userProfilePosts, setUserProfilePosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // console.log(`inside user profile posts`);
  // console.log(`currentPage: ${currentPage}`);

  const loadPosts = async () => {
    try {
      // console.log(userId);
      const response = await axiosPrivate.get(
        `/api/Post/GetUserPosts/?loggedInUserId=${localStorage.getItem(
          "userId"
        )}&userId=${userId}&pageNumber=${currentPage}&pageSize=${pageSize}`
      );
      // console.log(response);
      const newPosts = response.data;
      // Combine existing posts and new posts
      let allPosts = [...userProfilePosts, ...newPosts];

      if (userProfilePosts.length > 0) {
        if (userProfilePosts[0].authorId !== userId) {
          // console.log(`userProfilePosts[0].authorId !== userId`);
          // console.log(newPosts);

          allPosts = [...newPosts];
        } else {
          allPosts = [...userProfilePosts, ...newPosts];
        }
      } else {
        allPosts = [...userProfilePosts, ...newPosts];
      }

      // Create a Set with unique post IDs
      const uniquePostIds = new Set();

      // Filter out duplicate posts based on post ID
      const uniquePosts = allPosts.filter((post) => {
        if (!uniquePostIds.has(post.postId)) {
          uniquePostIds.add(post.postId);
          return true;
        }
        return false;
      });

      // Update the state with the unique posts
      setUserProfilePosts(uniquePosts);
    } catch (error) {
      // Handle error
      // console.log(error);
    }
  };

  // Debounce function
  const debounce = (fn, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        fn(...args);
      }, delay);
    };
  };

  const handleScroll = debounce(() => {
    const { scrollHeight, scrollTop, clientHeight } = document.documentElement;

    // Calculate the distance between the bottom of the page and the current scroll position
    const distanceToBottom = scrollHeight - (scrollTop + clientHeight);

    // Check if the user is close to the bottom (considering a 50px threshold)
    if (distanceToBottom < 50) {
      // Load more userProfilePosts when the user is close to the bottom
      setCurrentPage((prevPage) => prevPage + 1);
    }
  }, 500); // Adjust the debounce delay (in milliseconds) as needed

  useEffect(() => {
    // console.log("call useeffect");
    loadPosts();
  }, [currentPage]);

  useEffect(() => {
    loadPosts();
    setCurrentPage(1);
    setUserProfilePosts([]);
  }, [userId]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <>
      {/* <Heading title="User Posts" /> */}
      <div>
        {userProfilePosts ? (
          userProfilePosts.map((post) => {
            return (
              <UserProfilePost
                post={post}
                setSelectedUserProfileId={setSelectedUserProfileId}
                userProfilePosts={userProfilePosts}
                setUserProfilePosts={setUserProfilePosts}
                key={post.postId}
              />
            );
          })
        ) : (
          <SkeletonNotification />
        )}
      </div>
    </>
  );
};

export default UserProfilePosts;
