import React, { useEffect, useState } from "react";
import { axiosPrivate } from "../../api/axios";
import Post from "./Post";
import Heading from "./Heading";
import InProgress from "../Utility/InProgress";

const Posts = ({ setSelectedUserProfileId }) => {
  const skeletonLength = 10;
  const items = Array.from({ skeletonLength });

  const [loadFinished, setLoadFinished] = useState(false);
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const loadPosts = async () => {
    try {
      const response = await axiosPrivate.get(
        `/api/Post/GetPosts/${localStorage.getItem(
          "loginid"
        )}?pageNumber=${currentPage}&pageSize=${pageSize}`
      );
      const newPosts = response.data;

      // Combine existing posts and new posts
      const allPosts = [...posts, ...newPosts];

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
      setPosts(uniquePosts);
      // all posts loaded
      setLoadFinished(true);
    } catch (error) {
      // Handle error
      console.log(error);
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
      // Load more posts when the user is close to the bottom
      setCurrentPage((prevPage) => prevPage + 1);
    }
  }, 500); // Adjust the debounce delay (in milliseconds) as needed

  useEffect(() => {
    loadPosts();
  }, [currentPage]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <>
      <Heading title="Home" />
      <ul>
        {loadFinished ? (
          posts.length == 0 ? (
            <h3>No posts to show.</h3>
          ) : (
            posts.map((post) => {
              return (
                <Post
                  post={post}
                  posts={posts}
                  setPosts={setPosts}
                  key={post.postId}
                  setSelectedUserProfileId={setSelectedUserProfileId}
                />
              );
            })
          )
        ) : (
          <InProgress />
        )}
      </ul>
    </>
  );
};

export default Posts;
